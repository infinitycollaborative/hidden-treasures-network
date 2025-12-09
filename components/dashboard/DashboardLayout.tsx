'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { UserRole } from '@/types/phase1';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
}

/**
 * DashboardLayout Component
 * Main layout wrapper for all dashboard pages
 */
export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
