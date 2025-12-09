'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/phase1';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireOnboarding?: boolean;
}

/**
 * ProtectedRoute Component
 * Wraps pages that require authentication and optional role-based access
 */
export default function ProtectedRoute({
  children,
  allowedRoles,
  requireOnboarding = false,
}: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If no user, redirect to login
      if (!user) {
        router.push('/login');
        return;
      }

      // If user profile doesn't exist, something went wrong
      if (!userProfile) {
        console.error('User authenticated but profile not found');
        router.push('/login');
        return;
      }

      // Check if onboarding is required but not completed
      if (requireOnboarding && !userProfile.onboardingCompleted) {
        router.push(`/onboarding/${userProfile.role}`);
        return;
      }

      // Check role-based access
      if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [user, userProfile, loading, allowedRoles, requireOnboarding, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if conditions aren't met
  if (!user || !userProfile) {
    return null;
  }

  if (requireOnboarding && !userProfile.onboardingCompleted) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    return null;
  }

  // All checks passed, render children
  return <>{children}</>;
}
