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

    // OPTIMIZATION: Collect all student IDs to fetch experiment_results in one query
    const allStudentIds = classrooms
      ? classrooms.flatMap(cls => (cls.memberships || []).map(m => m.student_id))
      : [];
    const uniqueStudentIds = [...new Set(allStudentIds)];

    let allLogs = [];
    if (uniqueStudentIds.length > 0) {
      const { data: experimentLogs } = await supabase
        .from('experiment_results')
        .select('id, user_id, outcome_label, score, experiment_type, created_at')
        .in('user_id', uniqueStudentIds)
        .order('created_at', { ascending: false })
        .limit(5000);
      allLogs = experimentLogs || [];
    }

    const analytics = (classrooms || []).map((cls) => {
      const studentIds = (cls.memberships || []).map(m => m.student_id);

      const studentSet = new Set(studentIds);
      const logs = allLogs.filter(l => studentSet.has(l.user_id));

      const uniqueStudents = studentSet.size;
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
