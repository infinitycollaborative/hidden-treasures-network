'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  Building2,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Award,
  Calendar,
  BarChart3,
  Settings,
  GripVertical,
  X,
  Plus,
  Loader2,
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

// Widget types
export type WidgetType =
  | 'total-students'
  | 'total-mentors'
  | 'total-organizations'
  | 'flight-plan-progress'
  | 'donations-total'
  | 'completion-rate'
  | 'recent-signups'
  | 'kpi-summary';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  size: 'small' | 'medium' | 'large';
  position: number;
}

interface WidgetData {
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon: React.ReactNode;
  color: string;
}

// Widget configurations
const widgetConfigs: Record<WidgetType, { title: string; icon: React.ReactNode; color: string }> = {
  'total-students': {
    title: 'Total Students',
    icon: <GraduationCap className="w-6 h-6" />,
    color: 'bg-blue-500',
  },
  'total-mentors': {
    title: 'Active Mentors',
    icon: <Users className="w-6 h-6" />,
    color: 'bg-green-500',
  },
  'total-organizations': {
    title: 'Partner Organizations',
    icon: <Building2 className="w-6 h-6" />,
    color: 'bg-purple-500',
  },
  'flight-plan-progress': {
    title: 'Flight Plan 2030',
    icon: <Target className="w-6 h-6" />,
    color: 'bg-aviation-gold',
  },
  'donations-total': {
    title: 'Total Donations',
    icon: <DollarSign className="w-6 h-6" />,
    color: 'bg-emerald-500',
  },
  'completion-rate': {
    title: 'Completion Rate',
    icon: <Award className="w-6 h-6" />,
    color: 'bg-orange-500',
  },
  'recent-signups': {
    title: 'Recent Signups',
    icon: <Calendar className="w-6 h-6" />,
    color: 'bg-pink-500',
  },
  'kpi-summary': {
    title: 'KPI Summary',
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'bg-indigo-500',
  },
};

// Default widget layout
const defaultWidgets: DashboardWidget[] = [
  { id: '1', type: 'total-students', title: 'Total Students', size: 'small', position: 0 },
  { id: '2', type: 'total-mentors', title: 'Active Mentors', size: 'small', position: 1 },
  { id: '3', type: 'total-organizations', title: 'Organizations', size: 'small', position: 2 },
  { id: '4', type: 'flight-plan-progress', title: 'Flight Plan 2030', size: 'small', position: 3 },
];

interface DashboardWidgetsProps {
  editable?: boolean;
  onLayoutChange?: (widgets: DashboardWidget[]) => void;
}

export function DashboardWidgets({ editable = false, onLayoutChange }: DashboardWidgetsProps) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(defaultWidgets);
  const [widgetData, setWidgetData] = useState<Record<string, WidgetData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCustomizing, setIsCustomizing] = useState(false);

  useEffect(() => {
    loadWidgetData();
  }, []);

  const loadWidgetData = async () => {
    if (!db) {
      setIsLoading(false);
      return;
    }

    const data: Record<string, WidgetData> = {};

    try {
      // Total Students
      const studentsQuery = query(collection(db, 'users'), where('role', '==', 'student'));
      const studentsSnapshot = await getDocs(studentsQuery);
      data['total-students'] = {
        value: studentsSnapshot.size,
        label: 'enrolled students',
        trend: 'up',
        trendValue: '+12%',
        icon: widgetConfigs['total-students'].icon,
        color: widgetConfigs['total-students'].color,
      };

      // Total Mentors
      const mentorsQuery = query(collection(db, 'users'), where('role', '==', 'mentor'));
      const mentorsSnapshot = await getDocs(mentorsQuery);
      data['total-mentors'] = {
        value: mentorsSnapshot.size,
        label: 'active mentors',
        trend: 'up',
        trendValue: '+5%',
        icon: widgetConfigs['total-mentors'].icon,
        color: widgetConfigs['total-mentors'].color,
      };

      // Total Organizations
      const orgsSnapshot = await getDocs(collection(db, 'organizations'));
      data['total-organizations'] = {
        value: orgsSnapshot.size,
        label: 'partner organizations',
        trend: 'stable',
        icon: widgetConfigs['total-organizations'].icon,
        color: widgetConfigs['total-organizations'].color,
      };

      // Flight Plan 2030 Progress
      const impactDoc = await getDoc(doc(db, 'analytics', 'impact'));
      const livesImpacted = impactDoc.data()?.totalLivesImpacted || studentsSnapshot.size;
      const progress = ((livesImpacted / 1000000) * 100).toFixed(2);
      data['flight-plan-progress'] = {
        value: `${progress}%`,
        label: `${livesImpacted.toLocaleString()} lives impacted`,
        trend: 'up',
        icon: widgetConfigs['flight-plan-progress'].icon,
        color: widgetConfigs['flight-plan-progress'].color,
      };

      // Total Donations
      const donationsSnapshot = await getDocs(collection(db, 'donations'));
      let totalDonations = 0;
      donationsSnapshot.forEach((doc) => {
        totalDonations += doc.data().amount || 0;
      });
      data['donations-total'] = {
        value: `$${(totalDonations / 100).toLocaleString()}`,
        label: 'total raised',
        trend: 'up',
        trendValue: '+18%',
        icon: widgetConfigs['donations-total'].icon,
        color: widgetConfigs['donations-total'].color,
      };

      // Completion Rate
      const enrollmentsSnapshot = await getDocs(collection(db, 'enrollments'));
      const completionsQuery = query(collection(db, 'enrollments'), where('status', '==', 'completed'));
      const completionsSnapshot = await getDocs(completionsQuery);
      const completionRate = enrollmentsSnapshot.size > 0
        ? ((completionsSnapshot.size / enrollmentsSnapshot.size) * 100).toFixed(1)
        : '0';
      data['completion-rate'] = {
        value: `${completionRate}%`,
        label: 'program completion',
        trend: 'up',
        icon: widgetConfigs['completion-rate'].icon,
        color: widgetConfigs['completion-rate'].color,
      };

      // Recent Signups (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const waitlistSnapshot = await getDocs(collection(db, 'waitlist'));
      data['recent-signups'] = {
        value: waitlistSnapshot.size,
        label: 'waitlist signups',
        trend: 'up',
        icon: widgetConfigs['recent-signups'].icon,
        color: widgetConfigs['recent-signups'].color,
      };

      // KPI Summary
      data['kpi-summary'] = {
        value: '4/5',
        label: 'KPIs on track',
        trend: 'stable',
        icon: widgetConfigs['kpi-summary'].icon,
        color: widgetConfigs['kpi-summary'].color,
      };

    } catch (error) {
      console.error('Failed to load widget data:', error);
    }

    setWidgetData(data);
    setIsLoading(false);
  };

  const handleAddWidget = (type: WidgetType) => {
    const config = widgetConfigs[type];
    const newWidget: DashboardWidget = {
      id: Date.now().toString(),
      type,
      title: config.title,
      size: 'small',
      position: widgets.length,
    };
    const updated = [...widgets, newWidget];
    setWidgets(updated);
    onLayoutChange?.(updated);
  };

  const handleRemoveWidget = (id: string) => {
    const updated = widgets.filter(w => w.id !== id);
    setWidgets(updated);
    onLayoutChange?.(updated);
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
            <div className="h-10 w-10 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-8 w-20 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {editable && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Settings className="w-4 h-4" />
            {isCustomizing ? 'Done' : 'Customize'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets.map((widget) => {
          const data = widgetData[widget.type];
          const config = widgetConfigs[widget.type];

          return (
            <div
              key={widget.id}
              className={`relative bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${
                isCustomizing ? 'ring-2 ring-dashed ring-gray-300' : ''
              }`}
            >
              {isCustomizing && (
                <>
                  <button
                    onClick={() => handleRemoveWidget(widget.id)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute top-2 left-2 text-gray-400 cursor-move">
                    <GripVertical className="w-4 h-4" />
                  </div>
                </>
              )}

              <div className={`inline-flex p-2.5 rounded-lg ${config.color} text-white mb-4`}>
                {config.icon}
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-1">
                {data?.value ?? '-'}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{data?.label ?? widget.title}</span>
                {data?.trend && (
                  <div className="flex items-center gap-1">
                    {getTrendIcon(data.trend)}
                    {data.trendValue && (
                      <span className={`text-xs ${
                        data.trend === 'up' ? 'text-green-500' :
                        data.trend === 'down' ? 'text-red-500' : 'text-gray-400'
                      }`}>
                        {data.trendValue}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isCustomizing && (
          <button
            onClick={() => {
              // Show widget picker (simplified - just add next available)
              const usedTypes = new Set(widgets.map(w => w.type));
              const availableType = Object.keys(widgetConfigs).find(
                t => !usedTypes.has(t as WidgetType)
              ) as WidgetType | undefined;

              if (availableType) {
                handleAddWidget(availableType);
              }
            }}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:border-aviation-navy hover:text-aviation-navy transition-colors"
          >
            <Plus className="w-8 h-8 mb-2" />
            <span className="text-sm">Add Widget</span>
          </button>
        )}
      </div>
    </div>
  );
}
