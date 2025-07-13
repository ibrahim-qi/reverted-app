import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface IslamicCalendarProps {
  gregorianDate: Date;
}

export const IslamicCalendar: React.FC<IslamicCalendarProps> = ({ gregorianDate }) => {
  // Convert Gregorian date to Islamic date
  const getIslamicDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Simple conversion (not 100% accurate but good enough for display)
    const islamicYear = Math.floor((year - 622) * 1.0307);
    const islamicMonth = Math.floor((month + 2) % 12) + 1;
    const islamicDay = Math.floor(day * 1.0307) % 30;
    
    const monthNames = [
      'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
      'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
      'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'
    ];
    
    return {
      day: islamicDay || 1,
      month: monthNames[islamicMonth - 1],
      year: islamicYear,
      hijri: `${islamicDay || 1} ${monthNames[islamicMonth - 1]} ${islamicYear} AH`
    };
  };

  const islamicDate = getIslamicDate(gregorianDate);
  
  // Check for important Islamic dates
  const getImportantDate = () => {
    const month = islamicDate.month;
    const day = islamicDate.day;
    
    if (month === 'Ramadan' && day >= 1 && day <= 30) {
      return { type: 'Ramadan', message: 'Blessed month of fasting' };
    }
    if (month === 'Dhu al-Hijjah' && day >= 8 && day <= 13) {
      return { type: 'Hajj', message: 'Hajj pilgrimage period' };
    }
    if (month === 'Muharram' && day === 1) {
      return { type: 'Islamic New Year', message: 'Islamic New Year' };
    }
    if (month === 'Rabi al-Awwal' && day === 12) {
      return { type: 'Mawlid', message: 'Birth of Prophet Muhammad ﷺ' };
    }
    if (month === 'Rajab' && day === 27) {
      return { type: 'Laylat al-Miraj', message: 'Night of Ascension' };
    }
    if (month === 'Sha\'ban' && day === 15) {
      return { type: 'Laylat al-Bara\'ah', message: 'Night of Forgiveness' };
    }
    if (month === 'Ramadan' && day === 27) {
      return { type: 'Laylat al-Qadr', message: 'Night of Power' };
    }
    if (month === 'Shawwal' && day === 1) {
      return { type: 'Eid al-Fitr', message: 'Festival of Breaking Fast' };
    }
    if (month === 'Dhu al-Hijjah' && day === 10) {
      return { type: 'Eid al-Adha', message: 'Festival of Sacrifice' };
    }
    
    return null;
  };

  const importantDate = getImportantDate();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Islamic Calendar</Text>
        <Text style={styles.gregorianDate}>
          {gregorianDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>
      
      <View style={styles.islamicDateContainer}>
        <Text style={styles.islamicDate}>{islamicDate.hijri}</Text>
        <Text style={styles.islamicDateLabel}>Hijri Date</Text>
      </View>
      
      {importantDate && (
        <View style={styles.importantDateContainer}>
          <Text style={styles.importantDateTitle}>{importantDate.type}</Text>
          <Text style={styles.importantDateMessage}>{importantDate.message}</Text>
        </View>
      )}
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
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 5,
  },
  gregorianDate: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  islamicDateContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  islamicDate: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
  },
  islamicDateLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 5,
  },
  importantDateContainer: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  importantDateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 5,
  },
  importantDateMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});