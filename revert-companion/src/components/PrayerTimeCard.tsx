import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface PrayerTimeCardProps {
  name: string;
  time: string;
  isNext?: boolean;
  isPrayed?: boolean;
  onTogglePrayed?: () => void;
}

export const PrayerTimeCard: React.FC<PrayerTimeCardProps> = ({
  name,
  time,
  isNext = false,
  isPrayed = false,
  onTogglePrayed,
}) => {
  const getPrayerColor = () => {
    switch (name.toLowerCase()) {
      case 'fajr': return Colors.prayer.fajr;
      case 'dhuhr': return Colors.prayer.dhuhr;
      case 'asr': return Colors.prayer.asr;
      case 'maghrib': return Colors.prayer.maghrib;
      case 'isha': return Colors.prayer.isha;
      default: return Colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isNext && styles.nextPrayer,
        isPrayed && styles.prayedContainer,
      ]}
      onPress={onTogglePrayed}
      activeOpacity={0.8}
    >
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, { backgroundColor: getPrayerColor() }]}>
          <Ionicons 
            name={isPrayed ? "checkmark-circle" : "time-outline"} 
            size={24} 
            color={Colors.text.light} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.prayerName, isPrayed && styles.prayedText]}>
            {name}
          </Text>
          {isNext && !isPrayed && (
            <Text style={styles.nextLabel}>Next Prayer</Text>
          )}
        </View>
      </View>
      <Text style={[styles.time, isPrayed && styles.prayedText]}>
        {time}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextPrayer: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  prayedContainer: {
    opacity: 0.7,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    justifyContent: 'center',
  },
  prayerName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  nextLabel: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 2,
  },
  time: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  prayedText: {
    textDecorationLine: 'line-through',
    color: Colors.text.disabled,
  },
});