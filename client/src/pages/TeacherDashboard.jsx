/**
 * TeacherDashboard.jsx — Teacher's classroom management dashboard
 * Phase 3.2.2 Task [11]: Route-guarded, data grid, analytics chart
 *
 * Features:
 * - Route guard: redirects to / if user.role !== 'teacher'
 * - Supabase query for classroom students with progress data
 * - @tanstack/react-table data grid with sorting/filtering
 * - StudentAnalyticsChart with experiment selector dropdown
 * - Responsive: card list on mobile < 768px
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { supabase } from '../supabaseClient';
import useAuthStore from '../store/authStore';
import StudentAnalyticsChart from '../components/StudentAnalyticsChart';
import ClassroomManager from '../components/ClassroomManager';
import SkeletonBlock from '../components/SkeletonBlock';
import EmptyState from '../components/EmptyState';

// ─── Column Definitions ──────────────────────────────────────────────────────

const columns = [
  {
    accessorKey: 'display_name',
    header: 'Student Name',
    cell: (info) => info.getValue() || 'Unknown',
  },
  {
    accessorKey: 'total_xp',
    header: 'Total XP',
    cell: (info) => (
      <span style={styles.xpBadge}>{info.getValue() ?? 0}</span>
    ),
  },
  {
    accessorKey: 'badges_earned',
    header: 'Badges Earned',
    cell: (info) => {
      const count = info.getValue() ?? 0;
      return <span>{'🏅'.repeat(Math.min(count, 5))} {count}</span>;
    },
  },
  {
    accessorKey: 'experiments_completed',
    header: 'Experiments',
    cell: (info) => info.getValue() ?? 0,
  },
  {
    accessorKey: 'last_active',
    header: 'Status',
    cell: (info) => {
      const val = info.getValue();
      if (!val) return <span style={{ color: '#666' }}>Never</span>;
      const date = new Date(val);
      const now = new Date();
      
      // Check if active in last 60 seconds
      const diffMs = now - date;
      if (diffMs < 60000) {
        return (
          <span style={{ color: '#00f3ff', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="presence-dot"></span> In Lab
          </span>
        );
      }

      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return <span style={{ color: '#00ff88' }}>Today</span>;
      if (diffDays === 1) return <span style={{ color: '#88cc44' }}>Yesterday</span>;
      if (diffDays <= 7) return <span style={{ color: '#cccc00' }}>{diffDays}d ago</span>;
      return <span style={{ color: '#888' }}>{date.toLocaleDateString()}</span>;
    },
  },
];

// ─── Experiment Options ──────────────────────────────────────────────────────

const EXPERIMENT_OPTIONS = [
  { value: '', label: 'Select an experiment...' },
  { value: 'titration', label: 'Acid-Base Titration' },
  { value: 'inorganic', label: 'Inorganic Reactions' },
  { value: 'organic', label: 'Organic Chemistry' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TeacherDashboard({ analytics = false }) {
  const navigate = useNavigate();
  const profile = useAuthStore(state => state.profile);
  const role = profile?.role;

  // State
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExperiment, setSelectedExperiment] = useState('');
  const [experimentScores, setExperimentScores] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Date Range State
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30); // Default to last 30 days
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Scroll to analytics section if navigated from analytics route
  useEffect(() => {
    if (analytics) {
      const analyticsSection = document.getElementById('analytics-section');
      if (analyticsSection) {
        analyticsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [analytics]);

  useEffect(() => {
    if (role !== 'teacher' && role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [role, navigate]);

  // ─── Responsive Detection ─────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ─── Fetch Students ───────────────────────────────────────────────
  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        // Fetch classrooms owned by this teacher
        const { data: classrooms, error: classError } = await supabase
          .from('classrooms')
          .select('id, class_name')
          .eq('teacher_id', user.id);

        if (classError) throw classError;
        if (!classrooms || classrooms.length === 0) {
          setStudents([]);
          setLoading(false);
          return;
        }

        const classroomIds = classrooms.map((c) => c.id);

        // Fetch students in those classrooms with profile data
        const { data: studentData, error: studentError } = await supabase
          .from('class_memberships')
          .select(`
            student_id,
            joined_at,
            last_active_at,
            profiles!student_id (
              display_name,
              role
            )
          `)
          .in('classroom_id', classroomIds);

        if (studentError) throw studentError;

        // Collect all student IDs
        const studentIds = (studentData || []).map(r => r.student_id);
        
        // OPTIMIZATION: Fetch all experiment counts in ONE query instead of N+1
        let expDataByStudent = {};
        if (studentIds.length > 0) {
          const { data: allExpData } = await supabase
            .from('experiment_logs')
            .select('student_id, outcome_label')
            .in('student_id', studentIds);
          
          // Group by student_id
          if (allExpData) {
            allExpData.forEach(exp => {
              if (!expDataByStudent[exp.student_id]) {
                expDataByStudent[exp.student_id] = { count: 0, outcomes: new Set() };
              }
              expDataByStudent[exp.student_id].count++;
              if (exp.outcome_label) {
                expDataByStudent[exp.student_id].outcomes.add(exp.outcome_label);
              }
            });
          }
        }

        // Map to flat student objects with real progress data
        const mapped = (studentData || []).map((row) => {
          const expData = expDataByStudent[row.student_id] || { count: 0, outcomes: new Set() };
          const expCount = expData.count;
          
          // Calculate XP: 50 per experiment
          const xpFromExperiments = expCount * 50;
          
          return {
            id: row.student_id,
            display_name: row.profiles?.display_name || 'Unknown Student',
            total_xp: xpFromExperiments,
            badges_earned: Math.floor(expCount / 5), // 1 badge per 5 experiments
            experiments_completed: expCount,
            last_active: row.last_active_at || row.joined_at || null,
          };
        });

        // Deduplicate by student ID
        const unique = [...new Map(mapped.map((s) => [s.id, s])).values()];
        setStudents(unique);
      } catch (err) {
        // eslint-disable-next-line no-console
      console.error('Failed to fetch students:', err);
        setError(err.message || 'Failed to load student data');
      } finally {
        setLoading(false);
      }
    }

    if (role === 'teacher' || role === 'admin') {
      fetchStudents();
    }
  }, [role]);

  // ─── Fetch Experiment Scores ──────────────────────────────────────
  useEffect(() => {
    async function fetchScores() {
      if (!selectedExperiment) {
        setExperimentScores([]);
        return;
      }

      try {
        setLoading(true);

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get teacher's classrooms
        const { data: classrooms, error: classError } = await supabase
          .from('classrooms')
          .select('id')
          .eq('teacher_id', user.id);

        if (classError || !classrooms || classrooms.length === 0) {
          setExperimentScores([]);
          setLoading(false);
          return;
        }

        const classroomIds = classrooms.map((c) => c.id);

        // Get students in those classrooms
        const { data: studentData, error: studentError } = await supabase
          .from('class_memberships')
          .select('student_id')
          .in('classroom_id', classroomIds);

        if (studentError || !studentData || studentData.length === 0) {
          setExperimentScores([]);
          setLoading(false);
          return;
        }

        const studentIds = studentData.map((s) => s.student_id);

        // Fetch experiment counts for students in teacher's classrooms
        let query = supabase
          .from('experiment_logs')
          .select('created_at, experiment_type, score')
          .in('student_id', studentIds);

        // Only filter by experiment type if one is selected
        if (selectedExperiment) {
          query = query.ilike('experiment_type', `%${selectedExperiment}%`);
        }

        if (startDate) {
          query = query.gte('created_at', `${startDate}T00:00:00Z`);
        }
        if (endDate) {
          query = query.lte('created_at', `${endDate}T23:59:59Z`);
        }

        const { data } = await query;

        // Use the actual scores from DB
        setExperimentScores((data || []).map((log) => log.score || 0));
      } catch (err) {
        // eslint-disable-next-line no-console
      console.error('Failed to fetch scores:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
  }, [selectedExperiment, startDate, endDate]);

  // ─── Table Instance ───────────────────────────────────────────────
  // eslint-disable-next-line react-hooks/incompatible-library
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: students,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // ─── Don't render if not authorized ──────────────────────────────
  if (role !== 'teacher' && role !== 'admin') return null;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title} data-testid="dashboard-title">
          <span style={styles.titleIcon} aria-hidden="true">{role === 'admin' ? '🛡️' : '🎓'}</span>
          {role === 'admin' ? 'Admin Dashboard' : 'Teacher Dashboard'}
        </h1>
        <p style={styles.subtitle}>
          Manage your classrooms and track student progress
        </p>
      </div>

      <main aria-label="Teacher dashboard content">
        <ClassroomManager />

      {/* Error State */}
      {error && (
        <div style={styles.errorBanner}>
          ⚠️ {error}
        </div>
      )}

      {/* Search / Filter */}
      <div style={styles.toolbar}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="🔍 Search students..."
          data-testid="student-search-input"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <div style={styles.studentCount} className="studentCount">
          {students.length} student{students.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={styles.tableContainer}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={styles.skeletonRow}>
              <SkeletonBlock width="150px" height="20px" />
              <SkeletonBlock width="80px" height="20px" />
              <SkeletonBlock width="100px" height="20px" />
              <SkeletonBlock width="60px" height="20px" />
            </div>
          ))}
        </div>
      ) : students.length === 0 ? (
        <div style={styles.emptyState}>
          <EmptyState
            icon="👨‍🎓"
            title="No students yet"
            description="Students will appear here after joining your classroom with a join code."
          />
        </div>
      ) : isMobile ? (
        /* ── Mobile Card View ── */
        <div style={styles.cardList}>
          {table.getRowModel().rows.length === 0 ? (
            <div style={styles.emptyState}>No students found</div>
          ) : (
            table.getRowModel().rows.map((row) => (
              <div key={row.id} style={styles.card}>
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} style={styles.cardRow}>
                    <span style={styles.cardLabel}>
                      {cell.column.columnDef.header}
                    </span>
                    <span style={styles.cardValue}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      ) : (
        /* ── Desktop Data Grid ── */
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{
                        ...styles.th,
                        cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' ? ' ↑' : ''}
                      {header.column.getIsSorted() === 'desc' ? ' ↓' : ''}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} style={styles.emptyCell}>
                    No students found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} style={styles.tr}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} style={styles.td}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Analytics Section ── */}
      <section id="analytics-section" aria-labelledby="analytics-title" style={styles.analyticsSection}>
        <div style={styles.analyticsHeader}>
          <h2 id="analytics-title" style={styles.analyticsTitle}>📈 Score Analytics</h2>
          <select
            style={styles.experimentSelect}
            data-testid="experiment-type-select"
            value={selectedExperiment}
            onChange={(e) => setSelectedExperiment(e.target.value)}
          >
            {EXPERIMENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div style={styles.dateFilterGroup}>
            <div style={styles.dateField}>
              <label style={styles.dateLabel} htmlFor="start-date-input">From:</label>
              <input
                id="start-date-input"
                type="date"
                style={styles.dateInput}
                data-testid="start-date-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div style={styles.dateField}>
              <label style={styles.dateLabel} htmlFor="end-date-input">To:</label>
              <input
                id="end-date-input"
                type="date"
                style={styles.dateInput}
                data-testid="end-date-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <StudentAnalyticsChart
          scores={experimentScores}
          experimentName={
            EXPERIMENT_OPTIONS.find((o) => o.value === selectedExperiment)?.label || ''
          }
          noDataMessage={
            !selectedExperiment 
              ? "Select an experiment type above to see score distribution."
              : experimentScores.length === 0 
                ? "No students have completed this experiment yet."
                : undefined
          }
        />
      </section>
      </main>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = {
  page: {
    minHeight: '100vh',
    padding: '2rem',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1117 50%, #0a0a1a 100%)',
    color: '#fff',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  titleIcon: { fontSize: '2.2rem' },
  subtitle: {
    color: '#888',
    fontSize: '1rem',
  },
  errorBanner: {
    background: 'rgba(255, 68, 68, 0.15)',
    border: '1px solid rgba(255, 68, 68, 0.4)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    color: '#ff6666',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  searchInput: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    padding: '0.6rem 1rem',
    color: '#fff',
    fontSize: '0.95rem',
    width: '300px',
    maxWidth: '100%',
    outline: 'none',
  },
  studentCount: {
    color: '#888',
    fontSize: '0.85rem',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    color: '#888',
  },
  skeletonRow: {
    display: 'grid',
    gridTemplateColumns: '150px 80px 100px 60px',
    gap: '16px',
    padding: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(0, 243, 255, 0.2)',
    borderTop: '3px solid #00f3ff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  // Table styles
  tableContainer: {
    background: 'rgba(26, 26, 46, 0.6)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    overflow: 'auto',
    marginBottom: '2rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '0.75rem 1rem',
    background: 'rgba(0, 243, 255, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#00f3ff',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    userSelect: 'none',
  },
  tr: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'background 0.15s',
  },
  td: {
    padding: '0.75rem 1rem',
    fontSize: '0.9rem',
    color: '#ddd',
  },
  emptyCell: {
    padding: '3rem',
    textAlign: 'center',
    color: '#666',
  },
  xpBadge: {
    background: 'rgba(0, 255, 136, 0.15)',
    color: '#00ff88',
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  // Card styles (mobile)
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
  },
  card: {
    background: 'rgba(26, 26, 46, 0.7)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '1rem',
  },
  cardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.4rem 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  cardLabel: {
    color: '#888',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
  },
  cardValue: {
    color: '#ddd',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  emptyState: {
    padding: '3rem',
    textAlign: 'center',
    color: '#666',
    background: 'rgba(26, 26, 46, 0.5)',
    borderRadius: '12px',
    marginBottom: '2rem',
  },
  // Analytics section
  analyticsSection: {
    marginTop: '2rem',
  },
  analyticsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  analyticsTitle: {
    fontSize: '1.3rem',
    fontWeight: 600,
  },
  experimentSelect: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    color: '#fff',
    fontSize: '0.9rem',
    cursor: 'pointer',
    outline: 'none',
  },
  dateFilterGroup: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dateField: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  dateLabel: {
    fontSize: '0.8rem',
    color: '#888',
    textTransform: 'uppercase',
  },
  dateInput: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    padding: '0.4rem 0.6rem',
    color: '#F9FAFB',
    fontSize: '0.9rem',
    outline: 'none',
    colorScheme: 'dark',
    fontFamily: 'inherit',
  },
};

// Global styles for presence dot
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes pulsePresence {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 243, 255, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(0, 243, 255, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 243, 255, 0); }
  }
  .presence-dot {
    width: 8px;
    height: 8px;
    background: #00f3ff;
    border-radius: 50%;
    display: inline-block;
    animation: pulsePresence 2s infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
