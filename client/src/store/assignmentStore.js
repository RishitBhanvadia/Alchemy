/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import { create } from 'zustand';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';

const useAssignmentStore = create((set) => ({
    assignments: [],
    studentProgress: [],
    loading: false,

    fetchAssignments: async (classroomId) => {
        set({ loading: true });
        try {
            const { data, error } = await supabase
                .from('assignments')
                .select('*')
                .eq('classroom_id', classroomId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            set({ assignments: data });
        } catch (error) {
            console.error('Error fetching assignments:', error);
            toast.error('Failed to load assignments');
        } finally {
            set({ loading: false });
        }
    },

    fetchStudentProgress: async (assignmentId) => {
        try {
            const { data, error } = await supabase
                .from('student_assignments')
                .select('*, profiles(full_name, avatar_url)')
                .eq('assignment_id', assignmentId);

            if (error) throw error;
            set({ studentProgress: data });
        } catch (error) {
            console.error('Error fetching progress:', error);
        }
    },

    createAssignment: async (assignmentData) => {
        try {
            const { data, error } = await supabase
                .from('assignments')
                .insert([assignmentData])
                .select();

            if (error) throw error;
            
            set(state => ({
                assignments: [data[0], ...state.assignments]
            }));
            
            toast.success('Assignment created!');
            return data[0];
        } catch (error) {
            console.error('Error creating assignment:', error);
            toast.error('Failed to create assignment');
            return null;
        }
    },

    deleteAssignment: async (id) => {
        try {
            const { error } = await supabase
                .from('assignments')
                .delete()
                .eq('id', id);

            if (error) throw error;
            
            set(state => ({
                assignments: state.assignments.filter(a => a.id !== id)
            }));
            
            toast.success('Assignment removed');
        } catch (error) {
            console.error('Error deleting assignment:', error);
            toast.error('Failed to delete assignment');
        }
    },

    fetchStudentAssignments: async (classroomId, studentId) => {
        set({ loading: true });
        try {
            // Get all assignments for this class
            const { data: assignments, error: asgnErr } = await supabase
                .from('assignments')
                .select('*')
                .eq('classroom_id', classroomId);

            if (asgnErr) throw asgnErr;

            // Get student progress for these assignments
            const { data: progress, error: progErr } = await supabase
                .from('student_assignments')
                .select('*')
                .eq('student_id', studentId);

            if (progErr) throw progErr;

            // Merge progress into assignments
            const merged = assignments.map(a => ({
                ...a,
                progress: progress.find(p => p.assignment_id === a.id) || null
            }));

            set({ assignments: merged });
        } catch (error) {
            console.error('Error fetching student assignments:', error);
        } finally {
            set({ loading: false });
        }
    },

    submitAssignment: async (assignmentId, studentId, score) => {
        try {
            const { error } = await supabase
                .from('student_assignments')
                .upsert({
                    assignment_id: assignmentId,
                    student_id: studentId,
                    score: score,
                    completed_at: new Date().toISOString()
                });

            if (error) throw error;
            toast.success('Assignment progress saved!');
        } catch (error) {
            console.error('Error submitting assignment:', error);
        }
    }
}));

export default useAssignmentStore;
