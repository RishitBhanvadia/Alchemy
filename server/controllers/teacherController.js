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

    // ⚡ Bolt Optimization: Eliminate N+1 query problem
    // Instead of querying `experiment_results` inside a loop for each classroom,
    // we extract all unique student IDs and perform a single batch fetch.
    // This reduces database queries from O(N) to O(1).
    const allStudentIds = [...new Set((classrooms || []).flatMap(cls => (cls.memberships || []).map(m => m.student_id)))];

    let allLogs = [];
    if (allStudentIds.length > 0) {
      const { data: experimentLogs } = await supabase
        .from('experiment_results')
        .select('id, user_id, outcome_label, score, experiment_type, created_at')
        .in('user_id', allStudentIds)
        .order('created_at', { ascending: false })
        .limit(2000);
      allLogs = experimentLogs || [];
    }

    const analytics = (classrooms || []).map((cls) => {
      const studentIds = new Set((cls.memberships || []).map(m => m.student_id));

      const logs = allLogs.filter(log => studentIds.has(log.user_id));

      const uniqueStudents = studentIds.size;
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
