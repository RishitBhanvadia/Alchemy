/* eslint-disable */
/**
 * StudentAnalyticsChart.jsx — Recharts BarChart for score distribution
 * Phase 3.2.2 Task [11]: Shows score buckets (0–100%) with class average reference line
 *
 * Features:
 * - Score distribution in 10% buckets (0-10, 10-20, ..., 90-100)
 * - Class average reference line
 * - Responsive container
 * - Gradient bar fills
 */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Score bucket labels
const BUCKET_LABELS = [
  '0–10', '10–20', '20–30', '30–40', '40–50',
  '50–60', '60–70', '70–80', '80–90', '90–100',
];

// Gradient colors for buckets (red → yellow → green)
const BUCKET_COLORS = [
  '#ff4444', '#ff6633', '#ff8822', '#ffaa00', '#ffcc00',
  '#ccdd00', '#88cc22', '#44bb44', '#22aa66', '#00cc88',
];

/**
 * Compute score distribution buckets and class average.
 */
function computeDistribution(scores) {
  const buckets = new Array(10).fill(0);
  let total = 0;

  scores.forEach((score) => {
    const clamped = Math.min(100, Math.max(0, score));
    const bucketIndex = Math.min(9, Math.floor(clamped / 10));
    buckets[bucketIndex]++;
    total += clamped;
  });

  const average = scores.length > 0 ? total / scores.length : 0;

  const data = BUCKET_LABELS.map((label, i) => ({
    bucket: label,
    count: buckets[i],
  }));

  return { data, average };
}

const StudentAnalyticsChart = React.memo(({ scores = [], experimentName = '', noDataMessage }) => {
  const { data, average } = useMemo(() => computeDistribution(scores), [scores]);

  const showNoDataMessage = noDataMessage || (
    !experimentName 
      ? "Select an experiment type above to see score distribution."
      : scores.length === 0 
        ? "No students have completed this experiment yet."
        : null
  );

  if (showNoDataMessage) {
    return (
      <div className="student-analytics-chart" style={styles.emptyState}>
        <div style={styles.emptyIcon}>📊</div>
        <p style={styles.emptyText}>{showNoDataMessage}</p>
      </div>
    );
  }

  return (
    <div className="student-analytics-chart" style={styles.container}>
      <h3 style={styles.title}>
        <span style={styles.icon}>📊</span>
        Score Distribution: {experimentName}
      </h3>

      <div style={styles.statsRow}>
        <div style={styles.statBadge}>
          <span style={styles.statLabel}>Students</span>
          <span style={styles.statValue}>{scores.length}</span>
        </div>
        <div style={styles.statBadge}>
          <span style={styles.statLabel}>Average</span>
          <span style={styles.statValue}>{average.toFixed(1)}%</span>
        </div>
        <div style={styles.statBadge}>
          <span style={styles.statLabel}>Highest</span>
          <span style={styles.statValue}>
            {scores.length > 0 ? Math.max(...scores) : 0}%
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="bucket"
            tick={{ fill: '#aaa', fontSize: 11 }}
            axisLine={{ stroke: '#444' }}
          />
          <YAxis
            tick={{ fill: '#aaa', fontSize: 11 }}
            axisLine={{ stroke: '#444' }}
            label={{
              value: 'Students',
              angle: -90,
              position: 'insideLeft',
              fill: '#888',
              fontSize: 12,
            }}
          />
          <Tooltip
            contentStyle={{
              background: '#1a1a2e',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value) => [`${value} students`, 'Count']}
          />
          {scores.length > 0 && (
            <ReferenceLine
              x={BUCKET_LABELS[Math.min(9, Math.floor(average / 10))]}
              stroke="#00f3ff"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: `Avg: ${average.toFixed(1)}%`,
                fill: '#00f3ff',
                fontSize: 12,
              }}
            />
          )}
          <Bar dataKey="count" radius={[4, 4, 0, 0]} animationDuration={800}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={BUCKET_COLORS[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

StudentAnalyticsChart.propTypes = {
  scores: PropTypes.arrayOf(PropTypes.number),
  experimentName: PropTypes.string,
};

StudentAnalyticsChart.displayName = 'StudentAnalyticsChart';

export default StudentAnalyticsChart;

// ─── Inline Styles ──────────────────────────────────────────────────────────

const styles = {
  container: {
    background: 'rgba(26, 26, 46, 0.8)',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  title: {
    color: '#fff',
    fontSize: '1.1rem',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  icon: {
    fontSize: '1.3rem',
  },
  statsRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  },
  statBadge: {
    background: 'rgba(0, 243, 255, 0.1)',
    border: '1px solid rgba(0, 243, 255, 0.3)',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '80px',
  },
  statLabel: {
    color: '#888',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
  },
  statValue: {
    color: '#00f3ff',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  emptyState: {
    background: 'rgba(26, 26, 46, 0.6)',
    borderRadius: '12px',
    padding: '3rem',
    textAlign: 'center',
    border: '1px dashed rgba(255, 255, 255, 0.15)',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    opacity: 0.5,
  },
  emptyText: {
    color: '#888',
    fontSize: '0.95rem',
  },
};
