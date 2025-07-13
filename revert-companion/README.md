# Revert Companion - Islamic Learning App

A beautiful and comprehensive React Native/Expo app designed specifically for new Muslims (reverts) to learn and practice Islam.

## Features

### 🕌 Prayer Times
- Accurate prayer time calculations based on your location
- Multiple calculation methods (Muslim World League, ISNA, etc.)
- Prayer tracking and streak monitoring
- Customizable reminders

### 🧭 Qibla Compass
- Real-time Qibla direction using device sensors
- Distance to Kaaba calculation
- Beautiful compass visualization

### 📚 Learning Modules
- Comprehensive lessons on Islamic basics
- Step-by-step prayer guides
- Introduction to the Quran
- Progress tracking

### 🤲 Essential Duas
- Daily supplications with Arabic text
- Transliteration for easy pronunciation
- English translations
- Audio playback (simulated)

### ⚙️ Settings
- Prayer calculation method selection
- Notification preferences
- Language support (English/Arabic framework)
- Data management

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd revert-companion
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your device:
   - Download the Expo Go app on your iOS or Android device
   - Scan the QR code from the terminal
   - Or run on simulators using `i` for iOS or `a` for Android

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation library
- **AsyncStorage** - Local data persistence
- **Expo Location** - GPS services
- **Expo Sensors** - Magnetometer for compass
- **Date-fns** - Date manipulation

## App Structure

```
src/
├── components/      # Reusable UI components
├── screens/         # App screens
├── navigation/      # Navigation configuration
├── constants/       # Colors, content data
├── types/          # TypeScript interfaces
├── utils/          # Helper functions
└── services/       # API services (future)
```

## Design Philosophy

The app features:
- **Beautiful Islamic-inspired UI** with teal, gold, and emerald color scheme
- **Intuitive navigation** for users new to Islamic practices
- **Offline-first approach** for essential features
- **Progressive learning** with tracked progress
- **Authentic content** carefully curated for new Muslims

## Future Enhancements

- [ ] Real audio recordings for Quran and duas
- [ ] Community features
- [ ] Multi-language support
- [ ] Advanced Quran reader
- [ ] Zakat calculator
- [ ] Islamic calendar
- [ ] Mosque finder
- [ ] Live prayer time notifications

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Prayer time calculations based on established Islamic methods
- UI inspired by Islamic geometric patterns and calligraphy
- Built with love for the Muslim revert community

---

May Allah accept this effort and make it beneficial for all users. 🤲