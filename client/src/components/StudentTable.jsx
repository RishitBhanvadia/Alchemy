import React from 'react';
import PropTypes from 'prop-types';
import { flexRender } from '@tanstack/react-table';
import SkeletonBlock from './SkeletonBlock';
import EmptyState from './EmptyState';

const StudentTable = ({ table, columns, loading, students, isMobile, styles }) => {
  if (loading) {
    return (
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
    );
  }

  if (students.length === 0) {
    return (
      <div style={styles.emptyState}>
        <EmptyState
          icon="👨‍🎓"
          title="No students yet"
          description="Students will appear here after joining your classroom with a join code."
        />
      </div>
    );
  }

  if (isMobile) {
    return (
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
    );
  }

  return (
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
  );
};

// Add PropTypes if needed
StudentTable.propTypes = {
  table: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  students: PropTypes.array.isRequired,
  isMobile: PropTypes.bool.isRequired,
  styles: PropTypes.object.isRequired,
};

export default StudentTable;
