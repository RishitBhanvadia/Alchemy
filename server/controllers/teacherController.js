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

    // ⚡ Bolt Optimisation: Consolidate N+1 Supabase queries into a single batched query
    const allStudentIdsSet = new Set();
    (classrooms || []).forEach(cls => {
      (cls.memberships || []).forEach(m => {
        if (m.student_id) allStudentIdsSet.add(m.student_id);
      });
    });

    const allStudentIds = Array.from(allStudentIdsSet);

    let allLogs = [];
    if (allStudentIds.length > 0) {
      const { data: experimentLogs } = await supabase
        .from('experiment_results')
        .select('id, outcome_label, score, experiment_type, created_at, user_id')
        .in('user_id', allStudentIds)
        .order('created_at', { ascending: false })
        .limit(5000); // hard upper bound for batched query
      allLogs = experimentLogs || [];
    }

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
      studentIds.forEach(sid => {
        if (logsByStudent[sid]) {
          logs.push(...logsByStudent[sid]);
        }
      });

      // Sort combined logs descending and limit to 500 per classroom as before
      logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      logs = logs.slice(0, 500);

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
