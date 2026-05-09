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

    // OPTIMIZATION: Collect all student IDs to run ONE query instead of N+1
    const allStudentIds = new Set();
    (classrooms || []).forEach(cls => {
      (cls.memberships || []).forEach(m => allStudentIds.add(m.student_id));
    });

    let allLogs = [];
    if (allStudentIds.size > 0) {
      const { data: experimentLogs } = await supabase
        .from('experiment_results')
        .select('id, user_id, outcome_label, score, experiment_type, created_at')
        .in('user_id', Array.from(allStudentIds))
        .order('created_at', { ascending: false })
        .limit(5000);
      allLogs = experimentLogs || [];
    }

    // Group logs by student_id
    const logsByStudent = {};
    allLogs.forEach(log => {
      if (!logsByStudent[log.user_id]) {
        logsByStudent[log.user_id] = [];
      }
      logsByStudent[log.user_id].push(log);
    });

    const analytics = (classrooms || []).map(cls => {
      const studentIds = (cls.memberships || []).map(m => m.student_id);
      let clsLogs = [];
      studentIds.forEach(id => {
        if (logsByStudent[id]) {
          clsLogs = clsLogs.concat(logsByStudent[id]);
        }
      });
      // Re-sort the combined logs to ensure proper ordering within the classroom
      clsLogs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      const uniqueStudents = new Set(studentIds).size;
      const avgScore = clsLogs.length > 0
        ? Math.round(clsLogs.reduce((sum, l) => sum + (l.score || 0), 0) / clsLogs.length)
        : 0;

      return {
        id: cls.id,
        name: cls.class_name,
        code: cls.class_code,
        student_count: uniqueStudents,
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
