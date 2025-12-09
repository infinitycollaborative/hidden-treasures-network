# PHASES 17 & 18: MOBILE APP + COMMUNICATION HUB
## Hidden Treasures Network - Complete Implementation Guide

---

## 📋 OVERVIEW

**Phase 17** delivers a cross-platform mobile application (iOS + Android) that brings the Hidden Treasures Network experience to students, mentors, and teachers anywhere, anytime - even offline.

**Phase 18** delivers a comprehensive communication hub enabling real-time messaging, automated emails, SMS notifications, video conferencing, and platform-wide announcements.

### **Why Combined?**
These phases are integrated because the mobile app (Phase 17) depends on the communication infrastructure (Phase 18) for push notifications, in-app messaging, and real-time updates.

---

## 🎯 PHASE 17: MOBILE APP (REACT NATIVE)

### **Key Deliverables**
- ✅ Cross-platform app (iOS + Android) using React Native + Expo
- ✅ Offline-first architecture with automatic sync
- ✅ Push notifications via Firebase Cloud Messaging
- ✅ Student dashboard (XP, badges, flight hours, progress)
- ✅ Mentor dashboard (student list, session logging)
- ✅ Teacher dashboard (attendance, class management)
- ✅ QR code scanner for event check-ins
- ✅ Camera integration for assignment submissions
- ✅ Pull-to-refresh for data updates

### **Timeline**: 6-8 weeks
### **Dependencies**: Phase 18 (for push notifications and messaging)

### **Success Metrics**
- [ ] App runs on both iOS and Android
- [ ] Offline mode works (data persists locally)
- [ ] Push notifications deliver within 30 seconds
- [ ] QR code scanner reads codes instantly
- [ ] App loads in <3 seconds on 4G connection
- [ ] 4+ star rating on app stores
- [ ] No crashes (crash-free rate >99%)

---

## 💬 PHASE 18: COMMUNICATION HUB

### **Key Deliverables**
- ✅ Real-time in-app messaging (student ↔ mentor, teacher ↔ parent)
- ✅ Email automation with templates (SendGrid)
- ✅ SMS notifications (Twilio)
- ✅ Video conferencing integration (Zoom API)
- ✅ Platform-wide announcement system
- ✅ Multi-channel delivery (app, email, SMS, push)
- ✅ Read receipts and conversation threading
- ✅ Scheduled message delivery

### **Timeline**: 3-4 weeks
### **Dependencies**: Phases 13-15 (user data, programs, sessions)

### **Success Metrics**
- [ ] Messages send in real-time (<1 second latency)
- [ ] Emails have >40% open rate
- [ ] SMS deliver in <30 seconds
- [ ] Video sessions schedule successfully
- [ ] Announcements reach 95%+ of targeted users
- [ ] Read receipts update in real-time

---

# 📱 PHASE 17: MOBILE APP IMPLEMENTATION

## 🗄️ SETUP & CONFIGURATION

### **Step 1: Initialize Expo Project**

```bash
# Install Expo CLI globally
npm install -g expo-cli

# Create new Expo project
npx create-expo-app hidden-treasures-mobile
cd hidden-treasures-mobile

# Install dependencies
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install firebase @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
npm install expo-notifications expo-camera expo-barcode-scanner
npm install @react-native-async-storage/async-storage
npm install react-native-chart-kit react-native-svg
npm install expo-image-picker expo-secure-store
```

### **Step 2: Configure Firebase for Mobile**

**File**: `app.json`

```json
{
  "expo": {
    "name": "Hidden Treasures Network",
    "slug": "hidden-treasures-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "org.hiddentreasures.mobile",
      "infoPlist": {
        "NSCameraUsageDescription": "This app uses the camera to scan QR codes and upload assignment photos.",
        "NSPhotoLibraryUsageDescription": "This app needs access to your photo library to upload images."
      },
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "org.hiddentreasures.mobile",
      "googleServicesFile": "./google-services.json",
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "NOTIFICATIONS"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ]
  }
}
```

### **Step 3: Firebase Configuration**

**File**: `src/config/firebase.ts`

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:ios:abcdef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore with offline persistence
const db = getFirestore(app);

// Enable offline persistence
try {
  enableIndexedDbPersistence(db);
} catch (err) {
  console.error('Firestore persistence error:', err);
}

const storage = getStorage(app);

export { auth, db, storage };
```

---

## 🎨 NAVIGATION STRUCTURE

**File**: `src/navigation/AppNavigator.tsx`

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import StudentDashboard from '../screens/student/StudentDashboard';
import StudentProgress from '../screens/student/StudentProgress';
import StudentBadges from '../screens/student/StudentBadges';
import MentorDashboard from '../screens/mentor/MentorDashboard';
import MentorStudents from '../screens/mentor/MentorStudents';
import MentorSessions from '../screens/mentor/MentorSessions';
import TeacherDashboard from '../screens/teacher/TeacherDashboard';
import TeacherAttendance from '../screens/teacher/TeacherAttendance';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import QRScannerScreen from '../screens/QRScannerScreen';

import { useAuth } from '../contexts/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Student Tab Navigator
function StudentTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Badges') {
            iconName = focused ? 'ribbon' : 'ribbon-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" component={StudentDashboard} />
      <Tab.Screen name="Progress" component={StudentProgress} />
      <Tab.Screen name="Badges" component={StudentBadges} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Mentor Tab Navigator
function MentorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Students') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Sessions') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" component={MentorDashboard} />
      <Tab.Screen name="Students" component={MentorStudents} />
      <Tab.Screen name="Sessions" component={MentorSessions} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Teacher Tab Navigator
function TeacherTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Attendance') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" component={TeacherDashboard} />
      <Tab.Screen name="Attendance" component={TeacherAttendance} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main App Navigator
export default function AppNavigator() {
  const { currentUser, userProfile } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            {userProfile?.role === 'student' && (
              <Stack.Screen name="StudentApp" component={StudentTabs} />
            )}
            {userProfile?.role === 'mentor' && (
              <Stack.Screen name="MentorApp" component={MentorTabs} />
            )}
            {userProfile?.role === 'teacher' && (
              <Stack.Screen name="TeacherApp" component={TeacherTabs} />
            )}
            <Stack.Screen
              name="QRScanner"
              component={QRScannerScreen}
              options={{ presentation: 'modal' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---

## 📊 STUDENT DASHBOARD

**File**: `src/screens/student/StudentDashboard.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { doc, getDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StudentData {
  firstName: string;
  lastName: string;
  xp: number;
  flightHours: number;
  currentRank: string;
  badges: any[];
  avatar?: string;
}

export default function StudentDashboard({ navigation }: any) {
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [recentBadges, setRecentBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadStudentData();
      setupRealtimeListeners();
    }
  }, [currentUser]);

  const loadStudentData = async () => {
    if (!currentUser) return;

    try {
      // Try to load from cache first (offline support)
      const cachedData = await AsyncStorage.getItem(`student_${currentUser.uid}`);
      if (cachedData) {
        setStudentData(JSON.parse(cachedData));
      }

      // Fetch fresh data from Firestore
      const studentDoc = await getDoc(doc(db, 'students', currentUser.uid));
      if (studentDoc.exists()) {
        const data = studentDoc.data() as StudentData;
        setStudentData(data);

        // Cache for offline access
        await AsyncStorage.setItem(`student_${currentUser.uid}`, JSON.stringify(data));

        // Load recent badges
        if (data.badges && data.badges.length > 0) {
          const recentBadgeIds = data.badges.slice(-3);
          const badgePromises = recentBadgeIds.map(badgeId =>
            getDoc(doc(db, 'badges', badgeId))
          );
          const badgeDocs = await Promise.all(badgePromises);
          const badges = badgeDocs
            .filter(doc => doc.exists())
            .map(doc => ({ id: doc.id, ...doc.data() }));
          setRecentBadges(badges);
        }
      }

      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error loading student data:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const setupRealtimeListeners = () => {
    if (!currentUser) return;

    // Listen for real-time updates to student document
    const unsubscribe = onSnapshot(
      doc(db, 'students', currentUser.uid),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as StudentData;
          setStudentData(data);
          AsyncStorage.setItem(`student_${currentUser.uid}`, JSON.stringify(data));
        }
      }
    );

    return () => unsubscribe();
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStudentData();
  };

  const getRankIcon = (rank: string) => {
    const icons: Record<string, string> = {
      cadet: 'ribbon-outline',
      pilot: 'airplane-outline',
      captain: 'star',
    };
    return icons[rank] || 'ribbon-outline';
  };

  const getRankColor = (rank: string) => {
    const colors: Record<string, string> = {
      cadet: '#3B82F6',
      pilot: '#10B981',
      captain: '#F59E0B',
    };
    return colors[rank] || '#3B82F6';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading your dashboard...</Text>
      </View>
    );
  }

  if (!studentData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No student data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{studentData.firstName}!</Text>
        </View>
        {studentData.avatar && (
          <Image source={{ uri: studentData.avatar }} style={styles.avatar} />
        )}
      </View>

      {/* Rank Card */}
      <View style={[styles.rankCard, { borderColor: getRankColor(studentData.currentRank) }]}>
        <View style={styles.rankHeader}>
          <Ionicons
            name={getRankIcon(studentData.currentRank) as any}
            size={40}
            color={getRankColor(studentData.currentRank)}
          />
          <View style={styles.rankInfo}>
            <Text style={styles.rankLabel}>Current Rank</Text>
            <Text style={[styles.rankValue, { color: getRankColor(studentData.currentRank) }]}>
              {studentData.currentRank.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {/* XP Card */}
        <View style={styles.statCard}>
          <Ionicons name="flash" size={32} color="#8B5CF6" />
          <Text style={styles.statValue}>{studentData.xp.toLocaleString()}</Text>
          <Text style={styles.statLabel}>XP Points</Text>
        </View>

        {/* Flight Hours Card */}
        <View style={styles.statCard}>
          <Ionicons name="time" size={32} color="#10B981" />
          <Text style={styles.statValue}>{studentData.flightHours.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Flight Hours</Text>
        </View>

        {/* Badges Card */}
        <View style={styles.statCard}>
          <Ionicons name="ribbon" size={32} color="#F59E0B" />
          <Text style={styles.statValue}>{studentData.badges?.length || 0}</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
      </View>

      {/* Recent Badges */}
      {recentBadges.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Badges</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Badges')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.badgesContainer}>
            {recentBadges.map((badge, index) => (
              <View key={index} style={styles.badgeCard}>
                <Text style={styles.badgeEmoji}>{badge.icon}</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('QRScanner')}
          >
            <Ionicons name="qr-code" size={32} color="#3B82F6" />
            <Text style={styles.actionLabel}>Scan QR Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Progress')}
          >
            <Ionicons name="trending-up" size={32} color="#10B981" />
            <Text style={styles.actionLabel}>View Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Messages')}
          >
            <Ionicons name="chatbubbles" size={32} color="#8B5CF6" />
            <Text style={styles.actionLabel}>Messages</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  rankCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankInfo: {
    marginLeft: 15,
  },
  rankLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  rankValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    color: '#3B82F6',
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeEmoji: {
    fontSize: 40,
  },
  badgeName: {
    fontSize: 12,
    color: '#111827',
    marginTop: 8,
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionLabel: {
    fontSize: 12,
    color: '#111827',
    marginTop: 8,
    textAlign: 'center',
  },
});
```

---

## 📷 QR CODE SCANNER

**File**: `src/screens/QRScannerScreen.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { doc, getDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function QRScannerScreen({ navigation }: any) {
  const { currentUser } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: any) => {
    setScanned(true);

    try {
      // Parse QR code data (format: "session:{sessionId}")
      const [qrType, qrId] = data.split(':');

      if (qrType === 'session') {
        // Check in to a session
        await checkInToSession(qrId);
      } else if (qrType === 'event') {
        // Check in to an event
        await checkInToEvent(qrId);
      } else {
        Alert.alert('Invalid QR Code', 'This QR code is not recognized.');
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      Alert.alert('Error', 'Failed to process QR code. Please try again.');
    }

    // Allow scanning again after 3 seconds
    setTimeout(() => setScanned(false), 3000);
  };

  const checkInToSession = async (sessionId: string) => {
    if (!currentUser) return;

    try {
      const sessionRef = doc(db, 'programSessions', sessionId);
      const sessionDoc = await getDoc(sessionRef);

      if (!sessionDoc.exists()) {
        Alert.alert('Error', 'Session not found.');
        return;
      }

      const session = sessionDoc.data();

      // Check if already checked in
      if (session.attendance?.includes(currentUser.uid)) {
        Alert.alert('Already Checked In', 'You have already checked in to this session.');
        return;
      }

      // Add student to attendance
      await updateDoc(sessionRef, {
        attendance: arrayUnion(currentUser.uid),
      });

      // Award XP for attendance (50 XP)
      const studentRef = doc(db, 'students', currentUser.uid);
      await updateDoc(studentRef, {
        xp: (await getDoc(studentRef)).data()?.xp + 50 || 50,
        lastActive: Timestamp.now(),
      });

      Alert.alert(
        'Checked In! 🎉',
        `You earned 50 XP for attending ${session.title}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error checking in:', error);
      Alert.alert('Error', 'Failed to check in. Please try again.');
    }
  };

  const checkInToEvent = async (eventId: string) => {
    if (!currentUser) return;

    try {
      const eventRef = doc(db, 'events', eventId);
      const eventDoc = await getDoc(eventRef);

      if (!eventDoc.exists()) {
        Alert.alert('Error', 'Event not found.');
        return;
      }

      const event = eventDoc.data();

      // Add student to attendees
      await updateDoc(eventRef, {
        attendees: arrayUnion(currentUser.uid),
      });

      // Award XP
      const studentRef = doc(db, 'students', currentUser.uid);
      await updateDoc(studentRef, {
        xp: (await getDoc(studentRef)).data()?.xp + (event.xpReward || 100) || 100,
        lastActive: Timestamp.now(),
      });

      Alert.alert(
        'Event Check-In! 🎉',
        `You earned ${event.xpReward || 100} XP for attending ${event.name}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error checking in to event:', error);
      Alert.alert('Error', 'Failed to check in. Please try again.');
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No access to camera</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.scanArea}>
          <View style={styles.scanFrame} />
          <Text style={styles.instructionText}>
            {scanned ? 'Processing...' : 'Scan QR code to check in'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 12,
  },
  instructionText: {
    marginTop: 30,
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

---

## 🔔 PUSH NOTIFICATIONS

**File**: `src/utils/notifications.ts`

```typescript
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications(userId: string): Promise<string | null> {
  try {
    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }

    // Get push token
    const token = (await Notifications.getExpoPushTokenAsync()).data;

    // Save token to user document
    await updateDoc(doc(db, 'users', userId), {
      pushToken: token,
      pushTokenUpdatedAt: new Date(),
    });

    // Configure channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3B82F6',
      });
    }

    return token;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
}

export async function schedulePushNotification(
  title: string,
  body: string,
  data?: any,
  trigger?: Notifications.NotificationTriggerInput
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: trigger || null,
  });
}

export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

export function addNotificationResponseReceivedListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}
```

---

# 💬 PHASE 18: COMMUNICATION HUB IMPLEMENTATION

## 🗄️ DATABASE SCHEMA

### **Collection 1: `conversations`**

```typescript
interface Conversation {
  conversationId: string;
  participants: string[];          // Array of user IDs
  participantDetails: {
    [userId: string]: {
      name: string;
      avatar?: string;
      role: string;
    };
  };
  type: 'direct' | 'group';
  lastMessage: {
    text: string;
    senderId: string;
    timestamp: Timestamp;
  };
  unreadCount: {
    [userId: string]: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Subcollection**: `/conversations/{conversationId}/messages`

```typescript
interface Message {
  messageId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  timestamp: Timestamp;
  readBy: string[];                // Array of user IDs who read this
  delivered: boolean;
}
```

---

### **Collection 2: `emailTemplates`**

```typescript
interface EmailTemplate {
  templateId: string;
  name: string;
  description: string;
  subject: string;
  htmlBody: string;
  plainTextBody: string;
  variables: string[];             // e.g., ['{{studentName}}', '{{xp}}']
  category: 'welcome' | 'notification' | 'report' | 'reminder';
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  sendGridTemplateId?: string;
}
```

---

### **Collection 3: `announcements`**

```typescript
interface Announcement {
  announcementId: string;
  title: string;
  message: string;
  createdBy: string;
  createdAt: Timestamp;

  // Targeting
  targetAudience: {
    roles?: string[];              // e.g., ['student', 'mentor']
    schoolIds?: string[];
    gradeLevel?: string[];
    allUsers?: boolean;
  };

  // Delivery Channels
  channels: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };

  // Status
  status: 'draft' | 'scheduled' | 'sent';
  scheduledFor?: Timestamp;
  sentAt?: Timestamp;

  // Metrics
  recipientCount: number;
  deliveredCount: number;
  readCount: number;
}
```

---

## 📧 EMAIL AUTOMATION (SENDGRID)

**File**: `functions/src/communication/emailService.ts`

```typescript
import * as functions from 'firebase-functions';
import * as sgMail from '@sendgrid/mail';

sgMail.setApiKey(functions.config().sendgrid.key);

export const sendEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { to, templateId, dynamicData } = data;

  try {
    const msg = {
      to,
      from: 'noreply@hiddentreasures.org',
      templateId,
      dynamicTemplateData: dynamicData,
    };

    await sgMail.send(msg);

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email');
  }
});

export const sendBulkEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { recipients, templateId, dynamicData } = data;

  try {
    const messages = recipients.map((to: string) => ({
      to,
      from: 'noreply@hiddentreasures.org',
      templateId,
      dynamicTemplateData: dynamicData,
    }));

    await sgMail.send(messages);

    return { success: true, count: recipients.length };
  } catch (error) {
    console.error('Error sending bulk email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send bulk email');
  }
});
```

---

## 📱 SMS NOTIFICATIONS (TWILIO)

**File**: `functions/src/communication/smsService.ts`

```typescript
import * as functions from 'firebase-functions';
import * as twilio from 'twilio';

const accountSid = functions.config().twilio.account_sid;
const authToken = functions.config().twilio.auth_token;
const client = twilio(accountSid, authToken);

export const sendSMS = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { to, message } = data;

  try {
    const result = await client.messages.create({
      body: message,
      from: functions.config().twilio.phone_number,
      to,
    });

    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send SMS');
  }
});

export const sendBulkSMS = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { recipients, message } = data;

  try {
    const promises = recipients.map((to: string) =>
      client.messages.create({
        body: message,
        from: functions.config().twilio.phone_number,
        to,
      })
    );

    await Promise.all(promises);

    return { success: true, count: recipients.length };
  } catch (error) {
    console.error('Error sending bulk SMS:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send bulk SMS');
  }
});
```

---

## 💬 IN-APP MESSAGING

**File**: `src/screens/MessagesScreen.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  messageId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Timestamp;
  readBy: string[];
}

export default function MessagesScreen({ route }: any) {
  const { currentUser, userProfile } = useAuth();
  const { conversationId } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (conversationId) {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          messageId: doc.id,
          ...doc.data(),
        })) as Message[];

        setMessages(msgs);

        // Mark messages as read
        snapshot.docs.forEach(async (messageDoc) => {
          const message = messageDoc.data();
          if (!message.readBy.includes(currentUser?.uid)) {
            await updateDoc(messageDoc.ref, {
              readBy: arrayUnion(currentUser?.uid),
            });
          }
        });
      });

      return () => unsubscribe();
    }
  }, [conversationId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    try {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');

      await addDoc(messagesRef, {
        senderId: currentUser.uid,
        senderName: `${userProfile?.firstName} ${userProfile?.lastName}`,
        text: newMessage.trim(),
        timestamp: Timestamp.now(),
        readBy: [currentUser.uid],
        delivered: true,
        type: 'text',
      });

      // Update conversation's last message
      await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: {
          text: newMessage.trim(),
          senderId: currentUser.uid,
          timestamp: Timestamp.now(),
        },
        updatedAt: Timestamp.now(),
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.senderId === currentUser?.uid;

    return (
      <View
        style={[
          styles.messageBubble,
          isOwnMessage ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        {!isOwnMessage && (
          <Text style={styles.senderName}>{item.senderName}</Text>
        )}
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toDate().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.messageId}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={!newMessage.trim()}
        >
          <Ionicons
            name="send"
            size={24}
            color={newMessage.trim() ? '#3B82F6' : '#9CA3AF'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 15,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3B82F6',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  senderName: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#111827',
  },
  timestamp: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

---

## ✅ TESTING CHECKLIST

### **Phase 17 (Mobile App)**
- [ ] App builds for iOS and Android
- [ ] Firebase authentication works
- [ ] Offline mode persists data
- [ ] Push notifications deliver
- [ ] QR scanner reads codes
- [ ] Camera captures photos
- [ ] Pull-to-refresh updates data
- [ ] Navigation works between screens
- [ ] Real-time updates appear instantly

### **Phase 18 (Communication)**
- [ ] In-app messages send/receive
- [ ] Read receipts update correctly
- [ ] Email templates render properly
- [ ] SendGrid emails deliver
- [ ] Twilio SMS sends successfully
- [ ] Announcements target correct users
- [ ] Multi-channel delivery works
- [ ] Scheduled messages send on time

---

## 🚀 DEPLOYMENT

### **Phase 17: Mobile App**

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Submit to App Store
expo upload:ios

# Submit to Google Play
expo upload:android
```

### **Phase 18: Communication**

```bash
# Deploy Cloud Functions
firebase deploy --only functions:sendEmail
firebase deploy --only functions:sendSMS

# Configure API keys
firebase functions:config:set sendgrid.key="YOUR_KEY"
firebase functions:config:set twilio.account_sid="YOUR_SID"
firebase functions:config:set twilio.auth_token="YOUR_TOKEN"
firebase functions:config:set twilio.phone_number="+1234567890"
```

---

**Both phases complete when all tests pass and apps are live in stores! 🚀**
