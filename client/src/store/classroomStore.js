import { create } from 'zustand';
import { supabase } from '../supabaseClient';

const useClassroomStore = create((set, get) => ({
  membership: null,
  classrooms: [],
  loading: false,
  lastFetched: null,

  fetchStudentMembership: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ membership: null, loading: false });
      return;
    }

    set({ loading: true });

    const { data, error } = await supabase
      .from('class_memberships')
      .select('*, classroom:classrooms(*, teacher:profiles!teacher_id(display_name, avatar_url))')
      .eq('student_id', user.id)
      .maybeSingle();

    if (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching membership:', error);
      set({ membership: null, loading: false });
    } else {
      set({ membership: data || null, loading: false, lastFetched: Date.now() });
    }
  },

  fetchTeacherClassrooms: async (force = false) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ classrooms: [], loading: false });
      return;
    }

    const now = Date.now();
    if (!force && get().lastFetched && now - get().lastFetched < 30000) {
      return;
    }

    set({ loading: true });

    const { data, error } = await supabase
      .from('classrooms')
      .select('*, memberships:class_memberships(count)')
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching classrooms:', error);
      set({ classrooms: [], loading: false });
    } else {
      set({ classrooms: data || [], loading: false, lastFetched: now });
    }
  },

  joinClassroom: async (code) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not logged in' };

    const { data: classroom, error: classError } = await supabase
      .from('classrooms')
      .select('id, class_name')
      .eq('class_code', code.toUpperCase())
      .single();

    if (classError || !classroom) {
      return { error: 'Invalid code' };
    }

    const { error: joinError } = await supabase
      .from('class_memberships')
      .insert({
        classroom_id: classroom.id,
        student_id: user.id
      });

    if (joinError?.code === '23505') {
      return { error: 'Already a member' };
    }
    if (joinError) {
      return { error: joinError.message };
    }

    await get().fetchStudentMembership();
    return { success: true, classroomName: classroom.class_name };
  },

  createClassroom: async (name, meetingType = 'none', meetingLink = null) => {
    if (!name || name.trim().length === 0) return { error: 'Name is required' };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data, error } = await supabase
      .from('classrooms')
      .insert({
        class_name: name.trim(),
        teacher_id: user.id,
        class_code: classCode,
        locked_chemicals: [],
        meeting_type: meetingType,
        meeting_link: meetingLink
      })
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    await get().fetchTeacherClassrooms(true);
    return { success: true, classroom: data };
  },

  reset: () => set({ membership: null, classrooms: [], loading: false, lastFetched: null }),
}));

export default useClassroomStore;
