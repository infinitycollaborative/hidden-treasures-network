import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { generateReportHTML, reportTemplates, ReportConfig } from '@/lib/pdf-report';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reportType = searchParams.get('type') || 'executive';

    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    // Gather data for report
    const reportData = await gatherReportData();

    // Generate report based on type
    let config: ReportConfig;

    switch (reportType) {
      case 'executive':
        config = reportTemplates.executiveSummary(reportData);
        break;
      case 'flightplan':
        config = reportTemplates.flightPlan2030(reportData);
        break;
      case 'donor':
        config = reportTemplates.donorReport(reportData);
        break;
      default:
        config = reportTemplates.executiveSummary(reportData);
    }

    const html = generateReportHTML(config);

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error: any) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Report generation failed' },
      { status: 500 }
    );
  }
}

async function gatherReportData() {
  const data: Record<string, any> = {};

  try {
    // Get user counts
    const studentsQuery = query(
      collection(db!, 'users'),
      where('role', '==', 'student')
    );
    const studentsSnapshot = await getDocs(studentsQuery);
    data.totalStudents = studentsSnapshot.size;

    const mentorsQuery = query(
      collection(db!, 'users'),
      where('role', '==', 'mentor')
    );
    const mentorsSnapshot = await getDocs(mentorsQuery);
    data.activeMentors = mentorsSnapshot.size;

    // Get organization count
    const orgsSnapshot = await getDocs(collection(db!, 'organizations'));
    data.totalOrganizations = orgsSnapshot.size;

    // Get program data
    const programsSnapshot = await getDocs(collection(db!, 'programs'));
    data.totalPrograms = programsSnapshot.size;

    const enrollmentsSnapshot = await getDocs(collection(db!, 'enrollments'));
    data.programEnrollments = enrollmentsSnapshot.size;

    const completionsQuery = query(
      collection(db!, 'enrollments'),
      where('status', '==', 'completed')
    );
    const completionsSnapshot = await getDocs(completionsQuery);
    const programCompletions = completionsSnapshot.size;
    data.completionRate = data.programEnrollments > 0
      ? (programCompletions / data.programEnrollments) * 100
      : 0;

    // Get donations data
    const donationsSnapshot = await getDocs(collection(db!, 'donations'));
    let totalRaised = 0;
    donationsSnapshot.forEach((doc) => {
      totalRaised += doc.data().amount || 0;
    });
    data.totalRaised = totalRaised / 100; // Convert cents to dollars

    // Get impact data
    const impactDoc = await getDoc(doc(db!, 'analytics', 'impact'));
    data.livesImpacted = impactDoc.data()?.totalLivesImpacted || data.totalStudents + programCompletions;

    // Flight Plan 2030 calculations
    const GOAL_2030 = 1000000;
    data.progressToGoal = (data.livesImpacted / GOAL_2030) * 100;

    const endDate = new Date(2030, 11, 31);
    data.daysRemaining = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    // Trends (placeholder - would come from analytics snapshots)
    data.studentTrend = 'up';
    data.mentorTrend = 'up';

    // Milestones
    data.milestones = [
      { year: 2024, target: 50000, actual: data.livesImpacted, status: data.livesImpacted >= 50000 ? '✓' : 'In Progress' },
      { year: 2025, target: 150000, actual: 0, status: 'Upcoming' },
      { year: 2026, target: 300000, actual: 0, status: 'Upcoming' },
      { year: 2027, target: 500000, actual: 0, status: 'Upcoming' },
      { year: 2028, target: 700000, actual: 0, status: 'Upcoming' },
      { year: 2029, target: 850000, actual: 0, status: 'Upcoming' },
      { year: 2030, target: 1000000, actual: 0, status: 'Goal' },
    ];

    // Scholarships
    const scholarshipsQuery = query(
      collection(db!, 'scholarshipApplications'),
      where('status', '==', 'awarded')
    );
    const scholarshipsSnapshot = await getDocs(scholarshipsQuery);
    data.scholarshipsAwarded = scholarshipsSnapshot.size;
    data.programsFunded = data.totalPrograms;

  } catch (error) {
    console.error('Error gathering report data:', error);
  }

  return data;
}
