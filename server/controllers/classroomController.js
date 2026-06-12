const { success, error } = require('../utils/response');
const supabase = require('../supabaseClient');
const { generateSecureCode } = require('../utils/random');

function generateClassCode() {
  return generateSecureCode(5);
}

exports.createClassroom = async (req, res) => {
  try {
    const { name } = req.body;

    let classCode;
    let existing;
    
    do {
      classCode = generateClassCode();
      const { data } = await supabase
        .from('classrooms')
        .select('id')
        .eq('class_code', classCode)
        .limit(1);
      existing = data && data.length > 0;
    } while (existing);

    const { data, error: dbError } = await supabase
      .from('classrooms')
      .insert({
        class_name: name.trim(),
        class_code: classCode,
        teacher_id: req.user.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('[createClassroom] DB error:', dbError.message);
      throw dbError;
    }

    return success(res, { classroom: data }, 201);
  } catch (err) {
    console.error('[createClassroom]', err.message);
    return error(res, 'INTERNAL_ERROR', 'Failed to create classroom.', 500);
  }
};

exports.joinClassroom = async (req, res) => {
  try {
    const { code } = req.body;
    const upperCode = code.toUpperCase();

    const { data: classroom, error: findError } = await supabase
      .from('classrooms')
      .select('*')
      .eq('class_code', upperCode)
      .limit(1)
      .single();

    if (findError || !classroom) {
      return error(res, 'NOT_FOUND', 'Classroom not found with this code.', 404);
    }

    const { data: existing, error: checkError } = await supabase
      .from('class_memberships')
      .select('*')
      .eq('classroom_id', classroom.id)
      .eq('student_id', req.user.id)
      .limit(1);

    if (existing && existing.length > 0) {
      return error(res, 'CONFLICT', 'You are already a member of this classroom.', 409);
    }

    const { data: membership, error: joinError } = await supabase
      .from('class_memberships')
      .insert({
        classroom_id: classroom.id,
        student_id: req.user.id,
        joined_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (joinError) {
      console.error('[joinClassroom] DB error:', joinError.message);
      throw joinError;
    }

    return success(res, { classroom, membership });
  } catch (err) {
    console.error('[joinClassroom]', err.message);
    return error(res, 'INTERNAL_ERROR', 'Failed to join classroom.', 500);
  }
};
