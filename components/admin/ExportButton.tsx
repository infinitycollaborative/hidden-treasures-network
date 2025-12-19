'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, FileJson, ChevronDown, Loader2 } from 'lucide-react';

export type ExportFormat = 'csv' | 'excel' | 'json';
export type ExportDataType = 'students' | 'mentors' | 'organizations' | 'donations' | 'waitlist' | 'analytics';

interface ExportButtonProps {
  dataType: ExportDataType;
  label?: string;
  className?: string;
  maxRows?: number;
}

const formatOptions: { value: ExportFormat; label: string; icon: React.ReactNode }[] = [
  { value: 'csv', label: 'CSV', icon: <FileText className="w-4 h-4" /> },
  { value: 'excel', label: 'Excel', icon: <FileSpreadsheet className="w-4 h-4" /> },
  { value: 'json', label: 'JSON', icon: <FileJson className="w-4 h-4" /> },
];

export function ExportButton({ dataType, label, className = '', maxRows = 1000 }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    setSelectedFormat(format);
    setIsOpen(false);

    try {
      const response = await fetch(`/api/export?type=${dataType}&format=${format}&limit=${maxRows}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Export failed');
      }

      // Get filename from Content-Disposition header or generate one
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${dataType}_export.${format === 'excel' ? 'xls' : format}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }

      // Download the file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Export error:', error);
      alert(`Export failed: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="inline-flex items-center gap-2 px-4 py-2 bg-aviation-navy text-white rounded-lg hover:bg-aviation-navy/90 transition-colors disabled:opacity-50"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>{label || 'Export'}</span>
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
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
            {formatOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleExport(option.value)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Quick export button (no dropdown, single format)
 */
interface QuickExportButtonProps {
  dataType: ExportDataType;
  format?: ExportFormat;
  label?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function QuickExportButton({
  dataType,
  format = 'csv',
  label,
  className = '',
  variant = 'secondary',
}: QuickExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const response = await fetch(`/api/export?type=${dataType}&format=${format}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Export failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${dataType}_export.${format === 'excel' ? 'xls' : format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Export error:', error);
      alert(`Export failed: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const variantStyles = {
    primary: 'bg-aviation-navy text-white hover:bg-aviation-navy/90',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  };

  const formatIcon = {
    csv: <FileText className="w-4 h-4" />,
    excel: <FileSpreadsheet className="w-4 h-4" />,
    json: <FileJson className="w-4 h-4" />,
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${variantStyles[variant]} ${className}`}
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        formatIcon[format]
      )}
      <span>{label || `Export ${format.toUpperCase()}`}</span>
    </button>
  );
}
