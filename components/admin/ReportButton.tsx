'use client';

import { useState } from 'react';
import { FileText, ChevronDown, Loader2, BarChart3, Target, Heart } from 'lucide-react';

export type ReportType = 'executive' | 'flightplan' | 'donor';

interface ReportButtonProps {
  className?: string;
}

const reportOptions: { value: ReportType; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'executive',
    label: 'Executive Summary',
    description: 'Key metrics and performance overview',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    value: 'flightplan',
    label: 'Flight Plan 2030',
    description: 'Progress toward 1M lives goal',
    icon: <Target className="w-5 h-5" />,
  },
  {
    value: 'donor',
    label: 'Donor Impact',
    description: 'Funding and impact report',
    icon: <Heart className="w-5 h-5" />,
  },
];

export function ReportButton({ className = '' }: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async (reportType: ReportType) => {
    setIsGenerating(true);
    setIsOpen(false);

    try {
      // Open report in new window
      const reportUrl = `/api/reports/generate?type=${reportType}`;
      window.open(reportUrl, '_blank');
    } catch (error: any) {
      console.error('Report generation error:', error);
      alert(`Report generation failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isGenerating}
        className="inline-flex items-center gap-2 px-4 py-2 bg-aviation-gold text-aviation-navy font-semibold rounded-lg hover:bg-aviation-gold/90 transition-colors disabled:opacity-50"
      >
        {isGenerating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        <span>Generate Report</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
            <div className="p-2">
              <p className="text-xs font-medium text-gray-500 uppercase px-3 py-2">Select Report Type</p>
              {reportOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleGenerateReport(option.value)}
                  className="w-full flex items-start gap-3 px-3 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-aviation-navy mt-0.5">
                    {option.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.description}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
              <p className="text-xs text-gray-500">
                Reports open in a new tab. Use your browser's print function to save as PDF.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Quick report link component
 */
interface QuickReportLinkProps {
  reportType: ReportType;
  label?: string;
  className?: string;
}

export function QuickReportLink({ reportType, label, className = '' }: QuickReportLinkProps) {
  const option = reportOptions.find(o => o.value === reportType);

  const handleClick = () => {
    window.open(`/api/reports/generate?type=${reportType}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-aviation-navy hover:text-aviation-gold transition-colors ${className}`}
    >
      {option?.icon || <FileText className="w-4 h-4" />}
      <span>{label || option?.label || 'View Report'}</span>
    </button>
  );
}
