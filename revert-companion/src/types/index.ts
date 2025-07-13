export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export interface UserPreferences {
  calculationMethod: CalculationMethod;
  notifications: {
    enabled: boolean;
    beforeMinutes: number;
    sound: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'ar';
  madhab: 'shafi' | 'hanafi';
}

export enum CalculationMethod {
  MWL = 'MWL', // Muslim World League
  ISNA = 'ISNA', // Islamic Society of North America
  Egypt = 'Egypt',
  Makkah = 'Makkah',
  Karachi = 'Karachi',
  Tehran = 'Tehran',
  Jafari = 'Jafari',
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: 'basics' | 'prayer' | 'quran' | 'daily-life';
  lessons: Lesson[];
  completed: boolean;
  progress: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'interactive';
  duration: number; // in minutes
  completed: boolean;
}

export interface Dua {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  category: string;
  occasion: string;
}

export interface QuranVerse {
  id: number;
  surah: number;
  ayah: number;
  arabic: string;
  translation: string;
  transliteration: string;
}

export interface Progress {
  dailyPrayers: {
    [date: string]: {
      fajr: boolean;
      dhuhr: boolean;
      asr: boolean;
      maghrib: boolean;
      isha: boolean;
    };
  };
  lessonsCompleted: string[];
  streak: number;
  totalPoints: number;
}

export interface IslamicDate {
  day: number;
  month: string;
  year: number;
  hijri: string;
}