import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, Progress, Location, CalculationMethod } from '../types';

const STORAGE_KEYS = {
  USER_PREFERENCES: '@revert_companion/user_preferences',
  USER_PROGRESS: '@revert_companion/user_progress',
  USER_LOCATION: '@revert_companion/user_location',
  COMPLETED_LESSONS: '@revert_companion/completed_lessons',
  PRAYER_RECORDS: '@revert_companion/prayer_records',
};

// Default preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  calculationMethod: CalculationMethod.MWL,
  notifications: {
    enabled: true,
    beforeMinutes: 15,
    sound: true,
  },
  theme: 'light',
  language: 'en',
  madhab: 'shafi',
};

// User Preferences
export async function getUserPreferences(): Promise<UserPreferences> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return DEFAULT_PREFERENCES;
  }
}

export async function saveUserPreferences(preferences: UserPreferences): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PREFERENCES,
      JSON.stringify(preferences)
    );
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
}

// User Progress
export async function getUserProgress(): Promise<Progress> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    return stored ? JSON.parse(stored) : {
      dailyPrayers: {},
      lessonsCompleted: [],
      streak: 0,
      totalPoints: 0,
    };
  } catch (error) {
    console.error('Error getting user progress:', error);
    return {
      dailyPrayers: {},
      lessonsCompleted: [],
      streak: 0,
      totalPoints: 0,
    };
  }
}

export async function saveUserProgress(progress: Progress): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PROGRESS,
      JSON.stringify(progress)
    );
  } catch (error) {
    console.error('Error saving user progress:', error);
  }
}

// Location
export async function getUserLocation(): Promise<Location | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_LOCATION);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error getting user location:', error);
    return null;
  }
}

export async function saveUserLocation(location: Location): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_LOCATION,
      JSON.stringify(location)
    );
  } catch (error) {
    console.error('Error saving user location:', error);
  }
}

// Prayer Records
export async function recordPrayer(
  date: string,
  prayer: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha',
  prayed: boolean
): Promise<void> {
  try {
    const progress = await getUserProgress();
    
    if (!progress.dailyPrayers[date]) {
      progress.dailyPrayers[date] = {
        fajr: false,
        dhuhr: false,
        asr: false,
        maghrib: false,
        isha: false,
      };
    }
    
    progress.dailyPrayers[date][prayer] = prayed;
    
    // Update streak
    const today = new Date().toISOString().split('T')[0];
    if (date === today) {
      const allPrayed = Object.values(progress.dailyPrayers[date]).every(p => p);
      if (allPrayed) {
        progress.streak += 1;
        progress.totalPoints += 50; // 50 points for completing all prayers
      }
    }
    
    await saveUserProgress(progress);
  } catch (error) {
    console.error('Error recording prayer:', error);
  }
}

// Lesson Progress
export async function markLessonComplete(lessonId: string): Promise<void> {
  try {
    const progress = await getUserProgress();
    
    if (!progress.lessonsCompleted.includes(lessonId)) {
      progress.lessonsCompleted.push(lessonId);
      progress.totalPoints += 25; // 25 points per lesson
      await saveUserProgress(progress);
    }
  } catch (error) {
    console.error('Error marking lesson complete:', error);
  }
}

// Clear all data (for testing or reset)
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}