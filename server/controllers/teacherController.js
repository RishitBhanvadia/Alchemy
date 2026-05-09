const { success, error } = require('../utils/response');
const supabase = require('../supabaseClient');

exports.getAnalytics = async (req, res) => {
  try {
    const { data: classrooms, error: dbError } = await supabase
      .from('classrooms')
      .select(`
        id, class_name, class_code, created_at,
        memberships:class_memberships(
          id, student_id, joined_at,
          student:profiles(id, full_name, email)
        )
      `)
      .eq('teacher_id', req.user.id);

    if (dbError) {
      console.error('[getAnalytics] DB error:', dbError.message);
      throw dbError;
    }

    const analytics = await Promise.all(
      (classrooms || []).map(async (cls) => {
        const studentIds = (cls.memberships || []).map(m => m.student_id);
        
        let logs = [];
        if (studentIds.length > 0) {
          const { data: experimentLogs } = await supabase
            .from('experiment_results')
            .select('id, outcome_label, score, experiment_type, created_at')
            .in('user_id', studentIds)
            .order('created_at', { ascending: false })
            .limit(500);
          logs = experimentLogs || [];
        }

        const uniqueStudents = new Set(studentIds).size;
        const validScores = logs.map(l => l.score || 0).filter(s => s >= 0);
        const avgScore = validScores.length > 0
          ? Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length)
          : 0;

        return {
          id: cls.id,
          name: cls.class_name,
          code: cls.class_code,
          student_count: uniqueStudents,
          experiment_count: logs.length,
          average_score: avgScore,
          recent_experiments: logs.slice(0, 10).map(l => ({
            outcome: l.outcome_label,
            score: l.score,
            type: l.experiment_type,
            date: l.created_at,
          })),
        };
      })
    );

    return success(res, { classrooms: analytics });
  } catch (err) {
    console.error('[getAnalytics]', err.message);
    return error(res, 'INTERNAL_ERROR', 'Failed to fetch analytics.', 500);
  }
};
