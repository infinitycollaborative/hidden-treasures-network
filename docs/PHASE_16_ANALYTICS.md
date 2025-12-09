# PHASE 16: ANALYTICS & REPORTING ENGINE
## Hidden Treasures Network - Complete Implementation Guide

---

## 📋 OVERVIEW

**Phase 16** delivers a comprehensive analytics and reporting system that transforms raw operational data into actionable insights for stakeholders. This phase enables data-driven decision-making, proves impact to sponsors, and tracks progress toward the Flight Plan 2030 goal of reaching 1 million lives.

### **Key Deliverables**
- ✅ Automated daily/weekly/monthly snapshot generation
- ✅ Real-time dashboards (platform admin, sponsor, school, teacher)
- ✅ Custom report builder with filters and visualizations
- ✅ Predictive analytics using AI
- ✅ Data exports (CSV, XLSX, PDF, JSON)
- ✅ Flight Plan 2030 progress tracking
- ✅ KPI target monitoring and alerts
- ✅ Geographic heat maps and trend analysis

### **Timeline**: 3-4 weeks
### **Dependencies**: Phases 13-15 (Gamification, Schools, Marketplace)

---

## 🎯 SUCCESS METRICS

After Phase 16 is complete, you should be able to:
- [ ] Generate daily snapshots automatically at midnight
- [ ] View platform-wide metrics in admin dashboard (<2s load time)
- [ ] Show sponsors their exact impact (students helped, XP generated, donations used)
- [ ] Create custom reports with filters and date ranges
- [ ] Export data to CSV, XLSX, PDF, JSON
- [ ] Predict student risk levels using AI
- [ ] Track progress toward 1M lives goal in real-time
- [ ] Set KPI targets and receive alerts when thresholds are met

---

## 🗄️ DATABASE SCHEMA

### **Collection 1: `analyticsSnapshots`**

Stores automated snapshots of platform metrics at specific points in time.

```typescript
interface AnalyticsSnapshot {
  snapshotId: string;              // Auto-generated document ID
  timestamp: Timestamp;            // When snapshot was taken
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Timestamp;            // Period start
  endDate: Timestamp;              // Period end

  // Student Metrics
  studentMetrics: {
    totalStudents: number;         // Active students
    newStudents: number;           // Added this period
    activeStudents: number;        // Logged in this period
    totalXP: number;               // Sum of all student XP
    averageXP: number;             // Mean XP per student
    totalBadges: number;           // Total badges earned
    totalFlightHours: number;      // Sum of all flight hours
    averageFlightHours: number;    // Mean flight hours
    graduationRate: number;        // % reaching Pilot/Captain
    atRiskCount: number;           // Students flagged by AI
  };

  // Program Metrics
  programMetrics: {
    totalPrograms: number;         // Active programs
    newPrograms: number;           // Created this period
    totalSessions: number;         // Total sessions held
    averageAttendance: number;     // Mean attendance rate
    completionRate: number;        // % sessions marked complete
    totalParticipants: number;     // Unique student-session pairs
  };

  // Financial Metrics
  financialMetrics: {
    totalDonations: number;        // Sum of donations this period
    donationCount: number;         // Number of donations
    averageDonation: number;       // Mean donation amount
    totalRevenue: number;          // From marketplace sales
    itemsSold: number;             // Marketplace items sold
    sponsorContributions: number;  // Corporate sponsor total
  };

  // Engagement Metrics
  engagementMetrics: {
    dailyActiveUsers: number;      // DAU average
    weeklyActiveUsers: number;     // WAU average
    monthlyActiveUsers: number;    // MAU
    averageSessionDuration: number; // Minutes
    bounceRate: number;            // % single-page sessions
    returnRate: number;            // % users returning
  };

  // Geographic Metrics
  geographicMetrics: {
    schoolCount: number;           // Total schools
    districtCount: number;         // Unique districts
    stateBreakdown: Record<string, number>; // State -> student count
    ruralCount: number;            // Students in rural areas
    urbanCount: number;            // Students in urban areas
  };

  // Flight Plan 2030 Progress
  flightPlan2030: {
    livesReached: number;          // Total unique students served
    percentageToGoal: number;      // Progress to 1M (0-100)
    projectedCompletion: Timestamp; // Estimated date to reach 1M
    monthlyGrowthRate: number;     // % growth per month
  };

  generatedBy: 'automated' | 'manual';
  generatedAt: Timestamp;
  version: string;                 // Schema version (e.g., "1.0")
}
```

**Firestore Path**: `/analyticsSnapshots/{snapshotId}`

**Indexes Needed**:
```javascript
// In firebase.json or Firestore console
{
  "indexes": [
    {
      "collectionGroup": "analyticsSnapshots",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "period", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "analyticsSnapshots",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "generatedBy", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ]
}
```

---

### **Collection 2: `customReports`**

Stores user-defined report templates with filters and configurations.

```typescript
interface CustomReport {
  reportId: string;                // Auto-generated document ID
  name: string;                    // User-friendly name
  description: string;             // What this report shows
  createdBy: string;               // User ID who created it
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Report Configuration
  config: {
    dataSource: 'students' | 'programs' | 'donations' | 'sessions' | 'marketplace';
    dateRange: {
      type: 'custom' | 'last7days' | 'last30days' | 'last90days' | 'thisYear' | 'allTime';
      startDate?: Timestamp;       // For custom ranges
      endDate?: Timestamp;
    };

    // Filters
    filters: {
      schoolIds?: string[];        // Filter by schools
      gradeLevel?: string[];       // Filter by grade
      rankTier?: string[];         // Filter by rank
      donationType?: string[];     // Filter donation type
      sponsorId?: string;          // Filter by sponsor
      programType?: string[];      // Filter program type
      geographicRegion?: string[]; // Filter by state/district
    };

    // Metrics to Include
    metrics: string[];             // e.g., ['totalXP', 'badgeCount', 'flightHours']

    // Grouping
    groupBy?: 'school' | 'grade' | 'month' | 'sponsor' | 'program';

    // Sorting
    sortBy: string;                // Metric to sort by
    sortOrder: 'asc' | 'desc';

    // Visualization
    chartType: 'bar' | 'line' | 'pie' | 'table' | 'heatmap';

    // Export Format
    exportFormat: 'csv' | 'xlsx' | 'pdf' | 'json';
  };

  // Access Control
  visibility: 'private' | 'shared' | 'public';
  sharedWith: string[];            // User IDs with access

  // Schedule (optional)
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number;            // 0-6 for weekly
    dayOfMonth?: number;           // 1-31 for monthly
    time: string;                  // HH:mm format
    recipients: string[];          // Email addresses
  };

  // Usage Stats
  runCount: number;                // Times this report was run
  lastRun?: Timestamp;
  averageRuntime: number;          // Seconds
}
```

**Firestore Path**: `/customReports/{reportId}`

---

### **Collection 3: `reportRuns`**

Stores execution history and results of custom reports.

```typescript
interface ReportRun {
  runId: string;                   // Auto-generated document ID
  reportId: string;                // Reference to customReport
  reportName: string;              // Snapshot of name at run time

  executedBy: string;              // User ID
  executedAt: Timestamp;
  completedAt?: Timestamp;

  status: 'running' | 'completed' | 'failed';
  errorMessage?: string;

  // Execution Details
  rowCount: number;                // Number of data rows
  executionTime: number;           // Milliseconds

  // Data Storage
  resultData: any[];               // Actual report data (limit to 1000 rows)
  dataStoragePath?: string;        // GCS path for large results

  // Export Details
  exportFormat: 'csv' | 'xlsx' | 'pdf' | 'json';
  exportUrl?: string;              // Download URL (expires in 7 days)
  exportSize: number;              // Bytes

  // Metadata
  filters: any;                    // Snapshot of filters used
  dateRange: any;                  // Snapshot of date range
}
```

**Firestore Path**: `/reportRuns/{runId}`

---

### **Collection 4: `kpiTargets`**

Stores Key Performance Indicator targets and alerts.

```typescript
interface KPITarget {
  targetId: string;                // Auto-generated document ID
  name: string;                    // e.g., "Monthly Active Students"
  description: string;

  // Metric Definition
  metricPath: string;              // e.g., "studentMetrics.activeStudents"
  targetValue: number;             // Goal to reach
  currentValue: number;            // Latest actual value
  unit: string;                    // e.g., "students", "dollars", "percent"

  // Thresholds
  thresholds: {
    red: number;                   // Critical (< this value)
    yellow: number;                // Warning (< this value)
    green: number;                 // On track (>= this value)
  };

  // Time Period
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Timestamp;
  endDate: Timestamp;

  // Status
  status: 'on-track' | 'at-risk' | 'critical' | 'achieved';
  percentageComplete: number;      // 0-100

  // Alerts
  alerts: {
    enabled: boolean;
    notifyUsers: string[];         // User IDs to alert
    emailOnYellow: boolean;
    emailOnRed: boolean;
    slackWebhook?: string;
  };

  // Ownership
  owner: string;                   // User ID responsible
  stakeholders: string[];          // User IDs interested

  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastChecked?: Timestamp;
}
```

**Firestore Path**: `/kpiTargets/{targetId}`

---

### **Collection 5: `dataExports`**

Tracks data export requests and files.

```typescript
interface DataExport {
  exportId: string;                // Auto-generated document ID
  requestedBy: string;             // User ID
  requestedAt: Timestamp;
  completedAt?: Timestamp;

  // Export Configuration
  exportType: 'snapshot' | 'custom-report' | 'raw-data';
  dataSource: string;              // Collection name or report ID
  format: 'csv' | 'xlsx' | 'pdf' | 'json';

  // Filters
  dateRange?: {
    startDate: Timestamp;
    endDate: Timestamp;
  };
  filters?: any;

  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed';
  errorMessage?: string;

  // File Details
  fileName: string;
  fileSize: number;                // Bytes
  rowCount: number;
  storagePath: string;             // GCS path
  downloadUrl?: string;            // Signed URL (expires in 7 days)
  expiresAt?: Timestamp;

  // Privacy
  includesPII: boolean;            // Contains personal info?
  auditLog: boolean;               // Log access for compliance
}
```

**Firestore Path**: `/dataExports/{exportId}`

---

## 🔥 CLOUD FUNCTIONS

### **Function 1: Daily Snapshot Generator**

Automatically generates analytics snapshots every day at midnight.

**File**: `functions/src/analytics/generateSnapshot.ts`

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { AnalyticsSnapshot } from '../types';

export const generateDailySnapshot = functions.pubsub
  .schedule('0 0 * * *') // Every day at midnight UTC
  .timeZone('America/New_York')
  .onRun(async (context) => {
    const db = admin.firestore();
    const now = admin.firestore.Timestamp.now();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const startDate = admin.firestore.Timestamp.fromDate(yesterday);
    const endDate = admin.firestore.Timestamp.fromDate(new Date(yesterday.getTime() + 86400000));

    console.log(`Generating daily snapshot for ${yesterday.toISOString()}`);

    try {
      // Fetch Student Metrics
      const studentsSnapshot = await db.collection('students').get();
      const students = studentsSnapshot.docs.map(doc => doc.data());

      const activeStudents = students.filter(s => {
        const lastActive = s.lastActive?.toDate();
        return lastActive && lastActive >= yesterday && lastActive < new Date(yesterday.getTime() + 86400000);
      });

      const totalXP = students.reduce((sum, s) => sum + (s.xp || 0), 0);
      const totalFlightHours = students.reduce((sum, s) => sum + (s.flightHours || 0), 0);
      const totalBadges = students.reduce((sum, s) => sum + (s.badges?.length || 0), 0);

      const graduatedStudents = students.filter(s =>
        s.currentRank === 'pilot' || s.currentRank === 'captain'
      );

      // Fetch Program Metrics
      const programsSnapshot = await db.collection('programs').get();
      const programs = programsSnapshot.docs.map(doc => doc.data());

      const sessionsSnapshot = await db.collection('programSessions').get();
      const sessions = sessionsSnapshot.docs.map(doc => doc.data());

      const sessionsInPeriod = sessions.filter(s => {
        const sessionDate = s.date?.toDate();
        return sessionDate && sessionDate >= yesterday && sessionDate < new Date(yesterday.getTime() + 86400000);
      });

      const totalAttendance = sessionsInPeriod.reduce((sum, s) =>
        sum + (s.attendance?.length || 0), 0
      );
      const averageAttendance = sessionsInPeriod.length > 0
        ? totalAttendance / sessionsInPeriod.length
        : 0;

      // Fetch Financial Metrics
      const donationsSnapshot = await db.collection('donations')
        .where('createdAt', '>=', startDate)
        .where('createdAt', '<', endDate)
        .get();

      const donations = donationsSnapshot.docs.map(doc => doc.data());
      const totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

      const marketplaceSnapshot = await db.collection('marketplaceTransactions')
        .where('purchasedAt', '>=', startDate)
        .where('purchasedAt', '<', endDate)
        .get();

      const transactions = marketplaceSnapshot.docs.map(doc => doc.data());
      const totalRevenue = transactions.reduce((sum, t) => sum + (t.xpCost || 0), 0);

      // Fetch Geographic Metrics
      const schoolsSnapshot = await db.collection('schools').get();
      const schools = schoolsSnapshot.docs.map(doc => doc.data());

      const stateBreakdown: Record<string, number> = {};
      schools.forEach(school => {
        const state = school.address?.state || 'Unknown';
        stateBreakdown[state] = (stateBreakdown[state] || 0) +
          (school.studentIds?.length || 0);
      });

      // Calculate Flight Plan 2030 Progress
      const uniqueStudentsServed = students.length;
      const goalStudents = 1000000;
      const percentageToGoal = (uniqueStudentsServed / goalStudents) * 100;

      // Calculate growth rate (comparing to last month)
      const lastMonthSnapshot = await db.collection('analyticsSnapshots')
        .where('period', '==', 'monthly')
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get();

      let monthlyGrowthRate = 0;
      if (!lastMonthSnapshot.empty) {
        const lastMonth = lastMonthSnapshot.docs[0].data();
        const lastMonthStudents = lastMonth.studentMetrics.totalStudents;
        monthlyGrowthRate = ((uniqueStudentsServed - lastMonthStudents) / lastMonthStudents) * 100;
      }

      // Project completion date
      let projectedCompletionDate = new Date();
      if (monthlyGrowthRate > 0) {
        const monthsToGoal = Math.log(goalStudents / uniqueStudentsServed) /
          Math.log(1 + monthlyGrowthRate / 100);
        projectedCompletionDate.setMonth(projectedCompletionDate.getMonth() + monthsToGoal);
      }

      // Create Snapshot
      const snapshot: AnalyticsSnapshot = {
        snapshotId: db.collection('analyticsSnapshots').doc().id,
        timestamp: now,
        period: 'daily',
        startDate,
        endDate,

        studentMetrics: {
          totalStudents: students.length,
          newStudents: students.filter(s => {
            const created = s.createdAt?.toDate();
            return created && created >= yesterday && created < new Date(yesterday.getTime() + 86400000);
          }).length,
          activeStudents: activeStudents.length,
          totalXP,
          averageXP: students.length > 0 ? totalXP / students.length : 0,
          totalBadges,
          totalFlightHours,
          averageFlightHours: students.length > 0 ? totalFlightHours / students.length : 0,
          graduationRate: students.length > 0 ? (graduatedStudents.length / students.length) * 100 : 0,
          atRiskCount: 0, // Calculated by AI function
        },

        programMetrics: {
          totalPrograms: programs.length,
          newPrograms: programs.filter(p => {
            const created = p.createdAt?.toDate();
            return created && created >= yesterday && created < new Date(yesterday.getTime() + 86400000);
          }).length,
          totalSessions: sessions.length,
          averageAttendance,
          completionRate: sessions.length > 0
            ? (sessions.filter(s => s.status === 'completed').length / sessions.length) * 100
            : 0,
          totalParticipants: totalAttendance,
        },

        financialMetrics: {
          totalDonations,
          donationCount: donations.length,
          averageDonation: donations.length > 0 ? totalDonations / donations.length : 0,
          totalRevenue,
          itemsSold: transactions.length,
          sponsorContributions: donations.filter(d => d.donorType === 'corporate').reduce((sum, d) => sum + d.amount, 0),
        },

        engagementMetrics: {
          dailyActiveUsers: activeStudents.length,
          weeklyActiveUsers: 0, // Calculated separately
          monthlyActiveUsers: 0, // Calculated separately
          averageSessionDuration: 0, // Requires session tracking
          bounceRate: 0,
          returnRate: 0,
        },

        geographicMetrics: {
          schoolCount: schools.length,
          districtCount: new Set(schools.map(s => s.districtId)).size,
          stateBreakdown,
          ruralCount: students.filter(s => s.geographicType === 'rural').length,
          urbanCount: students.filter(s => s.geographicType === 'urban').length,
        },

        flightPlan2030: {
          livesReached: uniqueStudentsServed,
          percentageToGoal,
          projectedCompletion: admin.firestore.Timestamp.fromDate(projectedCompletionDate),
          monthlyGrowthRate,
        },

        generatedBy: 'automated',
        generatedAt: now,
        version: '1.0',
      };

      // Save to Firestore
      await db.collection('analyticsSnapshots').doc(snapshot.snapshotId).set(snapshot);

      console.log(`Daily snapshot created: ${snapshot.snapshotId}`);

      // Check KPI targets and send alerts
      await checkKPITargets(snapshot);

      return { success: true, snapshotId: snapshot.snapshotId };

    } catch (error) {
      console.error('Error generating daily snapshot:', error);
      throw new functions.https.HttpsError('internal', 'Failed to generate snapshot');
    }
  });

// Helper function to check KPI targets
async function checkKPITargets(snapshot: AnalyticsSnapshot) {
  const db = admin.firestore();
  const targetsSnapshot = await db.collection('kpiTargets')
    .where('period', '==', 'daily')
    .get();

  for (const doc of targetsSnapshot.docs) {
    const target = doc.data();

    // Extract current value from snapshot using metricPath
    const currentValue = getNestedValue(snapshot, target.metricPath);

    // Update KPI document
    let status: 'on-track' | 'at-risk' | 'critical' | 'achieved' = 'on-track';
    if (currentValue >= target.targetValue) {
      status = 'achieved';
    } else if (currentValue < target.thresholds.red) {
      status = 'critical';
    } else if (currentValue < target.thresholds.yellow) {
      status = 'at-risk';
    }

    await doc.ref.update({
      currentValue,
      status,
      percentageComplete: (currentValue / target.targetValue) * 100,
      lastChecked: admin.firestore.Timestamp.now(),
    });

    // Send alerts if needed
    if (target.alerts?.enabled) {
      if ((status === 'critical' && target.alerts.emailOnRed) ||
          (status === 'at-risk' && target.alerts.emailOnYellow)) {
        // Send email alert (integrate with SendGrid in Phase 18)
        console.log(`KPI Alert: ${target.name} is ${status}`);
      }
    }
  }
}

function getNestedValue(obj: any, path: string): number {
  return path.split('.').reduce((current, key) => current?.[key], obj) || 0;
}
```

---

### **Function 2: Generate Custom Report**

Executes a custom report and returns results.

**File**: `functions/src/analytics/generateCustomReport.ts`

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CustomReport, ReportRun } from '../types';

export const generateCustomReport = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { reportId } = data;
  const db = admin.firestore();

  try {
    // Fetch report configuration
    const reportDoc = await db.collection('customReports').doc(reportId).get();
    if (!reportDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Report not found');
    }

    const report = reportDoc.data() as CustomReport;

    // Check access permissions
    if (report.visibility === 'private' && report.createdBy !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'No access to this report');
    }

    if (report.visibility === 'shared' &&
        !report.sharedWith.includes(context.auth.uid) &&
        report.createdBy !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'No access to this report');
    }

    // Create report run document
    const runId = db.collection('reportRuns').doc().id;
    const startTime = Date.now();

    const reportRun: Partial<ReportRun> = {
      runId,
      reportId,
      reportName: report.name,
      executedBy: context.auth.uid,
      executedAt: admin.firestore.Timestamp.now(),
      status: 'running',
      filters: report.config.filters,
      dateRange: report.config.dateRange,
      exportFormat: report.config.exportFormat,
    };

    await db.collection('reportRuns').doc(runId).set(reportRun);

    // Build query based on configuration
    let query: admin.firestore.Query = db.collection(report.config.dataSource);

    // Apply date range filter
    if (report.config.dateRange.type === 'custom') {
      if (report.config.dateRange.startDate) {
        query = query.where('createdAt', '>=', report.config.dateRange.startDate);
      }
      if (report.config.dateRange.endDate) {
        query = query.where('createdAt', '<=', report.config.dateRange.endDate);
      }
    } else {
      const dateRange = calculateDateRange(report.config.dateRange.type);
      query = query.where('createdAt', '>=', dateRange.start);
      query = query.where('createdAt', '<=', dateRange.end);
    }

    // Apply filters
    if (report.config.filters.schoolIds && report.config.filters.schoolIds.length > 0) {
      query = query.where('schoolId', 'in', report.config.filters.schoolIds.slice(0, 10));
    }

    if (report.config.filters.gradeLevel && report.config.filters.gradeLevel.length > 0) {
      query = query.where('gradeLevel', 'in', report.config.filters.gradeLevel.slice(0, 10));
    }

    // Execute query
    const snapshot = await query.get();
    let resultData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Apply grouping
    if (report.config.groupBy) {
      resultData = groupData(resultData, report.config.groupBy, report.config.metrics);
    }

    // Apply sorting
    resultData.sort((a, b) => {
      const aVal = a[report.config.sortBy] || 0;
      const bVal = b[report.config.sortBy] || 0;
      return report.config.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    const endTime = Date.now();

    // Update report run with results
    await db.collection('reportRuns').doc(runId).update({
      status: 'completed',
      completedAt: admin.firestore.Timestamp.now(),
      rowCount: resultData.length,
      executionTime: endTime - startTime,
      resultData: resultData.slice(0, 1000), // Limit stored data
    });

    // Update report usage stats
    await db.collection('customReports').doc(reportId).update({
      runCount: admin.firestore.FieldValue.increment(1),
      lastRun: admin.firestore.Timestamp.now(),
      averageRuntime: admin.firestore.FieldValue.increment((endTime - startTime) / 1000),
    });

    return {
      success: true,
      runId,
      rowCount: resultData.length,
      data: resultData,
    };

  } catch (error) {
    console.error('Error generating custom report:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate report');
  }
});

function calculateDateRange(type: string): { start: admin.firestore.Timestamp; end: admin.firestore.Timestamp } {
  const now = new Date();
  let start: Date;

  switch (type) {
    case 'last7days':
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'last30days':
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'last90days':
      start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'thisYear':
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      start = new Date(0); // All time
  }

  return {
    start: admin.firestore.Timestamp.fromDate(start),
    end: admin.firestore.Timestamp.fromDate(now),
  };
}

function groupData(data: any[], groupBy: string, metrics: string[]): any[] {
  const grouped: Record<string, any> = {};

  data.forEach(item => {
    const key = item[groupBy] || 'Unknown';
    if (!grouped[key]) {
      grouped[key] = { [groupBy]: key };
      metrics.forEach(metric => {
        grouped[key][metric] = 0;
      });
    }

    metrics.forEach(metric => {
      grouped[key][metric] += item[metric] || 0;
    });
  });

  return Object.values(grouped);
}
```

---

### **Function 3: Predictive Analytics with AI**

Uses Claude API to predict student risk levels and generate insights.

**File**: `functions/src/analytics/predictiveAnalytics.ts`

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: functions.config().anthropic.key,
});

export const predictStudentRisk = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { studentId } = data;
  const db = admin.firestore();

  try {
    // Fetch student data
    const studentDoc = await db.collection('students').doc(studentId).get();
    if (!studentDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Student not found');
    }

    const student = studentDoc.data();

    // Fetch student's session history
    const sessionsSnapshot = await db.collection('programSessions')
      .where('attendance', 'array-contains', studentId)
      .orderBy('date', 'desc')
      .limit(20)
      .get();

    const sessions = sessionsSnapshot.docs.map(doc => doc.data());

    // Fetch student's badge progress
    const badgesSnapshot = await db.collection('badges')
      .where('earnedBy', 'array-contains', studentId)
      .get();

    const badges = badgesSnapshot.docs.map(doc => doc.data());

    // Prepare data for AI analysis
    const studentContext = {
      xp: student.xp,
      flightHours: student.flightHours,
      currentRank: student.currentRank,
      gradeLevel: student.gradeLevel,
      lastActive: student.lastActive?.toDate(),
      sessionAttendance: sessions.length,
      badgesEarned: badges.length,
      recentActivity: sessions.slice(0, 5).map(s => ({
        date: s.date?.toDate(),
        type: s.sessionType,
      })),
    };

    // Call Claude API for prediction
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Analyze this student's engagement data and predict their risk level (low, medium, high) of disengagement. Also provide specific recommendations.

Student Data:
${JSON.stringify(studentContext, null, 2)}

Provide your response in this JSON format:
{
  "riskLevel": "low" | "medium" | "high",
  "riskScore": 0-100,
  "factors": ["factor1", "factor2"],
  "recommendations": ["rec1", "rec2"],
  "reasoning": "explanation"
}`,
      }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const prediction = JSON.parse(responseText);

    // Store prediction in student document
    await db.collection('students').doc(studentId).update({
      riskLevel: prediction.riskLevel,
      riskScore: prediction.riskScore,
      lastRiskAssessment: admin.firestore.Timestamp.now(),
    });

    return {
      success: true,
      prediction,
    };

  } catch (error) {
    console.error('Error predicting student risk:', error);
    throw new functions.https.HttpsError('internal', 'Failed to predict risk');
  }
});

export const generateInsights = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { snapshotId } = data;
  const db = admin.firestore();

  try {
    // Fetch snapshot data
    const snapshotDoc = await db.collection('analyticsSnapshots').doc(snapshotId).get();
    if (!snapshotDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Snapshot not found');
    }

    const snapshot = snapshotDoc.data();

    // Call Claude API for insights
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Analyze this platform analytics snapshot and provide key insights, trends, and recommendations for the Hidden Treasures Network team.

Analytics Data:
${JSON.stringify(snapshot, null, 2)}

Provide:
1. Top 3 positive trends
2. Top 3 areas of concern
3. 5 actionable recommendations
4. Prediction for next period

Format as JSON:
{
  "positiveTrends": ["trend1", "trend2", "trend3"],
  "concerns": ["concern1", "concern2", "concern3"],
  "recommendations": ["rec1", "rec2", "rec3", "rec4", "rec5"],
  "prediction": "text",
  "summary": "executive summary"
}`,
      }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const insights = JSON.parse(responseText);

    return {
      success: true,
      insights,
    };

  } catch (error) {
    console.error('Error generating insights:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate insights');
  }
});
```

---

## 🎨 REACT COMPONENTS

### **Component 1: Platform Admin Dashboard**

**File**: `src/components/analytics/PlatformAdminDashboard.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { AnalyticsSnapshot } from '../../types';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const PlatformAdminDashboard: React.FC = () => {
  const [latestSnapshot, setLatestSnapshot] = useState<AnalyticsSnapshot | null>(null);
  const [historicalData, setHistoricalData] = useState<AnalyticsSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch latest daily snapshot
      const latestQuery = query(
        collection(db, 'analyticsSnapshots'),
        orderBy('timestamp', 'desc'),
        limit(1)
      );
      const latestSnapshot = await getDocs(latestQuery);

      if (!latestSnapshot.empty) {
        setLatestSnapshot(latestSnapshot.docs[0].data() as AnalyticsSnapshot);
      }

      // Fetch last 30 daily snapshots for trends
      const historicalQuery = query(
        collection(db, 'analyticsSnapshots'),
        orderBy('timestamp', 'desc'),
        limit(30)
      );
      const historicalSnapshot = await getDocs(historicalQuery);
      const historical = historicalSnapshot.docs.map(doc => doc.data() as AnalyticsSnapshot);
      setHistoricalData(historical.reverse());

      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!latestSnapshot) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No analytics data available yet.</p>
      </div>
    );
  }

  // Prepare chart data
  const studentGrowthData = {
    labels: historicalData.map(s => {
      const date = s.timestamp.toDate();
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Total Students',
        data: historicalData.map(s => s.studentMetrics.totalStudents),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Active Students',
        data: historicalData.map(s => s.studentMetrics.activeStudents),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const xpDistributionData = {
    labels: historicalData.slice(-7).map(s => {
      const date = s.timestamp.toDate();
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Total XP Generated',
        data: historicalData.slice(-7).map(s => s.studentMetrics.totalXP),
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
      },
    ],
  };

  const geographicData = {
    labels: Object.keys(latestSnapshot.geographicMetrics.stateBreakdown).slice(0, 10),
    datasets: [
      {
        label: 'Students by State',
        data: Object.values(latestSnapshot.geographicMetrics.stateBreakdown).slice(0, 10),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(234, 179, 8, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Platform Analytics Dashboard</h1>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Students */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-blue-600">
                {latestSnapshot.studentMetrics.totalStudents.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 mt-1">
                +{latestSnapshot.studentMetrics.newStudents} today
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total XP */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total XP</p>
              <p className="text-3xl font-bold text-purple-600">
                {(latestSnapshot.studentMetrics.totalXP / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Avg: {latestSnapshot.studentMetrics.averageXP.toFixed(0)} per student
              </p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Programs */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Programs</p>
              <p className="text-3xl font-bold text-green-600">
                {latestSnapshot.programMetrics.totalPrograms}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {latestSnapshot.programMetrics.totalSessions} sessions held
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        {/* Flight Plan 2030 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Flight Plan 2030</p>
              <p className="text-3xl font-bold text-yellow-600">
                {latestSnapshot.flightPlan2030.percentageToGoal.toFixed(2)}%
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {latestSnapshot.flightPlan2030.livesReached.toLocaleString()} / 1,000,000
              </p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Student Growth Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Student Growth (Last 30 Days)</h2>
          <Line data={studentGrowthData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>

        {/* XP Generation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">XP Generation (Last 7 Days)</h2>
          <Bar data={xpDistributionData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Students by State (Top 10)</h2>
        <div className="max-w-md mx-auto">
          <Pie data={geographicData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Financial Summary (Today)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Total Donations</p>
            <p className="text-2xl font-bold text-green-600">
              ${latestSnapshot.financialMetrics.totalDonations.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {latestSnapshot.financialMetrics.donationCount} donations
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Marketplace Revenue</p>
            <p className="text-2xl font-bold text-purple-600">
              {latestSnapshot.financialMetrics.totalRevenue.toLocaleString()} XP
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {latestSnapshot.financialMetrics.itemsSold} items sold
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Corporate Sponsors</p>
            <p className="text-2xl font-bold text-blue-600">
              ${latestSnapshot.financialMetrics.sponsorContributions.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Avg: ${latestSnapshot.financialMetrics.averageDonation.toFixed(0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

### **Component 2: Sponsor Impact Dashboard**

**File**: `src/components/analytics/SponsorDashboard.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';

interface SponsorImpact {
  totalDonated: number;
  studentsHelped: number;
  xpGenerated: number;
  programsSupported: number;
  badgesEarned: number;
  flightHoursCompleted: number;
}

export const SponsorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [impact, setImpact] = useState<SponsorImpact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchSponsorImpact();
    }
  }, [currentUser]);

  const fetchSponsorImpact = async () => {
    if (!currentUser) return;

    try {
      // Fetch all donations by this sponsor
      const donationsQuery = query(
        collection(db, 'donations'),
        where('donorId', '==', currentUser.uid)
      );
      const donationsSnapshot = await getDocs(donationsQuery);
      const donations = donationsSnapshot.docs.map(doc => doc.data());

      const totalDonated = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

      // Fetch programs funded by donations
      const programIds = donations
        .filter(d => d.allocatedTo === 'program')
        .map(d => d.programId);

      let studentsHelped = 0;
      let xpGenerated = 0;
      let badgesEarned = 0;
      let flightHoursCompleted = 0;

      if (programIds.length > 0) {
        // Fetch students in these programs
        const programsQuery = query(
          collection(db, 'programs'),
          where('__name__', 'in', programIds.slice(0, 10))
        );
        const programsSnapshot = await getDocs(programsQuery);

        for (const programDoc of programsSnapshot.docs) {
          const program = programDoc.data();
          const studentIds = program.enrolledStudents || [];
          studentsHelped += studentIds.length;

          // Fetch stats for each student
          for (const studentId of studentIds) {
            const studentDoc = await getDocs(
              query(collection(db, 'students'), where('__name__', '==', studentId))
            );

            if (!studentDoc.empty) {
              const student = studentDoc.docs[0].data();
              xpGenerated += student.xp || 0;
              badgesEarned += student.badges?.length || 0;
              flightHoursCompleted += student.flightHours || 0;
            }
          }
        }
      }

      setImpact({
        totalDonated,
        studentsHelped,
        xpGenerated,
        programsSupported: programIds.length,
        badgesEarned,
        flightHoursCompleted,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching sponsor impact:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!impact) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No impact data available yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Your Impact</h1>
      <p className="text-gray-600 mb-8">See the difference your support is making</p>

      {/* Hero Impact Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-xl p-8 mb-8 text-white">
        <h2 className="text-4xl font-bold mb-2">
          {impact.studentsHelped}
        </h2>
        <p className="text-xl opacity-90">Students Reached</p>
        <p className="text-sm opacity-75 mt-4">
          Your contributions have directly impacted the lives of {impact.studentsHelped} students
        </p>
      </div>

      {/* Impact Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">Total Donated</p>
            <div className="bg-green-100 rounded-full p-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">
            ${impact.totalDonated.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">XP Generated</p>
            <div className="bg-purple-100 rounded-full p-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {(impact.xpGenerated / 1000).toFixed(1)}K
          </p>
          <p className="text-xs text-gray-500 mt-1">By students you supported</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">Programs Supported</p>
            <div className="bg-blue-100 rounded-full p-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {impact.programsSupported}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">Badges Earned</p>
            <div className="bg-yellow-100 rounded-full p-2">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-600">
            {impact.badgesEarned}
          </p>
          <p className="text-xs text-gray-500 mt-1">Achievements unlocked</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">Flight Hours</p>
            <div className="bg-indigo-100 rounded-full p-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-indigo-600">
            {impact.flightHoursCompleted.toFixed(1)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Hours of engagement</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h3 className="text-xl font-bold mb-2">Keep Making a Difference</h3>
        <p className="text-gray-600 mb-4">
          Your support is transforming lives. Consider increasing your impact today.
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Make Another Donation
        </button>
      </div>
    </div>
  );
};
```

---

## 🔒 SECURITY RULES

**File**: `firestore.rules` (add to existing rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Analytics Snapshots - Read-only for admins, automated writes
    match /analyticsSnapshots/{snapshotId} {
      allow read: if isAdmin() || isSponsor() || isTeacher();
      allow write: if false; // Only Cloud Functions can write
    }

    // Custom Reports - Users can manage their own
    match /customReports/{reportId} {
      allow read: if isAuthenticated() && (
        resource.data.createdBy == request.auth.uid ||
        resource.data.visibility == 'public' ||
        (resource.data.visibility == 'shared' && request.auth.uid in resource.data.sharedWith)
      );
      allow create: if isAuthenticated() && request.resource.data.createdBy == request.auth.uid;
      allow update: if isAuthenticated() && resource.data.createdBy == request.auth.uid;
      allow delete: if isAuthenticated() && resource.data.createdBy == request.auth.uid;
    }

    // Report Runs - Users can read their own
    match /reportRuns/{runId} {
      allow read: if isAuthenticated() && resource.data.executedBy == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.executedBy == request.auth.uid;
      allow update, delete: if false; // Immutable after creation
    }

    // KPI Targets - Admins only
    match /kpiTargets/{targetId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }

    // Data Exports - Users can read their own
    match /dataExports/{exportId} {
      allow read: if isAuthenticated() && resource.data.requestedBy == request.auth.uid;
      allow create: if isAuthenticated() && request.resource.data.requestedBy == request.auth.uid;
      allow update, delete: if false; // Immutable
    }

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    function isSponsor() {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'sponsor';
    }

    function isTeacher() {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }
  }
}
```

---

## ✅ TESTING CHECKLIST

### **1. Snapshot Generation**
- [ ] Daily snapshot runs automatically at midnight
- [ ] Snapshot contains all required metrics
- [ ] Student metrics are accurate (XP, badges, flight hours)
- [ ] Program metrics match session data
- [ ] Financial metrics sum correctly
- [ ] Geographic breakdown is accurate
- [ ] Flight Plan 2030 calculations are correct

### **2. Dashboards**
- [ ] Platform admin dashboard loads in <2 seconds
- [ ] All charts render correctly
- [ ] Real-time data updates work
- [ ] Sponsor dashboard shows correct impact
- [ ] School dashboard filters by school ID
- [ ] Teacher dashboard shows only their students

### **3. Custom Reports**
- [ ] Report builder saves configuration
- [ ] Filters apply correctly
- [ ] Date ranges work (last 7/30/90 days, custom)
- [ ] Grouping aggregates data properly
- [ ] Sorting works (asc/desc)
- [ ] Report execution completes <5 seconds
- [ ] Results are accurate

### **4. Data Exports**
- [ ] CSV export generates valid file
- [ ] XLSX export includes all columns
- [ ] PDF export formats correctly
- [ ] JSON export is valid
- [ ] Download URLs expire after 7 days
- [ ] Large exports (>10K rows) use Cloud Storage

### **5. Predictive Analytics**
- [ ] AI risk prediction returns valid JSON
- [ ] Risk levels (low/medium/high) are accurate
- [ ] Recommendations are actionable
- [ ] Insights function generates trends
- [ ] Predictions update student records

### **6. KPI Targets**
- [ ] Targets are checked daily
- [ ] Status updates correctly (on-track, at-risk, critical)
- [ ] Alerts send when thresholds are crossed
- [ ] Email notifications work
- [ ] Percentage complete calculates correctly

---

## 🚀 DEPLOYMENT GUIDE

### **Step 1: Install Dependencies**

```bash
cd functions
npm install @anthropic-ai/sdk chart.js react-chartjs-2
cd ..
npm install chart.js react-chartjs-2
```

### **Step 2: Configure Anthropic API**

```bash
firebase functions:config:set anthropic.key="YOUR_ANTHROPIC_API_KEY"
```

### **Step 3: Deploy Cloud Functions**

```bash
firebase deploy --only functions:generateDailySnapshot
firebase deploy --only functions:generateCustomReport
firebase deploy --only functions:predictStudentRisk
firebase deploy --only functions:generateInsights
```

### **Step 4: Deploy Firestore Indexes**

```bash
firebase deploy --only firestore:indexes
```

### **Step 5: Update Security Rules**

```bash
firebase deploy --only firestore:rules
```

### **Step 6: Test Snapshot Generation**

```bash
# Trigger manually first time
firebase functions:shell
> generateDailySnapshot()
```

### **Step 7: Verify Dashboards**

1. Navigate to `/admin/analytics`
2. Verify all metrics load
3. Check chart rendering
4. Test date range filters

---

## 🔗 INTEGRATION WITH OTHER PHASES

### **Phase 13 (Gamification)**
- Analytics tracks XP, badges, flight hours
- Dashboard shows progression data
- Reports filter by rank tier

### **Phase 14 (Schools)**
- Geographic metrics by school/district
- School admin dashboard shows their data
- Reports filter by school ID

### **Phase 15 (Marketplace)**
- Financial metrics include marketplace revenue
- Tracks items sold and XP spent
- Sponsor dashboard shows ROI

### **Phase 18 (Communication)**
- KPI alerts trigger emails/SMS
- Daily summary emails use snapshot data
- Reports can be emailed on schedule

---

## 📊 SAMPLE DATA

To test the analytics system, seed sample data:

**File**: `scripts/seedAnalytics.ts`

```typescript
import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

async function seedAnalytics() {
  // Create sample students
  for (let i = 0; i < 100; i++) {
    await db.collection('students').add({
      firstName: `Student${i}`,
      lastName: `Test`,
      xp: Math.floor(Math.random() * 5000),
      flightHours: Math.random() * 100,
      currentRank: ['cadet', 'pilot', 'captain'][Math.floor(Math.random() * 3)],
      badges: Array(Math.floor(Math.random() * 10)).fill('badge'),
      createdAt: admin.firestore.Timestamp.now(),
      lastActive: admin.firestore.Timestamp.now(),
    });
  }

  console.log('Seeded 100 students');
}

seedAnalytics();
```

Run: `ts-node scripts/seedAnalytics.ts`

---

## 🎯 NEXT STEPS

After Phase 16 is complete:

1. **Phase 17**: Mobile app to display analytics on-the-go
2. **Phase 18**: Communication hub to send automated reports
3. **Integration**: Connect analytics to sponsor emails
4. **Optimization**: Add caching for faster dashboard loads
5. **AI Enhancements**: Add more predictive models

---

## 📞 SUPPORT

If you encounter issues:

1. Check Cloud Function logs: `firebase functions:log`
2. Verify Firestore indexes are deployed
3. Ensure Anthropic API key is set correctly
4. Test with small datasets first
5. Review security rules for permissions

---

**Phase 16 is complete when:**
✅ Daily snapshots generate automatically
✅ All dashboards load with real data
✅ Custom reports can be created and run
✅ Data exports work in all formats
✅ AI predictions return valid results
✅ KPI targets send alerts
✅ All tests pass

**Estimated Build Time**: 3-4 weeks
**Lines of Code**: ~3,500
**Files Created**: ~15

🚀 **Ready to build! Copy this entire document and paste into Claude Code.**
