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
import { useLabStore } from '../store/labStore';
import StudentAnalyticsChart from '../components/StudentAnalyticsChart';
import ClassroomManager from '../components/ClassroomManager';

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

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const role = useLabStore((s) => s.role);

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

  // ─── Route Guard ──────────────────────────────────────────────────
  useEffect(() => {
    if (role !== 'teacher') {
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
          .from('classroom_students')
          .select(`
            student_id,
            joined_at,
            last_active_at,
            profiles:student_id (
              display_name,
              role
            )
          `)
          .in('classroom_id', classroomIds);

        if (studentError) throw studentError;

        // Map to flat student objects with mock progress data
        // (In production, this would join with a user_progress table)
        const mapped = (studentData || []).map((row) => ({
          id: row.student_id,
          display_name: row.profiles?.display_name || 'Unknown Student',
          total_xp: Math.floor(Math.random() * 5000), // Mock data
          badges_earned: Math.floor(Math.random() * 10),
          experiments_completed: Math.floor(Math.random() * 20),
          last_active: row.last_active_at || row.joined_at || null,
        }));

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

    if (role === 'teacher') {
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
        // Fetch scores from experiment_results table
        let query = supabase
          .from('experiment_results')
          .select('score, created_at')
          .eq('experiment_type', selectedExperiment);

        if (startDate) {
          query = query.gte('created_at', `${startDate}T00:00:00Z`);
        }
        if (endDate) {
          query = query.lte('created_at', `${endDate}T23:59:59Z`);
        }

        const { data, error: scoresError } = await query;

        if (scoresError) throw scoresError;

        setExperimentScores((data || []).map(row => row.score || 0));
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

  // ─── Don't render if not teacher ──────────────────────────────────
  if (role !== 'teacher') return null;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <span style={styles.titleIcon}>🎓</span>
          Teacher Dashboard
        </h1>
        <p style={styles.subtitle}>
          Manage your classrooms and track student progress
        </p>
      </div>

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
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <div style={styles.studentCount}>
          {students.length} student{students.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={styles.loadingState}>
          <div style={styles.spinner} />
          <p>Loading student data...</p>
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
      <div style={styles.analyticsSection}>
        <div style={styles.analyticsHeader}>
          <h2 style={styles.analyticsTitle}>📈 Score Analytics</h2>
          <select
            style={styles.experimentSelect}
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
              <label htmlFor="startDate" style={styles.dateLabel}>From:</label>
              <input
                id="startDate"
                type="date"
                style={styles.dateInput}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div style={styles.dateField}>
              <label htmlFor="endDate" style={styles.dateLabel}>To:</label>
              <input
                id="endDate"
                type="date"
                style={styles.dateInput}
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
        />
      </div>
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
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    padding: '0.4rem 0.6rem',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    colorScheme: 'dark',
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
