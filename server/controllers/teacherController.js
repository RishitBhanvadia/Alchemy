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

    // ⚡ Bolt Performance Optimisation: Batch query experiment_results
    // Why: Replaces an N+1 query bottleneck inside Promise.all with a single batched .in() query.
    // Impact: Reduces database round-trips from N to 1, significantly improving page load for teachers with many classes.
    const allStudentIds = [...new Set((classrooms || []).flatMap(cls => (cls.memberships || []).map(m => m.student_id)))];
    let allLogs = [];

    if (allStudentIds.length > 0) {
      const { data: experimentLogs } = await supabase
        .from('experiment_results')
        .select('id, user_id, outcome_label, score, experiment_type, created_at')
        .in('user_id', allStudentIds)
        .order('created_at', { ascending: false });
      allLogs = experimentLogs || [];
    }

    // Process analytics in memory
    const analytics = (classrooms || []).map((cls) => {
      const studentIdsSet = new Set((cls.memberships || []).map(m => m.student_id));
      const logs = allLogs.filter(log => studentIdsSet.has(log.user_id)).slice(0, 500);

      const uniqueStudents = studentIdsSet.size;
      const avgScore = logs.length > 0
        ? Math.round(logs.reduce((sum, l) => sum + (l.score || 0), 0) / logs.length)
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
    });

    return success(res, { classrooms: analytics });
  } catch (err) {
    console.error('[getAnalytics]', err.message);
    return error(res, 'INTERNAL_ERROR', 'Failed to fetch analytics.', 500);
  }
};
