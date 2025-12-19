/**
 * PDF Report Generation
 * Generates printable HTML reports that can be saved as PDF
 */

export interface ReportSection {
  title: string;
  type: 'text' | 'table' | 'metric' | 'chart-placeholder';
  content: any;
}

export interface ReportConfig {
  title: string;
  subtitle?: string;
  logo?: string;
  generatedAt?: Date;
  sections: ReportSection[];
  footer?: string;
}

/**
 * Generate HTML report content
 */
export function generateReportHTML(config: ReportConfig): string {
  const { title, subtitle, generatedAt, sections, footer } = config;
  const date = generatedAt || new Date();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #1a1a2e;
      background: white;
      padding: 40px;
      max-width: 1000px;
      margin: 0 auto;
    }

    @media print {
      body {
        padding: 20px;
      }
      .no-print {
        display: none;
      }
      .page-break {
        page-break-before: always;
      }
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #D4AF37;
    }

    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #1a1a2e;
      margin-bottom: 10px;
    }

    .logo-icon {
      color: #D4AF37;
    }

    h1 {
      font-size: 28px;
      color: #1a1a2e;
      margin-bottom: 8px;
    }

    .subtitle {
      font-size: 16px;
      color: #666;
    }

    .generated-date {
      font-size: 12px;
      color: #888;
      margin-top: 10px;
    }

    .section {
      margin-bottom: 30px;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a2e;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #eee;
    }

    .text-content {
      font-size: 14px;
      color: #444;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .metric-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      border-left: 4px solid #D4AF37;
    }

    .metric-value {
      font-size: 32px;
      font-weight: bold;
      color: #1a1a2e;
    }

    .metric-label {
      font-size: 14px;
      color: #666;
      margin-top: 5px;
    }

    .metric-trend {
      font-size: 12px;
      margin-top: 8px;
    }

    .trend-up { color: #22c55e; }
    .trend-down { color: #ef4444; }
    .trend-stable { color: #666; }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      background: #1a1a2e;
      color: white;
      font-weight: 600;
    }

    tr:nth-child(even) {
      background: #f8f9fa;
    }

    tr:hover {
      background: #f0f0f0;
    }

    .chart-placeholder {
      background: #f8f9fa;
      padding: 40px;
      text-align: center;
      border-radius: 8px;
      color: #666;
      border: 2px dashed #ddd;
    }

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      text-align: center;
      font-size: 12px;
      color: #888;
    }

    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      background: #1a1a2e;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .print-button:hover {
      background: #2a2a4e;
    }
  </style>
</head>
<body>
  <button class="print-button no-print" onclick="window.print()">
    📄 Save as PDF
  </button>

  <div class="header">
    <div class="logo">
      <span class="logo-icon">✈</span> Hidden Treasures Network
    </div>
    <h1>${title}</h1>
    ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
    <p class="generated-date">Generated: ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}</p>
  </div>

  ${sections.map(section => renderSection(section)).join('\n')}

  ${footer ? `<div class="footer">${footer}</div>` : `
    <div class="footer">
      <p>Hidden Treasures Network - Empowering Youth Through Aviation & STEM</p>
      <p>© ${new Date().getFullYear()} Infinity Aero Club Tampa Bay, Inc. All rights reserved.</p>
    </div>
  `}
</body>
</html>`;
}

function renderSection(section: ReportSection): string {
  switch (section.type) {
    case 'text':
      return `
        <div class="section">
          <h2 class="section-title">${section.title}</h2>
          <div class="text-content">${section.content}</div>
        </div>`;

    case 'metric':
      return `
        <div class="section">
          <h2 class="section-title">${section.title}</h2>
          <div class="metrics-grid">
            ${section.content.map((metric: any) => `
              <div class="metric-card">
                <div class="metric-value">${formatMetricValue(metric.value, metric.format)}</div>
                <div class="metric-label">${metric.label}</div>
                ${metric.trend ? `
                  <div class="metric-trend ${getTrendClass(metric.trend)}">
                    ${getTrendIcon(metric.trend)} ${metric.trendValue || ''}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>`;

    case 'table':
      return `
        <div class="section">
          <h2 class="section-title">${section.title}</h2>
          <table>
            <thead>
              <tr>
                ${section.content.headers.map((h: string) => `<th>${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${section.content.rows.map((row: any[]) => `
                <tr>
                  ${row.map((cell: any) => `<td>${cell}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>`;

    case 'chart-placeholder':
      return `
        <div class="section">
          <h2 class="section-title">${section.title}</h2>
          <div class="chart-placeholder">
            📊 ${section.content || 'Chart visualization available in interactive dashboard'}
          </div>
        </div>`;

    default:
      return '';
  }
}

function formatMetricValue(value: any, format?: string): string {
  if (value === null || value === undefined) return '-';

  switch (format) {
    case 'currency':
      return `$${Number(value).toLocaleString()}`;
    case 'percent':
      return `${Number(value).toFixed(1)}%`;
    case 'number':
      return Number(value).toLocaleString();
    default:
      return String(value);
  }
}

function getTrendClass(trend: string): string {
  switch (trend) {
    case 'up': return 'trend-up';
    case 'down': return 'trend-down';
    default: return 'trend-stable';
  }
}

function getTrendIcon(trend: string): string {
  switch (trend) {
    case 'up': return '↑';
    case 'down': return '↓';
    default: return '→';
  }
}

/**
 * Pre-built report templates
 */
export const reportTemplates = {
  executiveSummary: (data: any): ReportConfig => ({
    title: 'Executive Summary Report',
    subtitle: 'Hidden Treasures Network Performance Overview',
    sections: [
      {
        title: 'Key Metrics',
        type: 'metric',
        content: [
          { label: 'Total Students', value: data.totalStudents, format: 'number', trend: data.studentTrend },
          { label: 'Active Mentors', value: data.activeMentors, format: 'number', trend: data.mentorTrend },
          { label: 'Partner Organizations', value: data.totalOrganizations, format: 'number' },
          { label: 'Lives Impacted', value: data.livesImpacted, format: 'number', trend: 'up' },
        ],
      },
      {
        title: 'Flight Plan 2030 Progress',
        type: 'metric',
        content: [
          { label: 'Progress to Goal', value: data.progressToGoal, format: 'percent' },
          { label: 'Target: 1 Million Lives', value: '1,000,000', format: 'number' },
        ],
      },
      {
        title: 'Program Performance',
        type: 'metric',
        content: [
          { label: 'Total Programs', value: data.totalPrograms, format: 'number' },
          { label: 'Completion Rate', value: data.completionRate, format: 'percent' },
          { label: 'Enrollments', value: data.programEnrollments, format: 'number' },
        ],
      },
    ],
  }),

  flightPlan2030: (data: any): ReportConfig => ({
    title: 'Flight Plan 2030 Report',
    subtitle: 'Progress Toward Impacting One Million Lives',
    sections: [
      {
        title: 'Overall Progress',
        type: 'metric',
        content: [
          { label: 'Lives Impacted', value: data.livesImpacted, format: 'number' },
          { label: 'Progress', value: data.progressToGoal, format: 'percent' },
          { label: 'Days Remaining', value: data.daysRemaining, format: 'number' },
        ],
      },
      {
        title: 'Yearly Milestones',
        type: 'table',
        content: {
          headers: ['Year', 'Target', 'Actual', 'Status'],
          rows: data.milestones?.map((m: any) => [
            m.year,
            m.target.toLocaleString(),
            m.actual.toLocaleString(),
            m.status,
          ]) || [],
        },
      },
    ],
  }),

  donorReport: (data: any): ReportConfig => ({
    title: 'Donor Impact Report',
    subtitle: 'Thank You for Your Support',
    sections: [
      {
        title: 'Your Impact',
        type: 'text',
        content: `Your generous contributions have helped us reach ${data.livesImpacted?.toLocaleString() || 0} young people through aviation and STEM education programs.`,
      },
      {
        title: 'Funding Overview',
        type: 'metric',
        content: [
          { label: 'Total Raised', value: data.totalRaised, format: 'currency' },
          { label: 'Scholarships Awarded', value: data.scholarshipsAwarded, format: 'number' },
          { label: 'Programs Funded', value: data.programsFunded, format: 'number' },
        ],
      },
    ],
  }),
};

/**
 * Open report in new window for printing/saving as PDF
 */
export function openReportWindow(config: ReportConfig): void {
  const html = generateReportHTML(config);
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(html);
    newWindow.document.close();
  }
}
