import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { AuthNavigator } from './AuthNavigator';
import { StudentNavigator } from './StudentNavigator';
import { Loading } from '../components/Loading';

export function AppNavigator() {
  const { isAuthenticated, loading, profile } = useAuth();

  if (loading) {
    return <Loading message="Loading..." />;
  }

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    );
  }

  // Role-based navigation
  const getRoleNavigator = () => {
    switch (profile?.role) {
      case 'student':
        return <StudentNavigator />;
      case 'mentor':
        return <StudentNavigator />; // Reuse for now
      case 'organization':
        return <StudentNavigator />; // Reuse for now
      default:
        return <StudentNavigator />;
    }
  };

  return (
    <NavigationContainer>
      {getRoleNavigator()}
    </NavigationContainer>
  );
}
