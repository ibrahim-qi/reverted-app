import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import * as Location from 'expo-location';

import { Colors } from '../constants/colors';
import { GradientCard } from '../components/GradientCard';
import { PrayerTimeCard } from '../components/PrayerTimeCard';
import { calculatePrayerTimes, getNextPrayer } from '../utils/prayerCalculations';
import { 
  getUserLocation, 
  saveUserLocation, 
  getUserPreferences, 
  recordPrayer,
  getUserProgress 
} from '../utils/storage';
import { PrayerTimes, Location as LocationType, Progress } from '../types';

const PrayerTimesScreen: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [todaysPrayers, setTodaysPrayers] = useState({
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
  });
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    loadPrayerTimes();
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const userProgress = await getUserProgress();
    setProgress(userProgress);
    
    const today = format(new Date(), 'yyyy-MM-dd');
    if (userProgress.dailyPrayers[today]) {
      setTodaysPrayers(userProgress.dailyPrayers[today]);
    }
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
    await loadProgress();
    setRefreshing(false);
  };

  const togglePrayer = async (prayer: keyof typeof todaysPrayers) => {
    const newStatus = !todaysPrayers[prayer];
    const today = format(new Date(), 'yyyy-MM-dd');
    
    await recordPrayer(today, prayer, newStatus);
    
    setTodaysPrayers(prev => ({
      ...prev,
      [prayer]: newStatus,
    }));
    
    await loadProgress();
  };

  const getPrayerStatus = () => {
    const completed = Object.values(todaysPrayers).filter(p => p).length;
    return `${completed}/5 Prayers Completed`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Date and Location */}
        <View style={styles.header}>
          <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d, yyyy')}</Text>
          {location && (
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={16} color={Colors.text.secondary} />
              <Text style={styles.location}>
                {location.city || 'Current Location'}
              </Text>
            </View>
          )}
        </View>

        {/* Prayer Status Card */}
        <GradientCard
          colors={[Colors.primary, Colors.primaryLight]}
          style={styles.statusCard}
        >
          <Text style={styles.statusTitle}>Today's Progress</Text>
          <Text style={styles.statusValue}>{getPrayerStatus()}</Text>
          {progress && (
            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={20} color={Colors.secondary} />
              <Text style={styles.streakText}>{progress.streak} day streak</Text>
            </View>
          )}
        </GradientCard>

        {/* Prayer Times */}
        {prayerTimes && (
          <View style={styles.prayersList}>
            <PrayerTimeCard
              name="Fajr"
              time={prayerTimes.fajr}
              isNext={nextPrayer?.name === 'Fajr'}
              isPrayed={todaysPrayers.fajr}
              onTogglePrayed={() => togglePrayer('fajr')}
            />
            <PrayerTimeCard
              name="Sunrise"
              time={prayerTimes.sunrise}
              isNext={false}
              isPrayed={false}
            />
            <PrayerTimeCard
              name="Dhuhr"
              time={prayerTimes.dhuhr}
              isNext={nextPrayer?.name === 'Dhuhr'}
              isPrayed={todaysPrayers.dhuhr}
              onTogglePrayed={() => togglePrayer('dhuhr')}
            />
            <PrayerTimeCard
              name="Asr"
              time={prayerTimes.asr}
              isNext={nextPrayer?.name === 'Asr'}
              isPrayed={todaysPrayers.asr}
              onTogglePrayed={() => togglePrayer('asr')}
            />
            <PrayerTimeCard
              name="Maghrib"
              time={prayerTimes.maghrib}
              isNext={nextPrayer?.name === 'Maghrib'}
              isPrayed={todaysPrayers.maghrib}
              onTogglePrayed={() => togglePrayer('maghrib')}
            />
            <PrayerTimeCard
              name="Isha"
              time={prayerTimes.isha}
              isNext={nextPrayer?.name === 'Isha'}
              isPrayed={todaysPrayers.isha}
              onTogglePrayed={() => togglePrayer('isha')}
            />
          </View>
        )}

        {/* Prayer Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Prayer Tips</Text>
          <View style={styles.tipCard}>
            <Ionicons name="bulb" size={24} color={Colors.secondary} />
            <Text style={styles.tipText}>
              Set reminders for each prayer time to never miss a prayer.
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="water" size={24} color={Colors.secondary} />
            <Text style={styles.tipText}>
              Perform wudu (ablution) properly before each prayer.
            </Text>
          </View>
        </View>
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
  date: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  location: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  statusCard: {
    margin: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 16,
    color: Colors.text.light,
    opacity: 0.9,
  },
  statusValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.light,
    marginTop: 8,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  streakText: {
    fontSize: 16,
    color: Colors.text.light,
    marginLeft: 6,
  },
  prayersList: {
    paddingHorizontal: 20,
  },
  tipsSection: {
    padding: 20,
    marginTop: 20,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: Colors.text.primary,
    lineHeight: 22,
  },
});

export default PrayerTimesScreen;