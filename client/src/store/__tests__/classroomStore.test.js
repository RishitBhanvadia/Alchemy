import { describe, it, expect, beforeEach, vi } from 'vitest';
import useClassroomStore from '../classroomStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  }
}));

describe('classroomStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useClassroomStore.setState({
      membership: null,
      classrooms: [],
      loading: false,
      lastFetched: null,
    });
  });

  describe('fetchStudentMembership', () => {
    it('should handle unauthenticated user', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      await useClassroomStore.getState().fetchStudentMembership();

      const state = useClassroomStore.getState();
      expect(state.membership).toBeNull();
      expect(state.loading).toBe(false);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should fetch membership for authenticated user', async () => {
      const mockUser = { id: 'user123' };
      const mockMembership = { id: 1, classroom_id: 101, classroom: { class_name: 'Science 101' } };

      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: mockMembership, error: null })
      };
      supabase.from.mockReturnValue(mockQuery);

      await useClassroomStore.getState().fetchStudentMembership();

      const state = useClassroomStore.getState();
      expect(state.membership).toEqual(mockMembership);
      expect(state.loading).toBe(false);
      expect(state.lastFetched).toBeDefined();

      expect(supabase.from).toHaveBeenCalledWith('class_memberships');
      expect(mockQuery.select).toHaveBeenCalled();
      expect(mockQuery.eq).toHaveBeenCalledWith('student_id', mockUser.id);
    });
  });

  describe('fetchTeacherClassrooms', () => {
    it('should fetch classrooms for teacher', async () => {
      const mockUser = { id: 'teacher123' };
      const mockClassrooms = [{ id: 101, class_name: 'Science 101' }];

      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockClassrooms, error: null })
      };
      supabase.from.mockReturnValue(mockQuery);

      await useClassroomStore.getState().fetchTeacherClassrooms();

      const state = useClassroomStore.getState();
      expect(state.classrooms).toEqual(mockClassrooms);
      expect(state.loading).toBe(false);
      expect(state.lastFetched).toBeDefined();

      expect(supabase.from).toHaveBeenCalledWith('classrooms');
      expect(mockQuery.select).toHaveBeenCalled();
      expect(mockQuery.eq).toHaveBeenCalledWith('teacher_id', mockUser.id);
      expect(mockQuery.order).toHaveBeenCalledWith('created_at', { ascending: false });
    });
  });

  describe('joinClassroom', () => {
    it('should join classroom successfully', async () => {
      const mockUser = { id: 'user123' };
      const mockClassroom = { id: 101, class_name: 'Science 101' };

      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      const mockQuerySelect = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockClassroom, error: null })
      };

      const mockQueryInsert = {
        insert: vi.fn().mockResolvedValue({ error: null })
      };

      const mockQueryFetchStudentMembership = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null })
      };

      supabase.from.mockImplementation((table) => {
        if (table === 'classrooms') return mockQuerySelect;
        if (table === 'class_memberships') {
            const chain = {
              insert: mockQueryInsert.insert,
              select: function() { return mockQueryFetchStudentMembership; }
            };
            return chain;
        }
        return { select: vi.fn().mockReturnThis() };
      });

      const result = await useClassroomStore.getState().joinClassroom('CODE12');

      expect(result).toEqual({ success: true, classroomName: 'Science 101' });
      expect(mockQuerySelect.eq).toHaveBeenCalledWith('class_code', 'CODE12');
      expect(mockQueryInsert.insert).toHaveBeenCalledWith({
        classroom_id: mockClassroom.id,
        student_id: mockUser.id
      });
    });

    it('should return error if code is invalid', async () => {
      const mockUser = { id: 'user123' };

      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      const mockQuerySelect = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
      };

      supabase.from.mockReturnValue(mockQuerySelect);

      const result = await useClassroomStore.getState().joinClassroom('INVALID');

      expect(result).toEqual({ error: 'Invalid code' });
    });
  });

  describe('createClassroom', () => {
    it('should return error if name is empty', async () => {
      const result = await useClassroomStore.getState().createClassroom('   ');
      expect(result).toEqual({ error: 'Name is required' });
    });

    it('should create classroom successfully', async () => {
      const mockUser = { id: 'teacher123' };
      const mockNewClassroom = { id: 101, class_name: 'New Class', class_code: 'RANDOM' };

      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      // Needs insert -> select -> single chain
      const mockQueryInsert = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockNewClassroom, error: null })
      };

      const mockQueryFetchTeacherClassrooms = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null })
      };

      supabase.from.mockImplementation((table) => {
        if (table === 'classrooms') {
            // we have two distinct uses of .from('classrooms') in createClassroom
            // 1. insert().select().single()
            // 2. fetchTeacherClassrooms which uses select().eq().order()
            // Let's create an object that satisfies both
            return {
                insert: mockQueryInsert.insert,
                select: function(arg) {
                    // if select() is called with arguments, it's fetchTeacherClassrooms (arg is actually undefined for fetchTeacherClassrooms though)
                    // Let's rely on the chain
                    if (this.inserted) {
                      return mockQueryInsert.select();
                    }
                    // assume fetchTeacherClassrooms
                    return mockQueryFetchTeacherClassrooms;
                }
            };
        }
        return { select: vi.fn().mockReturnThis() };
      });

      // Override insert to set the flag
      const originalInsert = mockQueryInsert.insert;
      mockQueryInsert.insert = vi.fn().mockImplementation(function() {
          this.inserted = true;
          return originalInsert.apply(this, arguments);
      }.bind(mockQueryInsert));


      const result = await useClassroomStore.getState().createClassroom('New Class', 'none');

      expect(result).toEqual({ success: true, classroom: mockNewClassroom });
      expect(originalInsert).toHaveBeenCalledWith(expect.objectContaining({
        class_name: 'New Class',
        teacher_id: mockUser.id,
        meeting_type: 'none',
        meeting_link: null
      }));
      const insertCall = originalInsert.mock.calls[0][0];
      expect(insertCall.class_code).toMatch(/^[A-Z0-9]{6}$/);
    });
  });
});
