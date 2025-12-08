# Hidden Treasures Network Mobile App

React Native mobile application for the Hidden Treasures Network platform, built with Expo.

## Features

- **Cross-platform**: iOS and Android support
- **Firebase Integration**: Shared backend with web app
- **Role-based Dashboards**: Student, Mentor, and Organization views
- **Events**: Browse and register for events
- **Messaging**: Real-time communication between users
- **Sessions**: Schedule and manage mentorship sessions
- **Push Notifications**: Stay updated with important alerts
- **Offline Support**: Core features work offline

## Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- For iOS development: macOS with Xcode
- For Android development: Android Studio
- Expo Go app on your mobile device (for testing)

## Setup

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Firebase

Update `app.json` with your Firebase credentials in the `extra` section:

```json
"extra": {
  "firebaseApiKey": "YOUR_API_KEY",
  "firebaseAuthDomain": "YOUR_AUTH_DOMAIN",
  "firebaseProjectId": "YOUR_PROJECT_ID",
  "firebaseStorageBucket": "YOUR_STORAGE_BUCKET",
  "firebaseMessagingSenderId": "YOUR_MESSAGING_SENDER_ID",
  "firebaseAppId": "YOUR_APP_ID"
}
```

These should match the Firebase configuration from the web app.

### 3. Run the App

**Development with Expo Go:**

```bash
# Start the development server
npm start

# Or run on specific platform
npm run ios      # iOS simulator (macOS only)
npm run android  # Android emulator
npm run web      # Web browser
```

**Production Build:**

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## Project Structure

```
mobile/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Loading.tsx
│   │   └── ...
│   ├── navigation/       # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── StudentNavigator.tsx
│   │   └── MentorNavigator.tsx
│   ├── screens/          # Screen components
│   │   ├── auth/
│   │   ├── student/
│   │   ├── mentor/
│   │   ├── organization/
│   │   └── common/
│   ├── services/         # API and Firebase services
│   │   └── firebase.ts
│   ├── hooks/            # Custom React hooks
│   │   └── useAuth.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   └── constants/        # App constants and theme
│       └── theme.ts
├── assets/               # Images, fonts, etc.
├── App.tsx              # Root component
├── app.json             # Expo configuration
└── package.json         # Dependencies

```

## Shared Types

The mobile app shares type definitions with the web app. Core types are defined in `/types` and should be kept in sync with the web application.

## Firebase Collections Used

- `users` - User profiles and authentication
- `events` - Event listings and registrations
- `messages` - Direct messaging
- `messageThreads` - Message conversations
- `sessions` - Mentorship sessions
- `notifications` - User notifications

## Development

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Consistent naming conventions
- Component-based architecture

### Testing

```bash
# Run tests (when implemented)
npm test
```

### Debugging

- Use Expo Dev Tools for debugging
- React DevTools for component inspection
- Firebase Console for backend monitoring

## Deployment

### iOS App Store

1. Build with EAS: `eas build --platform ios`
2. Submit to App Store: `eas submit --platform ios`

### Google Play Store

1. Build with EAS: `eas build --platform android`
2. Submit to Play Store: `eas submit --platform android`

## Environment Variables

Configure in `app.json` under `extra`:

- `firebaseApiKey` - Firebase API key
- `firebaseAuthDomain` - Firebase auth domain
- `firebaseProjectId` - Firebase project ID
- `firebaseStorageBucket` - Firebase storage bucket
- `firebaseMessagingSenderId` - Firebase messaging sender ID
- `firebaseAppId` - Firebase app ID

## Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
```

### iOS Simulator Issues

```bash
# Reset simulator
xcrun simctl erase all
```

### Android Emulator Issues

```bash
# Cold boot emulator
emulator -avd YOUR_AVD_NAME -no-snapshot-load
```

## Contributing

1. Follow the existing code structure
2. Write TypeScript for all new code
3. Test on both iOS and Android
4. Update this README for significant changes

## Support

For issues or questions:
- Check the main repository documentation
- Review Expo documentation: https://docs.expo.dev/
- Firebase documentation: https://firebase.google.com/docs

## License

Same license as the main Hidden Treasures Network repository.
