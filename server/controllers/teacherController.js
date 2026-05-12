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

    // Collect all unique student IDs across all classrooms
    const allStudentIdsSet = new Set();
    (classrooms || []).forEach(cls => {
      (cls.memberships || []).forEach(m => {
        if (m.student_id) allStudentIdsSet.add(m.student_id);
      });
    });
    const allStudentIds = Array.from(allStudentIdsSet);

    // Fetch all logs for all students in one query
    let allLogs = [];
    if (allStudentIds.length > 0) {
      const { data: experimentLogs } = await supabase
        .from('experiment_results')
        .select('id, user_id, outcome_label, score, experiment_type, created_at')
        .in('user_id', allStudentIds)
        .order('created_at', { ascending: false });
      allLogs = experimentLogs || [];
    }

    // Group logs by student ID for fast lookup
    const logsByStudent = {};
    allLogs.forEach(log => {
      if (!logsByStudent[log.user_id]) {
        logsByStudent[log.user_id] = [];
      }
      logsByStudent[log.user_id].push(log);
    });

    const analytics = (classrooms || []).map((cls) => {
      const studentIds = (cls.memberships || []).map(m => m.student_id);

      let logs = [];
      studentIds.forEach(id => {
        if (logsByStudent[id]) {
          logs = logs.concat(logsByStudent[id]);
        }
      });
      // Re-sort the combined logs for this classroom
      logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      const uniqueStudents = new Set(studentIds).size;
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
