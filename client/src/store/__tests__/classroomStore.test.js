import { describe, it, expect, beforeEach, vi } from 'vitest';
import useClassroomStore from '../classroomStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
}));

describe('classroomStore', () => {
  beforeEach(() => {
    useClassroomStore.setState({
      membership: null,
      classrooms: [],
      loading: false,
      lastFetched: null,
    });
    vi.clearAllMocks();
  });

  it('has initial default state', () => {
    const state = useClassroomStore.getState();
    expect(state.membership).toBeNull();
    expect(state.classrooms).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.lastFetched).toBeNull();
  });

  describe('joinClassroom', () => {
    it('returns error if user not logged in', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
      const result = await useClassroomStore.getState().joinClassroom('123');
      expect(result).toEqual({ error: 'Not logged in' });
    });

    it('returns error if code is invalid', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'u1' } } });

      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: new Error('Invalid') })
        })
      });
      supabase.from.mockReturnValue({ select: selectMock });

      const result = await useClassroomStore.getState().joinClassroom('INVALID');
      expect(result).toEqual({ error: 'Invalid code' });
    });

    it('successfully joins a classroom', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'u1' } } });

      const classSelectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'c1', class_name: 'Chemistry 101' },
            error: null
          })
        })
      });

      const insertMock = vi.fn().mockResolvedValue({ error: null });

      // We need to mock .from('classrooms') and .from('classroom_students')
      supabase.from.mockImplementation((table) => {
        const membershipSelectMock = vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: { id: 'm1' }, error: null })
          })
        });

        if (table === 'classrooms') {
          return { select: classSelectMock };
        }

        if (table === 'classroom_students') {
          return {
            insert: insertMock,
            select: membershipSelectMock
          };
        }

        return {};
      });

      const result = await useClassroomStore.getState().joinClassroom('VALID');

      expect(result).toEqual({ success: true, classroomName: 'Chemistry 101' });
      expect(insertMock).toHaveBeenCalledWith({
        classroom_id: 'c1',
        student_id: 'u1'
      });
    });
  });

  describe('createClassroom', () => {
    it('returns error if user not logged in', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
      const result = await useClassroomStore.getState().createClassroom('New Class');
      expect(result).toEqual({ error: 'Not authenticated' });
    });

    it('successfully creates a classroom', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 't1' } } });

      const newClassroom = { id: 'c2', class_name: 'Advanced Chemistry' };
      const insertMock = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: newClassroom, error: null })
        })
      });

      supabase.from.mockImplementation((table) => {
        const teacherClassroomsSelectMock = vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [newClassroom], error: null })
          })
        });

        if (table === 'classrooms') {
          return {
            insert: insertMock,
            select: teacherClassroomsSelectMock
          };
        }

        return {};
      });

      const result = await useClassroomStore.getState().createClassroom('Advanced Chemistry');

      expect(result).toEqual({ success: true, classroom: newClassroom });
      expect(insertMock).toHaveBeenCalled();
      const insertArgs = insertMock.mock.calls[0][0];
      expect(insertArgs.class_name).toBe('Advanced Chemistry');
      expect(insertArgs.teacher_id).toBe('t1');
      expect(insertArgs.join_code).toBeDefined();
    });
  });
});
