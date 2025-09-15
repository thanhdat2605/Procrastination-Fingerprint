type ExportFormat = 'json' | 'csv';

export function exportDashboardData(data: unknown, format: ExportFormat, baseName: string) {
  const today = new Date().toISOString().split('T')[0];
  const fileName = `${baseName}-${today}.${format}`;
  let mime = 'application/json';
  let content = '';

  if (format === 'json') {
    content = JSON.stringify(data, null, 2);
  } else {
    const rows = Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
    if (!rows.length) return;
    const headers = Object.keys(rows[0] ?? {});
    const lines = [
      headers.join(','),
      ...rows.map((row) => headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')),
    ];
    content = lines.join('\n');
    mime = 'text/csv';
  }

  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


