import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/Card';
import { Colors, Typography, Spacing } from '../../constants/theme';

export function StudentDashboardScreen() {
  const { profile } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome back, {profile?.firstName || profile?.displayName}!
        </Text>
        <Text style={styles.subtitle}>Continue your journey</Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>My Progress</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Resources</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>My Mentor</Text>
        <View style={styles.mentorInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View style={styles.mentorDetails}>
            <Text style={styles.mentorName}>John Doe</Text>
            <Text style={styles.mentorSpecialty}>Commercial Pilot</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Upcoming Sessions</Text>
        <View style={styles.sessionItem}>
          <Text style={styles.sessionTitle}>Flight Planning Basics</Text>
          <Text style={styles.sessionDate}>Tomorrow at 3:00 PM</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Recommended Resources</Text>
        <View style={styles.resourceItem}>
          <Text style={styles.resourceTitle}>Introduction to Aviation</Text>
          <Text style={styles.resourceType}>Video • 15 min</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  greeting: {
    ...Typography.h2,
    color: Colors.primary,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  card: {
    marginBottom: Spacing.md,
  },
  cardTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...Typography.h2,
    color: Colors.primary,
  },
  statLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  mentorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    ...Typography.h3,
    color: Colors.white,
  },
  mentorDetails: {
    flex: 1,
  },
  mentorName: {
    ...Typography.h4,
    color: Colors.textPrimary,
  },
  mentorSpecialty: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  sessionItem: {
    paddingVertical: Spacing.sm,
  },
  sessionTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  sessionDate: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  resourceItem: {
    paddingVertical: Spacing.sm,
  },
  resourceTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  resourceType: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
