/**
 * Data Export Utilities
 * Supports CSV, Excel, and JSON export formats
 */

export type ExportFormat = 'csv' | 'excel' | 'json';

export interface ExportColumn {
  key: string;
  header: string;
  formatter?: (value: any) => string;
}

export interface ExportOptions {
  filename: string;
  format: ExportFormat;
  columns: ExportColumn[];
  data: Record<string, any>[];
  title?: string;
  includeTimestamp?: boolean;
}

/**
 * Format a value for CSV export (handle commas, quotes, newlines)
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) return '';

  const stringValue = String(value);

  // If contains comma, quote, or newline, wrap in quotes and escape existing quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Generate CSV content from data
 */
export function generateCSV(options: ExportOptions): string {
  const { columns, data, title, includeTimestamp } = options;

  const lines: string[] = [];

  // Add title row if provided
  if (title) {
    lines.push(escapeCSVValue(title));
    lines.push(''); // Empty row after title
  }

  // Add timestamp if requested
  if (includeTimestamp) {
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    lines.push('');
  }

  // Header row
  const headers = columns.map(col => escapeCSVValue(col.header));
  lines.push(headers.join(','));

  // Data rows
  for (const row of data) {
    const values = columns.map(col => {
      const rawValue = row[col.key];
      const formattedValue = col.formatter ? col.formatter(rawValue) : rawValue;
      return escapeCSVValue(formattedValue);
    });
    lines.push(values.join(','));
  }

  return lines.join('\n');
}

/**
 * Generate Excel-compatible XML (SpreadsheetML)
 * This creates an .xls file that Excel can open
 */
export function generateExcelXML(options: ExportOptions): string {
  const { columns, data, title, includeTimestamp } = options;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="Header">
      <Font ss:Bold="1" ss:Size="12"/>
      <Interior ss:Color="#4472C4" ss:Pattern="Solid"/>
      <Font ss:Color="#FFFFFF"/>
    </Style>
    <Style ss:ID="Title">
      <Font ss:Bold="1" ss:Size="16"/>
    </Style>
    <Style ss:ID="Date">
      <NumberFormat ss:Format="yyyy-mm-dd hh:mm:ss"/>
    </Style>
    <Style ss:ID="Currency">
      <NumberFormat ss:Format="$#,##0.00"/>
    </Style>
    <Style ss:ID="Percent">
      <NumberFormat ss:Format="0.00%"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Report">
    <Table>`;

  // Column widths
  for (const col of columns) {
    xml += `\n      <Column ss:Width="120"/>`;
  }

  // Title row
  if (title) {
    xml += `\n      <Row>
        <Cell ss:StyleID="Title"><Data ss:Type="String">${escapeXML(title)}</Data></Cell>
      </Row>
      <Row></Row>`;
  }

  // Timestamp row
  if (includeTimestamp) {
    xml += `\n      <Row>
        <Cell><Data ss:Type="String">Generated: ${new Date().toLocaleString()}</Data></Cell>
      </Row>
      <Row></Row>`;
  }

  // Header row
  xml += '\n      <Row>';
  for (const col of columns) {
    xml += `\n        <Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXML(col.header)}</Data></Cell>`;
  }
  xml += '\n      </Row>';

  // Data rows
  for (const row of data) {
    xml += '\n      <Row>';
    for (const col of columns) {
      const rawValue = row[col.key];
      const formattedValue = col.formatter ? col.formatter(rawValue) : rawValue;
      const dataType = typeof rawValue === 'number' ? 'Number' : 'String';
      const cellValue = formattedValue ?? '';
      xml += `\n        <Cell><Data ss:Type="${dataType}">${escapeXML(String(cellValue))}</Data></Cell>`;
    }
    xml += '\n      </Row>';
  }

  xml += `
    </Table>
  </Worksheet>
</Workbook>`;

  return xml;
}

/**
 * Escape special XML characters
 */
function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate JSON export
 */
export function generateJSON(options: ExportOptions): string {
  const { columns, data, title, includeTimestamp } = options;

  const exportData = {
    ...(title && { title }),
    ...(includeTimestamp && { generatedAt: new Date().toISOString() }),
    columns: columns.map(col => ({ key: col.key, header: col.header })),
    data: data.map(row => {
      const formattedRow: Record<string, any> = {};
      for (const col of columns) {
        const rawValue = row[col.key];
        formattedRow[col.key] = col.formatter ? col.formatter(rawValue) : rawValue;
      }
      return formattedRow;
    }),
    totalRows: data.length,
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Trigger browser download of exported data
 */
export function downloadExport(options: ExportOptions): void {
  const { filename, format, includeTimestamp } = options;

  let content: string;
  let mimeType: string;
  let extension: string;

  switch (format) {
    case 'csv':
      content = generateCSV(options);
      mimeType = 'text/csv;charset=utf-8;';
      extension = 'csv';
      break;
    case 'excel':
      content = generateExcelXML(options);
      mimeType = 'application/vnd.ms-excel';
      extension = 'xls';
      break;
    case 'json':
      content = generateJSON(options);
      mimeType = 'application/json';
      extension = 'json';
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }

  // Add timestamp to filename if requested
  const timestamp = includeTimestamp ? `_${new Date().toISOString().split('T')[0]}` : '';
  const fullFilename = `${filename}${timestamp}.${extension}`;

  // Create blob and trigger download
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fullFilename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Pre-defined export templates for common data types
 */
export const exportTemplates = {
  students: {
    columns: [
      { key: 'name', header: 'Student Name' },
      { key: 'email', header: 'Email' },
      { key: 'school', header: 'School' },
      { key: 'grade', header: 'Grade Level' },
      { key: 'program', header: 'Program' },
      { key: 'enrollmentDate', header: 'Enrollment Date', formatter: (v: any) => v ? new Date(v).toLocaleDateString() : '' },
      { key: 'status', header: 'Status' },
      { key: 'mentor', header: 'Assigned Mentor' },
    ] as ExportColumn[],
  },

  mentors: {
    columns: [
      { key: 'name', header: 'Mentor Name' },
      { key: 'email', header: 'Email' },
      { key: 'organization', header: 'Organization' },
      { key: 'expertise', header: 'Areas of Expertise' },
      { key: 'studentsAssigned', header: 'Students Assigned', formatter: (v: any) => String(v || 0) },
      { key: 'hoursContributed', header: 'Hours Contributed', formatter: (v: any) => String(v || 0) },
      { key: 'joinDate', header: 'Join Date', formatter: (v: any) => v ? new Date(v).toLocaleDateString() : '' },
      { key: 'status', header: 'Status' },
    ] as ExportColumn[],
  },

  organizations: {
    columns: [
      { key: 'name', header: 'Organization Name' },
      { key: 'type', header: 'Type' },
      { key: 'location', header: 'Location' },
      { key: 'contactName', header: 'Contact Person' },
      { key: 'contactEmail', header: 'Contact Email' },
      { key: 'programsOffered', header: 'Programs Offered', formatter: (v: any) => Array.isArray(v) ? v.join(', ') : '' },
      { key: 'studentsServed', header: 'Students Served', formatter: (v: any) => String(v || 0) },
      { key: 'joinDate', header: 'Join Date', formatter: (v: any) => v ? new Date(v).toLocaleDateString() : '' },
      { key: 'status', header: 'Status' },
    ] as ExportColumn[],
  },

  donations: {
    columns: [
      { key: 'donorName', header: 'Donor Name' },
      { key: 'email', header: 'Email' },
      { key: 'amount', header: 'Amount', formatter: (v: any) => `$${(v / 100).toFixed(2)}` },
      { key: 'type', header: 'Type' },
      { key: 'sponsorTier', header: 'Sponsor Tier' },
      { key: 'date', header: 'Date', formatter: (v: any) => v ? new Date(v).toLocaleDateString() : '' },
      { key: 'status', header: 'Status' },
    ] as ExportColumn[],
  },

  analytics: {
    columns: [
      { key: 'date', header: 'Date', formatter: (v: any) => v ? new Date(v).toLocaleDateString() : '' },
      { key: 'totalStudents', header: 'Total Students' },
      { key: 'activeStudents', header: 'Active Students' },
      { key: 'totalMentors', header: 'Total Mentors' },
      { key: 'totalOrganizations', header: 'Organizations' },
      { key: 'programCompletions', header: 'Program Completions' },
      { key: 'completionRate', header: 'Completion Rate', formatter: (v: any) => `${(v || 0).toFixed(1)}%` },
      { key: 'livesImpacted', header: 'Lives Impacted' },
      { key: 'progressToGoal', header: 'Progress to 2030 Goal', formatter: (v: any) => `${(v || 0).toFixed(2)}%` },
    ] as ExportColumn[],
  },

  waitlist: {
    columns: [
      { key: 'email', header: 'Email' },
      { key: 'name', header: 'Name' },
      { key: 'role', header: 'Role/Interest' },
      { key: 'organization', header: 'Organization' },
      { key: 'signupDate', header: 'Signup Date', formatter: (v: any) => v ? new Date(v).toLocaleDateString() : '' },
      { key: 'source', header: 'Source' },
    ] as ExportColumn[],
  },
};
