'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Trophy, Clock, Target, BookOpen, Users, Calendar, Award } from 'lucide-react';
import Link from 'next/link';
import { StudentProfile } from '@/types/phase1';

export default function StudentDashboard() {
  const { user, userProfile } = useAuth();
  const [studentData, setStudentData] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user) return;

      try {
        const studentDoc = await getDoc(doc(db, 'students', user.uid));
        if (studentDoc.exists()) {
          setStudentData(studentDoc.data() as StudentProfile);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <DashboardLayout role="student">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {studentData?.firstName || userProfile?.displayName}!
            </h1>
            <p className="text-gray-600 mt-2">Here's your progress overview</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total XP"
              value={studentData?.progress?.totalXP || 0}
              icon={<Trophy className="w-6 h-6" />}
              color="blue"
              loading={loading}
            />
            <StatsCard
              title="Flight Hours"
              value={studentData?.progress?.flightHours || 0}
              icon={<Plane className="w-6 h-6" />}
              color="green"
              loading={loading}
            />
            <StatsCard
              title="Simulator Hours"
              value={studentData?.progress?.simulatorHours || 0}
              icon={<Clock className="w-6 h-6" />}
              color="purple"
              loading={loading}
            />
            <StatsCard
              title="Badges Earned"
              value={studentData?.progress?.badges?.length || 0}
              icon={<Target className="w-6 h-6" />}
              color="orange"
              loading={loading}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* My Programs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  My Programs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : studentData?.programs && studentData.programs.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Enrolled in {studentData.programs.length} program(s)
                    </p>
                    <Link href="/dashboard/student/programs">
                      <Button variant="outline" className="mt-4">View All Programs</Button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-4">You're not enrolled in any programs yet.</p>
                    <Link href="/programs">
                      <Button className="bg-blue-600 hover:bg-blue-700">Browse Programs</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mentorship */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  My Mentor
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : studentData?.mentorId ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">You have a mentor assigned!</p>
                    <Link href="/dashboard/student/mentorship">
                      <Button variant="outline">View Mentor</Button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-4">You don't have a mentor yet.</p>
                    <Link href="/dashboard/student/mentorship">
                      <Button className="bg-green-600 hover:bg-green-700">Find a Mentor</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">Your recent activities will appear here.</p>
                <div className="mt-4 space-y-2">
                  <div className="text-xs text-gray-500">No recent activity</div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-600" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ) : studentData?.progress?.badges && studentData.progress.badges.length > 0 ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      You've earned {studentData.progress.badges.length} badge(s)!
                    </p>
                    <Link href="/dashboard/student/progress">
                      <Button variant="outline">View Progress</Button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 text-sm mb-4">
                      Complete activities to earn badges and track your progress!
                    </p>
                    <Link href="/dashboard/student/progress">
                      <Button variant="outline">View Progress</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Certifications & Next Steps */}
          {studentData?.progress?.certifications && studentData.progress.certifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {studentData.progress.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
