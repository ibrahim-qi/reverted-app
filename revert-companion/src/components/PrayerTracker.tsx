import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface PrayerTrackerProps {
  prayers: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  onTogglePrayer: (prayer: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha') => void;
  streak: number;
  totalPoints: number;
}

export const PrayerTracker: React.FC<PrayerTrackerProps> = ({
  prayers,
  onTogglePrayer,
  streak,
  totalPoints,
}) => {
  const prayerNames = [
    { key: 'fajr', name: 'Fajr', icon: 'sunny' },
    { key: 'dhuhr', name: 'Dhuhr', icon: 'sunny' },
    { key: 'asr', name: 'Asr', icon: 'partly-sunny' },
    { key: 'maghrib', name: 'Maghrib', icon: 'moon' },
    { key: 'isha', name: 'Isha', icon: 'moon' },
  ];

  const completedCount = Object.values(prayers).filter(p => p).length;
  const progressPercentage = (completedCount / 5) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Prayers</Text>
        <Text style={styles.subtitle}>{completedCount}/5 Completed</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progressPercentage}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{Math.round(progressPercentage)}%</Text>
      </View>

      {/* Prayer Buttons */}
      <View style={styles.prayerGrid}>
        {prayerNames.map((prayer) => (
          <TouchableOpacity
            key={prayer.key}
            style={[
              styles.prayerButton,
              prayers[prayer.key as keyof typeof prayers] && styles.prayerCompleted
            ]}
            onPress={() => onTogglePrayer(prayer.key as keyof typeof prayers)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={prayer.icon as any} 
              size={24} 
              color={prayers[prayer.key as keyof typeof prayers] ? Colors.text.light : Colors.primary} 
            />
            <Text style={[
              styles.prayerText,
              prayers[prayer.key as keyof typeof prayers] && styles.prayerTextCompleted
            ]}>
              {prayer.name}
            </Text>
            {prayers[prayer.key as keyof typeof prayers] && (
              <Ionicons name="checkmark-circle" size={16} color={Colors.text.light} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="flame" size={20} color={Colors.secondary} />
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="trophy" size={20} color={Colors.secondary} />
          <Text style={styles.statValue}>{totalPoints}</Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="calendar" size={20} color={Colors.secondary} />
          <Text style={styles.statValue}>{completedCount * 10}</Text>
          <Text style={styles.statLabel}>Today's Points</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.divider,
    borderRadius: 4,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    minWidth: 30,
  },
  prayerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  prayerButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  prayerCompleted: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  prayerText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.primary,
    marginTop: 4,
    textAlign: 'center',
  },
  prayerTextCompleted: {
    color: Colors.text.light,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
});