'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Mail,
  Plus,
  Trash2,
  Edit2,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Send
} from 'lucide-react';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import {
  ScheduledReport,
  ReportFrequency,
  ReportType,
  getFrequencyLabel,
  getNextScheduledDate,
  validateEmails,
  reportTypeConfig,
} from '@/lib/scheduled-reports';

interface ScheduledReportsManagerProps {
  userId: string;
}

export function ScheduledReportsManager({ userId }: ScheduledReportsManagerProps) {
  const [reports, setReports] = useState<ScheduledReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<ScheduledReport | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    if (!db) return;

    try {
      const q = query(collection(db, 'scheduledReports'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const loadedReports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        lastSent: doc.data().lastSent?.toDate(),
        nextScheduled: doc.data().nextScheduled?.toDate(),
      })) as ScheduledReport[];
      setReports(loadedReports);
    } catch (error) {
      console.error('Failed to load scheduled reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this scheduled report?')) return;
    if (!db) return;

    try {
      await deleteDoc(doc(db, 'scheduledReports', reportId));
      setReports(reports.filter(r => r.id !== reportId));
    } catch (error) {
      console.error('Failed to delete report:', error);
      alert('Failed to delete report');
    }
  };

  const handleToggleEnabled = async (report: ScheduledReport) => {
    if (!db || !report.id) return;

    try {
      await updateDoc(doc(db, 'scheduledReports', report.id), {
        enabled: !report.enabled,
        updatedAt: serverTimestamp(),
      });
      setReports(reports.map(r =>
        r.id === report.id ? { ...r, enabled: !r.enabled } : r
      ));
    } catch (error) {
      console.error('Failed to toggle report:', error);
    }
  };

  const handleEdit = (report: ScheduledReport) => {
    setEditingReport(report);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingReport(null);
    setIsModalOpen(true);
  };

  const handleSave = async (reportData: Partial<ScheduledReport>) => {
    if (!db) return;

    try {
      if (editingReport?.id) {
        // Update existing
        await updateDoc(doc(db, 'scheduledReports', editingReport.id), {
          ...reportData,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Create new
        await addDoc(collection(db, 'scheduledReports'), {
          ...reportData,
          createdBy: userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          nextScheduled: getNextScheduledDate(reportData.frequency as ReportFrequency),
        });
      }
      setIsModalOpen(false);
      loadReports();
    } catch (error) {
      console.error('Failed to save report:', error);
      alert('Failed to save report');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-aviation-navy" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Scheduled Reports</h2>
          <p className="text-sm text-gray-500">Automate report delivery to your inbox</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-aviation-navy text-white rounded-lg hover:bg-aviation-navy/90"
        >
          <Plus className="w-4 h-4" />
          New Schedule
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Scheduled Reports</h3>
          <p className="text-gray-500 mb-4">Set up automated report delivery to stay informed.</p>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-aviation-gold text-aviation-navy rounded-lg hover:bg-aviation-gold/90"
          >
            <Plus className="w-4 h-4" />
            Create Your First Schedule
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className={`bg-white border rounded-lg p-4 ${
                report.enabled ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{report.name}</h3>
                    {report.enabled ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" />
                        Paused
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {reportTypeConfig[report.reportType]?.label || report.reportType}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleEnabled(report)}
                    className={`p-2 rounded-lg transition-colors ${
                      report.enabled
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={report.enabled ? 'Pause' : 'Enable'}
                  >
                    {report.enabled ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => handleEdit(report)}
                    className="p-2 text-gray-400 hover:text-aviation-navy hover:bg-gray-100 rounded-lg"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => report.id && handleDelete(report.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {getFrequencyLabel(report.frequency)}
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}
                </div>
                {report.nextScheduled && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Next: {report.nextScheduled.toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ReportScheduleModal
          report={editingReport}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

interface ReportScheduleModalProps {
  report: ScheduledReport | null;
  onSave: (data: Partial<ScheduledReport>) => void;
  onClose: () => void;
}

function ReportScheduleModal({ report, onSave, onClose }: ReportScheduleModalProps) {
  const [name, setName] = useState(report?.name || '');
  const [reportType, setReportType] = useState<ReportType>(report?.reportType || 'executive');
  const [frequency, setFrequency] = useState<ReportFrequency>(report?.frequency || 'weekly');
  const [recipientsText, setRecipientsText] = useState(report?.recipients.join(', ') || '');
  const [enabled, setEnabled] = useState(report?.enabled ?? true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    const emails = recipientsText.split(',').map(e => e.trim()).filter(Boolean);
    const { valid, invalid } = validateEmails(emails);

    if (invalid.length > 0) {
      setError(`Invalid emails: ${invalid.join(', ')}`);
      return;
    }

    if (valid.length === 0) {
      setError('At least one recipient is required');
      return;
    }

    onSave({
      name: name.trim(),
      reportType,
      frequency,
      recipients: valid,
      enabled,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {report ? 'Edit Schedule' : 'New Scheduled Report'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Schedule Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Weekly Executive Summary"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-navy focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-navy focus:border-transparent"
            >
              {Object.entries(reportTypeConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as ReportFrequency)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-navy focus:border-transparent"
            >
              <option value="daily">Daily (6 AM)</option>
              <option value="weekly">Weekly (Mondays at 6 AM)</option>
              <option value="monthly">Monthly (1st of month at 6 AM)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipients
            </label>
            <textarea
              value={recipientsText}
              onChange={(e) => setRecipientsText(e.target.value)}
              placeholder="Enter email addresses, separated by commas"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-navy focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple emails with commas
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enabled"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4 h-4 text-aviation-navy rounded"
            />
            <label htmlFor="enabled" className="text-sm text-gray-700">
              Enable this schedule immediately
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-aviation-navy text-white rounded-lg hover:bg-aviation-navy/90"
            >
              {report ? 'Save Changes' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
