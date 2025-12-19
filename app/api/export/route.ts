import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { generateCSV, generateExcelXML, generateJSON, ExportColumn, ExportFormat } from '@/lib/export';

// Export configurations for different data types
const exportConfigs: Record<string, { collection: string; columns: ExportColumn[] }> = {
  students: {
    collection: 'users',
    columns: [
      { key: 'displayName', header: 'Name' },
      { key: 'email', header: 'Email' },
      { key: 'school', header: 'School' },
      { key: 'gradeLevel', header: 'Grade Level' },
      { key: 'program', header: 'Program' },
      { key: 'createdAt', header: 'Enrollment Date', formatter: (v) => formatDate(v) },
      { key: 'status', header: 'Status' },
    ],
  },
  mentors: {
    collection: 'users',
    columns: [
      { key: 'displayName', header: 'Name' },
      { key: 'email', header: 'Email' },
      { key: 'organization', header: 'Organization' },
      { key: 'expertise', header: 'Expertise' },
      { key: 'createdAt', header: 'Join Date', formatter: (v) => formatDate(v) },
      { key: 'status', header: 'Status' },
    ],
  },
  organizations: {
    collection: 'organizations',
    columns: [
      { key: 'name', header: 'Organization Name' },
      { key: 'type', header: 'Type' },
      { key: 'city', header: 'City' },
      { key: 'state', header: 'State' },
      { key: 'country', header: 'Country' },
      { key: 'contactEmail', header: 'Contact Email' },
      { key: 'createdAt', header: 'Join Date', formatter: (v) => formatDate(v) },
      { key: 'status', header: 'Status' },
    ],
  },
  donations: {
    collection: 'donations',
    columns: [
      { key: 'donorName', header: 'Donor Name' },
      { key: 'email', header: 'Email' },
      { key: 'amount', header: 'Amount', formatter: (v) => formatCurrency(v) },
      { key: 'type', header: 'Type' },
      { key: 'sponsorTier', header: 'Sponsor Tier' },
      { key: 'createdAt', header: 'Date', formatter: (v) => formatDate(v) },
      { key: 'status', header: 'Status' },
    ],
  },
  waitlist: {
    collection: 'waitlist',
    columns: [
      { key: 'email', header: 'Email' },
      { key: 'name', header: 'Name' },
      { key: 'role', header: 'Role/Interest' },
      { key: 'organization', header: 'Organization' },
      { key: 'createdAt', header: 'Signup Date', formatter: (v) => formatDate(v) },
      { key: 'source', header: 'Source' },
    ],
  },
  analytics: {
    collection: 'analyticsSnapshots',
    columns: [
      { key: 'createdAt', header: 'Date', formatter: (v) => formatDate(v) },
      { key: 'metrics.totalStudents', header: 'Total Students', formatter: (v) => String(v || 0) },
      { key: 'metrics.activeStudents', header: 'Active Students', formatter: (v) => String(v || 0) },
      { key: 'metrics.totalMentors', header: 'Total Mentors', formatter: (v) => String(v || 0) },
      { key: 'metrics.totalOrganizations', header: 'Organizations', formatter: (v) => String(v || 0) },
      { key: 'metrics.livesImpacted', header: 'Lives Impacted', formatter: (v) => String(v || 0) },
      { key: 'metrics.progressToGoal', header: 'Progress to Goal', formatter: (v) => `${(v || 0).toFixed(2)}%` },
    ],
  },
};

// Helper functions
function formatDate(value: any): string {
  if (!value) return '';
  // Handle Firestore Timestamp
  if (value?.toDate) {
    return value.toDate().toLocaleDateString();
  }
  // Handle date string or number
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return '';
  }
}

function formatCurrency(value: any): string {
  if (!value) return '$0.00';
  const amount = typeof value === 'number' ? value : parseFloat(value);
  return `$${(amount / 100).toFixed(2)}`;
}

// Get nested object value by dot notation path
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dataType = searchParams.get('type');
    const format = (searchParams.get('format') || 'csv') as ExportFormat;
    const maxRows = parseInt(searchParams.get('limit') || '1000', 10);

    if (!dataType || !exportConfigs[dataType]) {
      return NextResponse.json(
        { error: 'Invalid data type. Supported: ' + Object.keys(exportConfigs).join(', ') },
        { status: 400 }
      );
    }

    if (!['csv', 'excel', 'json'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Supported: csv, excel, json' },
        { status: 400 }
      );
    }

    // Check if Firebase is configured
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const config = exportConfigs[dataType];

    // Build query
    let q = query(
      collection(db, config.collection),
      orderBy('createdAt', 'desc'),
      limit(maxRows)
    );

    // Add role filter for users collection
    if (dataType === 'students') {
      q = query(
        collection(db, config.collection),
        where('role', '==', 'student'),
        orderBy('createdAt', 'desc'),
        limit(maxRows)
      );
    } else if (dataType === 'mentors') {
      q = query(
        collection(db, config.collection),
        where('role', '==', 'mentor'),
        orderBy('createdAt', 'desc'),
        limit(maxRows)
      );
    }

    // Fetch data
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => {
      const docData = doc.data();
      // Flatten nested values for export
      const flatData: Record<string, any> = { id: doc.id };
      for (const col of config.columns) {
        flatData[col.key] = getNestedValue(docData, col.key);
      }
      return flatData;
    });

    // Generate export content
    const exportOptions = {
      filename: `${dataType}_export`,
      format,
      columns: config.columns,
      data,
      title: `${dataType.charAt(0).toUpperCase() + dataType.slice(1)} Export`,
      includeTimestamp: true,
    };

    let content: string;
    let mimeType: string;
    let extension: string;

    switch (format) {
      case 'csv':
        content = generateCSV(exportOptions);
        mimeType = 'text/csv';
        extension = 'csv';
        break;
      case 'excel':
        content = generateExcelXML(exportOptions);
        mimeType = 'application/vnd.ms-excel';
        extension = 'xls';
        break;
      case 'json':
        content = generateJSON(exportOptions);
        mimeType = 'application/json';
        extension = 'json';
        break;
      default:
        throw new Error('Unsupported format');
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${dataType}_export_${timestamp}.${extension}`;

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: error?.message || 'Export failed' },
      { status: 500 }
    );
  }
}
