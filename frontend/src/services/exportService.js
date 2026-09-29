/**
 * CSV Export Service
 * Exports the visitor records to a clean CSV file
 */

import { formatDateTime } from '../utils/dateUtils';

export const exportToCSV = (visitors, filename = 'Visitor_Log') => {
  if (!visitors || !visitors.length) {
    alert('No visitor records to export.');
    return;
  }

  const headers = [
    'Visitor Name',
    'Mobile Number',
    'Company / College',
    'Person To Meet',
    'Purpose of Visit',
    'Check-In Time',
    'Check-Out Time',
    'Status',
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const stringVal = String(val).replace(/"/g, '""');
    return `"${stringVal}"`;
  };

  const rows = visitors.map((v) => [
    escapeCSV(v.name),
    escapeCSV(v.mobile),
    escapeCSV(v.company),
    escapeCSV(v.personToMeet),
    escapeCSV(v.purpose),
    escapeCSV(formatDateTime(v.checkInTime)),
    escapeCSV(v.checkOutTime ? formatDateTime(v.checkOutTime) : 'N/A'),
    escapeCSV(v.status),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
