const { success, error } = require('../utils/response');
const supabase = require('../supabaseClient');

exports.getAnalytics = async (req, res) => {
  try {
    const { data: classrooms, error: dbError } = await supabase
      .from('classrooms')
      .select(`
        id, name, code, created_at,
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

    // Extract all unique student IDs from all classrooms
    const allStudentIds = [...new Set((classrooms || []).flatMap(cls =>
      (cls.memberships || []).map(m => m.student_id)
    ))];

    // Fetch all logs in a single query
    let allLogs = [];
    if (allStudentIds.length > 0) {
      const { data: experimentLogs } = await supabase
        .from('experiment_results')
        .select('id, user_id, outcome_label, score, experiment_type, created_at')
        .in('user_id', allStudentIds)
        .order('created_at', { ascending: false })
        .limit(5000);
      allLogs = experimentLogs || [];
    }

    // Group logs by user_id
    const logsByStudent = allLogs.reduce((acc, log) => {
      if (!acc[log.user_id]) acc[log.user_id] = [];
      acc[log.user_id].push(log);
      return acc;
    }, {});

    const analytics = (classrooms || []).map((cls) => {
      const studentIds = (cls.memberships || []).map(m => m.student_id);

      // Get all logs for students in this classroom and sort them
      const logs = studentIds.flatMap(id => logsByStudent[id] || [])
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      const uniqueStudents = new Set(studentIds).size;
      const avgScore = logs.length > 0
        ? Math.round(logs.reduce((sum, l) => sum + (l.score || 0), 0) / logs.length)
        : 0;

      return {
        id: cls.id,
        name: cls.name,
        code: cls.code,
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
