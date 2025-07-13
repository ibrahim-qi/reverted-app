import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import { Colors } from '../constants/colors';
import { 
  getUserPreferences, 
  saveUserPreferences,
  clearAllData 
} from '../utils/storage';
import { UserPreferences, CalculationMethod } from '../types';
import { ZakatCalculator } from '../components/ZakatCalculator';

const SettingsScreen: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [showZakatCalculator, setShowZakatCalculator] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    const prefs = await getUserPreferences();
    setPreferences(prefs);
  };

  const updatePreference = async (updates: Partial<UserPreferences>) => {
    if (!preferences) return;
    
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    await saveUserPreferences(newPreferences);
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to reset all app data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            await loadPreferences();
            Alert.alert('Success', 'All data has been reset.');
          }
        },
      ]
    );
  };

  if (!preferences) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Prayer Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prayer Settings</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Calculation Method</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={preferences.calculationMethod}
                onValueChange={(value: CalculationMethod) => updatePreference({ calculationMethod: value })}
                style={styles.picker}
              >
                <Picker.Item label="Muslim World League" value={CalculationMethod.MWL} />
                <Picker.Item label="ISNA (North America)" value={CalculationMethod.ISNA} />
                <Picker.Item label="Egyptian Authority" value={CalculationMethod.Egypt} />
                <Picker.Item label="Umm Al-Qura (Makkah)" value={CalculationMethod.Makkah} />
                <Picker.Item label="University of Karachi" value={CalculationMethod.Karachi} />
                <Picker.Item label="Institute of Geophysics, Tehran" value={CalculationMethod.Tehran} />
                <Picker.Item label="Shia Ithna-Ashari" value={CalculationMethod.Jafari} />
              </Picker>
            </View>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Juristic Method (Madhab)</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={preferences.madhab}
                onValueChange={(value: 'shafi' | 'hanafi') => updatePreference({ madhab: value })}
                style={styles.picker}
              >
                <Picker.Item label="Shafi (Standard)" value="shafi" />
                <Picker.Item label="Hanafi" value="hanafi" />
              </Picker>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Prayer Reminders</Text>
                <Text style={styles.settingDescription}>
                  Get notified before prayer times
                </Text>
              </View>
              <Switch
                value={preferences.notifications.enabled}
                onValueChange={(value) => 
                  updatePreference({ 
                    notifications: { ...preferences.notifications, enabled: value }
                  })
                }
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={preferences.notifications.enabled ? Colors.primary : '#f4f3f4'}
              />
            </View>
          </View>

          {preferences.notifications.enabled && (
            <>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Reminder Time</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={preferences.notifications.beforeMinutes}
                    onValueChange={(value: number) => 
                      updatePreference({ 
                        notifications: { ...preferences.notifications, beforeMinutes: value }
                      })
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="5 minutes before" value={5} />
                    <Picker.Item label="10 minutes before" value={10} />
                    <Picker.Item label="15 minutes before" value={15} />
                    <Picker.Item label="20 minutes before" value={20} />
                    <Picker.Item label="30 minutes before" value={30} />
                  </Picker>
                </View>
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Sound</Text>
                    <Text style={styles.settingDescription}>
                      Play adhan sound with notifications
                    </Text>
                  </View>
                  <Switch
                    value={preferences.notifications.sound}
                    onValueChange={(value) => 
                      updatePreference({ 
                        notifications: { ...preferences.notifications, sound: value }
                      })
                    }
                    trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                    thumbColor={preferences.notifications.sound ? Colors.primary : '#f4f3f4'}
                  />
                </View>
              </View>
            </>
          )}
        </View>

        {/* Islamic Tools */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Islamic Tools</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowZakatCalculator(true)}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Zakat Calculator</Text>
                <Text style={styles.settingDescription}>
                  Calculate your Zakat obligation
                </Text>
              </View>
              <Ionicons name="calculator" size={20} color={Colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Language</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={preferences.language}
                onValueChange={(value: 'en' | 'ar') => updatePreference({ language: value })}
                style={styles.picker}
              >
                <Picker.Item label="English" value="en" />
                <Picker.Item label="Arabic" value="ar" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.settingItem, styles.dangerButton]}
            onPress={handleResetData}
          >
            <Ionicons name="refresh" size={20} color={Colors.error} />
            <Text style={styles.dangerText}>Reset All Data</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Made with ❤️ for Reverts</Text>
          </View>
          
          <Text style={styles.aboutDescription}>
            This app is designed to help new Muslims learn and practice Islam. 
            May Allah accept our efforts and guide us all on the straight path.
          </Text>
        </View>
      </ScrollView>

      {/* Zakat Calculator Modal */}
      {showZakatCalculator && (
        <View style={styles.modalOverlay}>
          <ZakatCalculator onClose={() => setShowZakatCalculator(false)} />
        </View>
      )}
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 20,
    borderBottomWidth: 8,
    borderBottomColor: Colors.divider,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  pickerContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  picker: {
    height: 50,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  dangerText: {
    fontSize: 16,
    color: Colors.error,
    marginLeft: 8,
  },
  aboutItem: {
    marginBottom: 12,
  },
  aboutLabel: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  aboutValue: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  aboutDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginTop: 8,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsScreen;