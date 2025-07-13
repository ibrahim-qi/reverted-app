import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Colors } from '../constants/colors';

interface Mosque {
  id: string;
  name: string;
  address: string;
  distance: number;
  phone?: string;
  website?: string;
  prayerTimes?: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
}

export const MosqueFinder: React.FC = () => {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
        findNearbyMosques(location);
      } else {
        setError('Location permission denied. Please enable location services to find nearby mosques.');
      }
    } catch (err) {
      setError('Error accessing location. Please check your location settings.');
    }
  };

  const findNearbyMosques = async (location: Location.LocationObject) => {
    setLoading(true);
    setError(null);

    try {
      // Simulated mosque data - in a real app, this would come from an API
      const mockMosques: Mosque[] = [
        {
          id: '1',
          name: 'Islamic Center of Greater Cincinnati',
          address: '8092 Plantation Dr, West Chester, OH 45069',
          distance: 2.3,
          phone: '(513) 755-3280',
          website: 'https://icgcmasjid.org',
          prayerTimes: {
            fajr: '05:30',
            dhuhr: '13:30',
            asr: '17:00',
            maghrib: '20:15',
            isha: '21:45',
          },
        },
        {
          id: '2',
          name: 'Masjid Al-Madina',
          address: '1234 Main St, Cincinnati, OH 45202',
          distance: 4.1,
          phone: '(513) 555-0123',
          prayerTimes: {
            fajr: '05:25',
            dhuhr: '13:25',
            asr: '16:55',
            maghrib: '20:10',
            isha: '21:40',
          },
        },
        {
          id: '3',
          name: 'Islamic Center of Dayton',
          address: '26 Josie St, Dayton, OH 45403',
          distance: 8.7,
          phone: '(937) 555-0456',
          website: 'https://icdayton.org',
          prayerTimes: {
            fajr: '05:35',
            dhuhr: '13:35',
            asr: '17:05',
            maghrib: '20:20',
            isha: '21:50',
          },
        },
        {
          id: '4',
          name: 'Masjid Al-Noor',
          address: '5678 Oak Ave, Cincinnati, OH 45219',
          distance: 6.2,
          prayerTimes: {
            fajr: '05:28',
            dhuhr: '13:28',
            asr: '16:58',
            maghrib: '20:13',
            isha: '21:43',
          },
        },
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMosques(mockMosques);
    } catch (err) {
      setError('Failed to find nearby mosques. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshMosques = () => {
    if (userLocation) {
      findNearbyMosques(userLocation);
    } else {
      requestLocationPermission();
    }
  };

  const openDirections = (mosque: Mosque) => {
    // In a real app, this would open maps with directions
    console.log(`Opening directions to ${mosque.name}`);
  };

  const callMosque = (phone: string) => {
    // In a real app, this would initiate a phone call
    console.log(`Calling ${phone}`);
  };

  const openWebsite = (website: string) => {
    // In a real app, this would open the website
    console.log(`Opening ${website}`);
  };

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="location" size={48} color={Colors.error} />
          <Text style={styles.errorTitle}>Location Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshMosques}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Mosques</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={refreshMosques}>
          <Ionicons name="refresh" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Finding nearby mosques...</Text>
        </View>
      ) : (
        <ScrollView style={styles.mosqueList}>
          {mosques.map((mosque) => (
            <View key={mosque.id} style={styles.mosqueCard}>
              <View style={styles.mosqueHeader}>
                <View style={styles.mosqueInfo}>
                  <Text style={styles.mosqueName}>{mosque.name}</Text>
                  <Text style={styles.mosqueAddress}>{mosque.address}</Text>
                  <Text style={styles.mosqueDistance}>{mosque.distance} miles away</Text>
                </View>
                <TouchableOpacity 
                  style={styles.directionsButton}
                  onPress={() => openDirections(mosque)}
                >
                  <Ionicons name="navigate" size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              {mosque.prayerTimes && (
                <View style={styles.prayerTimesContainer}>
                  <Text style={styles.prayerTimesTitle}>Prayer Times</Text>
                                     <View style={styles.prayerTimesGrid}>
                     <View style={styles.prayerTimeItem}>
                       <Text style={styles.prayerLabel}>Fajr</Text>
                       <Text style={styles.prayerTimeText}>{mosque.prayerTimes.fajr}</Text>
                     </View>
                     <View style={styles.prayerTimeItem}>
                       <Text style={styles.prayerLabel}>Dhuhr</Text>
                       <Text style={styles.prayerTimeText}>{mosque.prayerTimes.dhuhr}</Text>
                     </View>
                     <View style={styles.prayerTimeItem}>
                       <Text style={styles.prayerLabel}>Asr</Text>
                       <Text style={styles.prayerTimeText}>{mosque.prayerTimes.asr}</Text>
                     </View>
                     <View style={styles.prayerTimeItem}>
                       <Text style={styles.prayerLabel}>Maghrib</Text>
                       <Text style={styles.prayerTimeText}>{mosque.prayerTimes.maghrib}</Text>
                     </View>
                     <View style={styles.prayerTimeItem}>
                       <Text style={styles.prayerLabel}>Isha</Text>
                       <Text style={styles.prayerTimeText}>{mosque.prayerTimes.isha}</Text>
                     </View>
                   </View>
                </View>
              )}

              <View style={styles.mosqueActions}>
                {mosque.phone && (
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => callMosque(mosque.phone!)}
                  >
                    <Ionicons name="call" size={16} color={Colors.primary} />
                    <Text style={styles.actionText}>Call</Text>
                  </TouchableOpacity>
                )}
                {mosque.website && (
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => openWebsite(mosque.website!)}
                  >
                    <Ionicons name="globe" size={16} color={Colors.primary} />
                    <Text style={styles.actionText}>Website</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  refreshButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  mosqueList: {
    flex: 1,
  },
  mosqueCard: {
    backgroundColor: Colors.surface,
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mosqueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mosqueInfo: {
    flex: 1,
    marginRight: 12,
  },
  mosqueName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  mosqueAddress: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  mosqueDistance: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  directionsButton: {
    padding: 8,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  prayerTimesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  prayerTimesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  prayerTimesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prayerTimeItem: {
    alignItems: 'center',
  },
  prayerLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  prayerTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  mosqueActions: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    padding: 8,
  },
  actionText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
});