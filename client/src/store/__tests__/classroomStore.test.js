import { describe, it, expect, beforeEach, vi } from 'vitest';
import useClassroomStore from '../classroomStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => {
  return {
    supabase: {
      auth: {
        getUser: vi.fn(),
      },
      from: vi.fn(),
    },
  };
});

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
    it('should set membership to null if not authenticated', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      await useClassroomStore.getState().fetchStudentMembership();

      expect(useClassroomStore.getState().membership).toBeNull();
      expect(useClassroomStore.getState().loading).toBe(false);
    });

    it('should fetch and set membership data successfully', async () => {
      const mockUser = { id: 'student123' };
      const mockMembership = { classroom: { class_name: 'Chemistry 101' } };

      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: mockMembership, error: null }),
          }),
        }),
      });

      await useClassroomStore.getState().fetchStudentMembership();

      expect(useClassroomStore.getState().membership).toEqual(mockMembership);
      expect(useClassroomStore.getState().loading).toBe(false);
      expect(useClassroomStore.getState().lastFetched).toBeDefined();
    });
  });

  describe('fetchTeacherClassrooms', () => {
    it('should set classrooms to empty array if not authenticated', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      await useClassroomStore.getState().fetchTeacherClassrooms();

      expect(useClassroomStore.getState().classrooms).toEqual([]);
      expect(useClassroomStore.getState().loading).toBe(false);
    });

    it('should fetch and set classrooms data successfully', async () => {
      const mockUser = { id: 'teacher123' };
      const mockClassrooms = [{ id: '1', class_name: 'Chemistry 101' }, { id: '2', class_name: 'Physics 101' }];

      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockClassrooms, error: null }),
          }),
        }),
      });

      await useClassroomStore.getState().fetchTeacherClassrooms();

      expect(useClassroomStore.getState().classrooms).toEqual(mockClassrooms);
      expect(useClassroomStore.getState().loading).toBe(false);
      expect(useClassroomStore.getState().lastFetched).toBeDefined();
    });

    it('should not fetch if data was fetched recently and force is false', async () => {
      const mockUser = { id: 'teacher123' };
      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      const now = Date.now();
      useClassroomStore.setState({ lastFetched: now - 10000 }); // Fetched 10s ago

      await useClassroomStore.getState().fetchTeacherClassrooms();

      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should fetch if force is true even if data was fetched recently', async () => {
       const mockUser = { id: 'teacher123' };
      const mockClassrooms = [{ id: '1', class_name: 'Chemistry 101' }];

      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockClassrooms, error: null }),
          }),
        }),
      });

      const now = Date.now();
      useClassroomStore.setState({ lastFetched: now - 10000 });

      await useClassroomStore.getState().fetchTeacherClassrooms(true);

      expect(supabase.from).toHaveBeenCalled();
      expect(useClassroomStore.getState().classrooms).toEqual(mockClassrooms);
    });
  });

  describe('joinClassroom', () => {
     it('should return error if not logged in', async () => {
        supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

        const result = await useClassroomStore.getState().joinClassroom('CODE12');

        expect(result).toEqual({ error: 'Not logged in' });
     });

     it('should return error if class code is invalid', async () => {
         const mockUser = { id: 'student123' };
         supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

         supabase.from.mockReturnValue({
             select: vi.fn().mockReturnValue({
                 eq: vi.fn().mockReturnValue({
                     single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
                 })
             })
         });

         const result = await useClassroomStore.getState().joinClassroom('INVALID');

         expect(result).toEqual({ error: 'Invalid code' });
     });

     it('should join successfully', async () => {
          const mockUser = { id: 'student123' };
          const mockClassroom = { id: 'class123', class_name: 'Chemistry' };

          supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

          supabase.from.mockImplementation((table) => {
              if (table === 'classrooms') {
                 return {
                     select: vi.fn().mockReturnValue({
                         eq: vi.fn().mockReturnValue({
                             single: vi.fn().mockResolvedValue({ data: mockClassroom, error: null })
                         })
                     })
                 }
              }
              if (table === 'class_memberships') {
                  return {
                      insert: vi.fn().mockResolvedValue({ error: null })
                  }
              }
          });

          // Mock fetchStudentMembership
          const fetchStudentMembershipMock = vi.spyOn(useClassroomStore.getState(), 'fetchStudentMembership').mockResolvedValue();

          const result = await useClassroomStore.getState().joinClassroom('VALID');

          expect(result).toEqual({ success: true, classroomName: 'Chemistry' });
          expect(fetchStudentMembershipMock).toHaveBeenCalled();
     });
  });

  describe('createClassroom', () => {
      it('should return error if name is empty', async () => {
          const result = await useClassroomStore.getState().createClassroom('   ');
          expect(result).toEqual({ error: 'Name is required' });
      });

      it('should return error if not authenticated', async () => {
          supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
          const result = await useClassroomStore.getState().createClassroom('New Class');
          expect(result).toEqual({ error: 'Not authenticated' });
      });

      it('should create classroom successfully', async () => {
           const mockUser = { id: 'teacher123' };
           const mockCreatedClassroom = { id: 'newClass', class_name: 'New Class' };

           supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

           supabase.from.mockReturnValue({
               insert: vi.fn().mockReturnValue({
                   select: vi.fn().mockReturnValue({
                       single: vi.fn().mockResolvedValue({ data: mockCreatedClassroom, error: null })
                   })
               })
           });

           // Mock fetchTeacherClassrooms
           const fetchTeacherClassroomsMock = vi.spyOn(useClassroomStore.getState(), 'fetchTeacherClassrooms').mockResolvedValue();

           const result = await useClassroomStore.getState().createClassroom('New Class');

           expect(result).toEqual({ success: true, classroom: mockCreatedClassroom });
           expect(fetchTeacherClassroomsMock).toHaveBeenCalledWith(true);
      });
  });
});
