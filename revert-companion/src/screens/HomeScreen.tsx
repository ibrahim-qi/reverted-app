import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import * as Location from 'expo-location';

import { Colors } from '../constants/colors';
import { GradientCard } from '../components/GradientCard';
import { PrayerTimeCard } from '../components/PrayerTimeCard';
import { DAILY_VERSES } from '../constants/learningContent';
import { calculatePrayerTimes, getNextPrayer } from '../utils/prayerCalculations';
import { getUserLocation, saveUserLocation, getUserPreferences } from '../utils/storage';
import { PrayerTimes, Location as LocationType } from '../types';
import { RootTabParamList } from '../navigation/AppNavigator';

type NavigationProp = BottomTabNavigationProp<RootTabParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);
  const [dailyVerse, setDailyVerse] = useState(DAILY_VERSES[0]);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<LocationType | null>(null);

  useEffect(() => {
    loadPrayerTimes();
    selectDailyVerse();
  }, []);

  const selectDailyVerse = () => {
    const today = new Date().getDate();
    const verseIndex = today % DAILY_VERSES.length;
    setDailyVerse(DAILY_VERSES[verseIndex]);
  };

  const loadPrayerTimes = async () => {
    try {
      let userLocation = await getUserLocation();
      
      if (!userLocation) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const locationData = await Location.getCurrentPositionAsync({});
          userLocation = {
            latitude: locationData.coords.latitude,
            longitude: locationData.coords.longitude,
          };
          await saveUserLocation(userLocation);
        } else {
          // Default to Mecca if no permission
          userLocation = { latitude: 21.4225, longitude: 39.8262 };
        }
      }

      setLocation(userLocation);
      const preferences = await getUserPreferences();
      const times = calculatePrayerTimes(new Date(), userLocation, preferences.calculationMethod);
      setPrayerTimes(times);
      setNextPrayer(getNextPrayer(times));
    } catch (error) {
      console.error('Error loading prayer times:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPrayerTimes();
    setRefreshing(false);
  };

  const QuickAction = ({ icon, title, onPress }: any) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={styles.quickActionIcon}>
        <Ionicons name={icon} size={28} color={Colors.primary} />
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>As-salamu alaykum</Text>
          <Text style={styles.subGreeting}>Peace be upon you</Text>
        </View>

        {/* Daily Verse Card */}
        <GradientCard
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.verseCard}
        >
          <Text style={styles.verseTitle}>Verse of the Day</Text>
          <Text style={styles.verseArabic}>{dailyVerse.arabic}</Text>
          <Text style={styles.verseTranslation}>{dailyVerse.translation}</Text>
          <Text style={styles.verseReference}>{dailyVerse.reference}</Text>
        </GradientCard>

        {/* Next Prayer */}
        {nextPrayer && prayerTimes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Next Prayer</Text>
            <PrayerTimeCard
              name={nextPrayer.name}
              time={nextPrayer.time}
              isNext={true}
            />
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <QuickAction
              icon="compass"
              title="Qibla"
              onPress={() => navigation.navigate('Qibla')}
            />
            <QuickAction
              icon="book"
              title="Learn"
              onPress={() => navigation.navigate('Learn')}
            />
            <QuickAction
              icon="moon"
              title="Duas"
              onPress={() => navigation.navigate('Learn')}
            />
            <QuickAction
              icon="time"
              title="Prayer"
              onPress={() => navigation.navigate('Prayer')}
            />
          </View>
        </View>

        {/* Today's Progress */}
        <GradientCard
          colors={[Colors.accent, Colors.accentLight]}
          style={styles.progressCard}
        >
          <Text style={styles.progressTitle}>Today's Progress</Text>
          <View style={styles.progressStats}>
            <View style={styles.progressItem}>
              <Ionicons name="flame" size={24} color={Colors.secondary} />
              <Text style={styles.progressValue}>0</Text>
              <Text style={styles.progressLabel}>Streak</Text>
            </View>
            <View style={styles.progressItem}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.secondary} />
              <Text style={styles.progressValue}>0/5</Text>
              <Text style={styles.progressLabel}>Prayers</Text>
            </View>
            <View style={styles.progressItem}>
              <Ionicons name="trophy" size={24} color={Colors.secondary} />
              <Text style={styles.progressValue}>0</Text>
              <Text style={styles.progressLabel}>Points</Text>
            </View>
          </View>
        </GradientCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  subGreeting: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  verseCard: {
    margin: 20,
    marginTop: 10,
  },
  verseTitle: {
    fontSize: 16,
    color: Colors.text.light,
    opacity: 0.9,
    marginBottom: 12,
  },
  verseArabic: {
    fontSize: 24,
    color: Colors.text.light,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
    lineHeight: 36,
  },
  verseTranslation: {
    fontSize: 16,
    color: Colors.text.light,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  verseReference: {
    fontSize: 14,
    color: Colors.text.light,
    opacity: 0.8,
    textAlign: 'right',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  progressCard: {
    margin: 20,
    marginTop: 24,
  },
  progressTitle: {
    fontSize: 18,
    color: Colors.text.light,
    marginBottom: 16,
    textAlign: 'center',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.light,
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: Colors.text.light,
    opacity: 0.9,
    marginTop: 4,
  },
});

export default HomeScreen;