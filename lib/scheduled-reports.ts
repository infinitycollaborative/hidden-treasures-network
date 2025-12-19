/**
 * Scheduled Reports Configuration
 * Types and utilities for email report scheduling
 */

export type ReportFrequency = 'daily' | 'weekly' | 'monthly';
export type ReportType = 'executive' | 'flightplan' | 'donor' | 'analytics' | 'custom';

export interface ScheduledReport {
  id?: string;
  name: string;
  description?: string;
  reportType: ReportType;
  frequency: ReportFrequency;
  recipients: string[];
  enabled: boolean;
  lastSent?: Date;
  nextScheduled?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  options?: {
    includeCharts?: boolean;
    includeTables?: boolean;
    customSections?: string[];
    dateRange?: 'last7days' | 'last30days' | 'lastMonth' | 'lastQuarter' | 'custom';
  };
}

export interface ReportDelivery {
  id?: string;
  scheduledReportId: string;
  sentAt: Date;
  recipients: string[];
  status: 'sent' | 'failed' | 'partial';
  errorMessage?: string;
  reportSnapshot?: string; // URL or reference to stored report
}

/**
 * Get human-readable frequency label
 */
export function getFrequencyLabel(frequency: ReportFrequency): string {
  switch (frequency) {
    case 'daily': return 'Daily';
    case 'weekly': return 'Weekly (Mondays)';
    case 'monthly': return 'Monthly (1st of month)';
    default: return frequency;
  }
}

/**
 * Get next scheduled date based on frequency
 */
export function getNextScheduledDate(frequency: ReportFrequency, fromDate?: Date): Date {
  const now = fromDate || new Date();
  const next = new Date(now);

  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      next.setHours(6, 0, 0, 0); // 6 AM
      break;
    case 'weekly':
      // Next Monday
      const daysUntilMonday = (8 - next.getDay()) % 7 || 7;
      next.setDate(next.getDate() + daysUntilMonday);
      next.setHours(6, 0, 0, 0);
      break;
    case 'monthly':
      // 1st of next month
      next.setMonth(next.getMonth() + 1);
      next.setDate(1);
      next.setHours(6, 0, 0, 0);
      break;
  }

  return next;
}

/**
 * Validate email addresses
 */
export function validateEmails(emails: string[]): { valid: string[]; invalid: string[] } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const email of emails) {
    const trimmed = email.trim().toLowerCase();
    if (emailRegex.test(trimmed)) {
      valid.push(trimmed);
    } else {
      invalid.push(email);
    }
  }

  return { valid, invalid };
}

/**
 * Report type configurations
 */
export const reportTypeConfig: Record<ReportType, { label: string; description: string }> = {
  executive: {
    label: 'Executive Summary',
    description: 'High-level overview of key metrics and KPIs',
  },
  flightplan: {
    label: 'Flight Plan 2030',
    description: 'Progress toward the 1 million lives goal',
  },
  donor: {
    label: 'Donor Impact',
    description: 'Donation activity and impact metrics',
  },
  analytics: {
    label: 'Full Analytics',
    description: 'Comprehensive analytics snapshot',
  },
  custom: {
    label: 'Custom Report',
    description: 'Customized report with selected sections',
  },
};
