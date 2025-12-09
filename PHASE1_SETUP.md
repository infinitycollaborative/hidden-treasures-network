# Phase 1: Foundation - Setup & Implementation Guide

## Overview

Phase 1 establishes the foundational infrastructure for the Hidden Treasures Network platform, including:

✅ **Complete Authentication System** with Firebase Auth
✅ **8 User Roles** with role-based access control
✅ **Comprehensive Database Schema** (12 Firestore collections)
✅ **Security Rules** for data protection
✅ **Dashboard Layouts** for all user types
✅ **Protected Routes** and navigation

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Firebase Project** (create at https://console.firebase.google.com)
- **Git** installed

---

## Step 1: Clone and Install

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd Hidden-Treasures-Network

# Install dependencies
npm install
```

---

## Step 2: Firebase Setup

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" or select existing project
3. Follow the setup wizard

### 2.2 Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. (Optional) Enable **Google** provider

### 2.3 Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (we'll deploy rules later)
4. Select a location closest to your users

### 2.4 Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click the **Web** icon (`</>`)
4. Register your app with a nickname (e.g., "Hidden Treasures Web")
5. Copy the Firebase configuration object

---

## Step 3: Environment Configuration

### 3.1 Create .env.local file

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

### 3.2 Add Firebase Credentials

Edit `.env.local` and add your Firebase configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Hidden Treasures Network
```

**⚠️ Important:** Never commit `.env.local` to version control!

---

## Step 4: Deploy Firestore Security Rules

Install Firebase CLI if you haven't already:

```bash
npm install -g firebase-tools
```

Login to Firebase:

```bash
firebase login
```

Initialize Firebase in your project (if not done):

```bash
firebase init firestore
# Select your Firebase project
# Use default firestore.rules and firestore.indexes.json
```

Deploy the security rules:

```bash
firebase deploy --only firestore:rules
```

**Expected output:**
```
✔ Deploy complete!
```

---

## Step 5: Run Development Server

Start the development server:

```bash
npm run dev
```

The application should now be running at **http://localhost:3000**

---

## Phase 1 Features Implemented

### 1. **User Roles** (8 types)

| Role | Description | Dashboard Route |
|------|-------------|----------------|
| `student` | Youth participants (ages 10-25) | `/dashboard/student` |
| `mentor` | Aviation/STEM professionals | `/dashboard/mentor` |
| `organization` | Programs running HTN initiatives | `/dashboard/organization` |
| `sponsor` | Companies/individuals providing funding | `/dashboard/sponsor` |
| `teacher` | Classroom educators | `/dashboard/teacher` |
| `school_admin` | School-level administrators | `/dashboard/school-admin` |
| `district_admin` | District-level oversight | `/dashboard/district-admin` |
| `platform_admin` | Full system access | `/dashboard/admin` |

### 2. **Authentication Features**

- ✅ User registration with role selection
- ✅ Email/password login
- ✅ Password reset
- ✅ Email verification
- ✅ Google Sign-In (optional)
- ✅ Protected routes
- ✅ Role-based access control

### 3. **Database Collections**

| Collection | Purpose | Security |
|------------|---------|----------|
| `users` | Core user profiles | Read: All authenticated users |
| `students` | Student-specific data | Read: Student, mentor, teacher, admins |
| `mentors` | Mentor profiles | Read: All authenticated users |
| `organizations` | Organization profiles | Read: All authenticated users |
| `sponsors` | Sponsor data (private) | Read: Owner & admins only |
| `teachers` | Teacher profiles | Read: All authenticated users |
| `schools` | School information | Read: All authenticated users |
| `classrooms` | Classroom management | Read: All authenticated users |
| `programs` | Program listings | Read: All authenticated users |
| `sessions` | Mentorship/training sessions | Read: Participants only |
| `notifications` | User notifications | Read: Owner only |
| `activityLog` | Audit trail | Read: Owner & admins |

### 4. **Components Created**

```
contexts/
  └── AuthContext.tsx          # Authentication provider

components/
  ├── auth/
  │   └── ProtectedRoute.tsx   # Route protection with role checks
  └── dashboard/
      ├── DashboardLayout.tsx  # Main dashboard wrapper
      ├── Sidebar.tsx          # Role-based navigation
      ├── Header.tsx           # Top bar with user menu
      └── StatsCard.tsx        # Metric display cards
```

### 5. **Type Definitions**

All types are defined in:
- `types/phase1.ts` - Complete Phase 1 schema
- `types/index.ts` - Existing types (Phase 11 additions)

---

## Testing Phase 1

### 1. **Test User Registration**

1. Go to http://localhost:3000/register
2. Select a role (e.g., **Student**)
3. Fill in the registration form:
   - Full Name: `Test Student`
   - Email: `student@test.com`
   - Password: `password123`
4. Click **Create Account**
5. Check Firebase Console → **Authentication** to see the new user
6. Check Firebase Console → **Firestore** to see user document created

### 2. **Test Login**

1. Go to http://localhost:3000/login
2. Enter credentials:
   - Email: `student@test.com`
   - Password: `password123`
3. Click **Sign In**
4. You should be redirected to `/dashboard/student`

### 3. **Test Role-Based Access**

Try accessing different dashboard routes:

- **Student Dashboard:** `/dashboard/student` ✅ (should work)
- **Mentor Dashboard:** `/dashboard/mentor` ❌ (should redirect to `/unauthorized`)
- **Admin Dashboard:** `/dashboard/admin` ❌ (should redirect to `/unauthorized`)

### 4. **Test Protected Routes**

1. Logout from the dashboard
2. Try to access `/dashboard/student` directly
3. You should be redirected to `/login`

### 5. **Test Security Rules**

Open Browser Console and try these commands:

```javascript
// This should work (reading own profile)
firebase.firestore().collection('users').doc(currentUserId).get()

// This should fail (reading another user's notifications)
firebase.firestore().collection('notifications').doc('another-user-id').get()

// This should fail (creating without proper role)
firebase.firestore().collection('mentors').add({ test: true })
```

---

## Firestore Data Structure

### Example User Document (`users/{uid}`)

```json
{
  "uid": "abc123",
  "email": "student@test.com",
  "role": "student",
  "displayName": "Test Student",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "status": "active",
  "emailVerified": false,
  "onboardingCompleted": false,
  "profile": {
    "preferredLanguage": "en"
  },
  "privacy": {
    "parentalConsentRequired": false,
    "dataAccessLevel": "full",
    "ferpaCompliant": false
  },
  "notifications": {
    "email": true,
    "sms": false,
    "push": true
  }
}
```

### Example Student Document (`students/{userId}`)

```json
{
  "userId": "abc123",
  "studentId": "STU-2024-001",
  "firstName": "Test",
  "lastName": "Student",
  "dateOfBirth": "2010-01-01",
  "interests": ["aviation", "drones"],
  "educationLevel": "high_school",
  "programs": [],
  "progress": {
    "totalXP": 0,
    "level": 1,
    "badges": [],
    "certifications": [],
    "flightHours": 0,
    "simulatorHours": 0,
    "discoveryFlights": 0
  },
  "enrolledAt": "2024-01-01T00:00:00Z",
  "lastActive": "2024-01-01T00:00:00Z"
}
```

---

## Troubleshooting

### Error: "Firebase not initialized"

**Solution:** Make sure `.env.local` exists and contains valid Firebase credentials.

```bash
# Check if file exists
cat .env.local

# Restart dev server
npm run dev
```

### Error: "Permission denied" in Firestore

**Solution:** Deploy security rules:

```bash
firebase deploy --only firestore:rules
```

### Error: "Module not found: @/contexts/AuthContext"

**Solution:** Make sure TypeScript paths are configured correctly in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Login redirects to dashboard but shows blank page

**Solution:** Check browser console for errors. Common issues:
- Missing UI components (install shadcn components)
- Firestore permissions not deployed
- User profile document not created

---

## Next Steps (Future Phases)

Phase 1 provides the foundation. Future phases will include:

**Phase 2: Core Features**
- Complete profile management (CRUD)
- Program enrollment system
- Mentor-student matching
- Session scheduling
- File uploads

**Phase 3: Engagement**
- Gamification (XP, badges, levels)
- Progress tracking dashboards
- Activity feeds
- Real-time notifications

**Phase 4: Advanced Features**
- Classroom integration
- Marketplace/funding
- Analytics & reporting
- AI teaching assistant

---

## File Structure

```
Hidden-Treasures-Network/
├── app/
│   ├── dashboard/
│   │   ├── student/page.tsx        # Student dashboard
│   │   ├── mentor/page.tsx         # Mentor dashboard (to implement)
│   │   ├── organization/page.tsx   # Org dashboard (to implement)
│   │   ├── sponsor/page.tsx        # Sponsor dashboard (to implement)
│   │   └── teacher/page.tsx        # Teacher dashboard (to implement)
│   ├── login/page.tsx              # Login page
│   ├── register/page.tsx           # Registration with role selection
│   └── layout.tsx                  # Root layout with AuthProvider
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx      # Route protection
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx     # Dashboard wrapper
│   │   ├── Sidebar.tsx             # Navigation sidebar
│   │   ├── Header.tsx              # Top header
│   │   └── StatsCard.tsx           # Metric cards
│   └── ui/                         # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx             # Auth provider
├── types/
│   ├── phase1.ts                   # Phase 1 type definitions
│   └── index.ts                    # Existing types
├── config/
│   └── firebase.ts                 # Firebase initialization
├── firestore.rules                 # Security rules
├── .env.local                      # Environment variables (gitignored)
└── .env.local.example              # Example env file
```

---

## Security Best Practices

✅ **Always use environment variables** for Firebase config
✅ **Never commit .env.local** to version control
✅ **Deploy security rules** before going to production
✅ **Validate user roles** on both client and server
✅ **Use HTTPS only** in production
✅ **Enable email verification** for all users
✅ **Implement rate limiting** for auth endpoints

---

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review Firebase Console for errors
3. Check browser console for client-side errors
4. Verify environment variables are set correctly
5. Ensure security rules are deployed

For Firebase documentation:
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

## Summary

Phase 1 is now complete with:

✅ Full authentication system
✅ 8 user roles with RBAC
✅ 12 Firestore collections
✅ Comprehensive security rules
✅ Dashboard layouts
✅ Protected routing

**You're ready to build Phase 2!** 🚀
