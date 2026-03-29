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

    // Extract all unique student IDs across all classrooms
    const allStudentIds = new Set();
    (classrooms || []).forEach(cls => {
      (cls.memberships || []).forEach(m => allStudentIds.add(m.student_id));
    });

    const uniqueStudentIdsArray = Array.from(allStudentIds);
    let allLogs = [];

    // Fetch all logs for these students in a single query
    if (uniqueStudentIdsArray.length > 0) {
      const { data: experimentLogs, error: logError } = await supabase
        .from('experiment_results')
        .select('id, user_id, outcome_label, score, experiment_type, created_at')
        .in('user_id', uniqueStudentIdsArray)
        .order('created_at', { ascending: false })
        .limit(5000); // Higher limit as we fetch for all classrooms at once
        
      if (logError) {
        console.error('[getAnalytics] Log fetch error:', logError.message);
      } else {
        allLogs = experimentLogs || [];
      }
    }

    // Group logs by student ID for O(1) lookups
    const logsByStudent = new Map();
    allLogs.forEach(log => {
      if (!logsByStudent.has(log.user_id)) {
        logsByStudent.set(log.user_id, []);
      }
      logsByStudent.get(log.user_id).push(log);
    });

    const analytics = (classrooms || []).map((cls) => {
      const studentIds = (cls.memberships || []).map(m => m.student_id);

      let logs = [];
      studentIds.forEach(id => {
        if (logsByStudent.has(id)) {
          logs = logs.concat(logsByStudent.get(id));
        }
      });

      // Sort logs by created_at descending just in case the order was lost during concat
      logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

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
