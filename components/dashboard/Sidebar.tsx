'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  User,
  BookOpen,
  Users,
  Calendar,
  Award,
  Settings,
  LogOut,
  X,
  Plane,
  DollarSign,
  Building,
  GraduationCap,
  BarChart3,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/phase1';

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

// Navigation items by role
const navigationByRole: Record<UserRole, Array<{ name: string; href: string; icon: any }>> = {
  student: [
    { name: 'Dashboard', href: '/dashboard/student', icon: Home },
    { name: 'Profile', href: '/dashboard/student/profile', icon: User },
    { name: 'Programs', href: '/dashboard/student/programs', icon: BookOpen },
    { name: 'Mentorship', href: '/dashboard/student/mentorship', icon: Users },
    { name: 'Progress', href: '/dashboard/student/progress', icon: Award },
    { name: 'Scholarships', href: '/dashboard/student/scholarships', icon: DollarSign },
  ],
  mentor: [
    { name: 'Dashboard', href: '/dashboard/mentor', icon: Home },
    { name: 'Profile', href: '/dashboard/mentor/profile', icon: User },
    { name: 'My Students', href: '/dashboard/mentor/students', icon: Users },
    { name: 'Sessions', href: '/dashboard/mentor/sessions', icon: Calendar },
    { name: 'Resources', href: '/dashboard/mentor/resources', icon: BookOpen },
  ],
  organization: [
    { name: 'Dashboard', href: '/dashboard/organization', icon: Home },
    { name: 'Profile', href: '/dashboard/organization/profile', icon: Building },
    { name: 'Programs', href: '/dashboard/organization/programs', icon: BookOpen },
    { name: 'Students', href: '/dashboard/organization/students', icon: Users },
    { name: 'Staff', href: '/dashboard/organization/staff', icon: Users },
    { name: 'Reports', href: '/dashboard/organization/reports', icon: BarChart3 },
  ],
  sponsor: [
    { name: 'Dashboard', href: '/dashboard/sponsor', icon: Home },
    { name: 'Profile', href: '/dashboard/sponsor/profile', icon: User },
    { name: 'Opportunities', href: '/dashboard/sponsor/opportunities', icon: BookOpen },
    { name: 'Impact', href: '/dashboard/sponsor/impact', icon: Award },
    { name: 'Donations', href: '/dashboard/sponsor/donations', icon: DollarSign },
  ],
  teacher: [
    { name: 'Dashboard', href: '/dashboard/teacher', icon: Home },
    { name: 'Classrooms', href: '/dashboard/teacher/classrooms', icon: Users },
    { name: 'Students', href: '/dashboard/teacher/students', icon: GraduationCap },
    { name: 'Curriculum', href: '/dashboard/teacher/curriculum', icon: BookOpen },
    { name: 'Reports', href: '/dashboard/teacher/reports', icon: FileText },
  ],
  school_admin: [
    { name: 'Dashboard', href: '/dashboard/school-admin', icon: Home },
    { name: 'Teachers', href: '/dashboard/school-admin/teachers', icon: Users },
    { name: 'Students', href: '/dashboard/school-admin/students', icon: GraduationCap },
    { name: 'Reports', href: '/dashboard/school-admin/reports', icon: BarChart3 },
  ],
  district_admin: [
    { name: 'Dashboard', href: '/dashboard/district-admin', icon: Home },
    { name: 'Schools', href: '/dashboard/district-admin/schools', icon: Building },
    { name: 'Reports', href: '/dashboard/district-admin/reports', icon: BarChart3 },
    { name: 'Compliance', href: '/dashboard/district-admin/compliance', icon: FileText },
  ],
  platform_admin: [
    { name: 'Dashboard', href: '/dashboard/admin', icon: Home },
    { name: 'Users', href: '/dashboard/admin/users', icon: Users },
    { name: 'Organizations', href: '/dashboard/admin/organizations', icon: Building },
    { name: 'Programs', href: '/dashboard/admin/programs', icon: BookOpen },
    { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
  ],
};

export default function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navigation = navigationByRole[role] || [];

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo & Close Button */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <Plane className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">HTN</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all',
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
                onClick={onClose}
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 px-4 py-4 space-y-1 flex-shrink-0">
          <Link
            href="/dashboard/settings"
            className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all"
            onClick={onClose}
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
