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

    const safeClassrooms = classrooms || [];

    // Extract all student IDs from all classrooms
    const allStudentIds = safeClassrooms.reduce((ids, cls) => {
      const clsStudentIds = (cls.memberships || []).map(m => m.student_id);
      return ids.concat(clsStudentIds);
    }, []);

    // Fetch all logs in a single batched query
    let allLogs = [];
    if (allStudentIds.length > 0) {
      const { data: experimentLogs, error: logsError } = await supabase
        .from('experiment_results')
        .select('id, user_id, outcome_label, score, experiment_type, created_at')
        .in('user_id', allStudentIds)
        .order('created_at', { ascending: false })
        // Use a high limit since we are grouping by classroom later
        // A truly scalable approach would use an RPC or Lateral Join.
        .limit(10000);

      if (logsError) {
        console.error('[getAnalytics] Logs DB error:', logsError.message);
      } else {
        allLogs = experimentLogs || [];
      }
    }

    const analytics = safeClassrooms.map((cls) => {
      const studentIds = (cls.memberships || []).map(m => m.student_id);
      const studentIdSet = new Set(studentIds);

      // Filter logs for this specific classroom's students, and enforce the 500 max locally
      const clsLogs = allLogs.filter(log => studentIdSet.has(log.user_id)).slice(0, 500);

      const avgScore = clsLogs.length > 0
        ? Math.round(clsLogs.reduce((sum, l) => sum + (l.score || 0), 0) / clsLogs.length)
        : 0;

      return {
        id: cls.id,
        name: cls.class_name,
        code: cls.class_code,
        student_count: studentIdSet.size,
        experiment_count: clsLogs.length,
        average_score: avgScore,
        recent_experiments: clsLogs.slice(0, 10).map(l => ({
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
