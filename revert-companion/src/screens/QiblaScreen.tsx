import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';

import { Colors } from '../constants/colors';
import { getQiblaDirection } from '../utils/prayerCalculations';
import { getUserLocation, saveUserLocation } from '../utils/storage';
import { Location as LocationType } from '../types';
import { GradientCard } from '../components/GradientCard';

const { width } = Dimensions.get('window');
const COMPASS_SIZE = width * 0.8;
const COMPASS_RADIUS = COMPASS_SIZE / 2;

const QiblaScreen: React.FC = () => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number>(0);
  const [magnetometer, setMagnetometer] = useState<number>(0);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    loadLocation();
    startMagnetometer();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const loadLocation = async () => {
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
      const direction = getQiblaDirection(userLocation);
      setQiblaDirection(direction);
    } catch (error) {
      console.error('Error loading location:', error);
    }
  };

  const startMagnetometer = async () => {
    try {
      const { status } = await Magnetometer.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access magnetometer was denied');
        return;
      }

      Magnetometer.setUpdateInterval(100);
      
      const sub = Magnetometer.addListener((data) => {
        let angle = Math.atan2(data.y, data.x);
        angle = angle * (180 / Math.PI);
        angle = angle + 90;
        angle = (angle + 360) % 360;
        
        setMagnetometer(Math.round(angle));
      });

      setSubscription(sub);
    } catch (error) {
      console.error('Error starting magnetometer:', error);
    }
  };

  const getCompassRotation = () => {
    return -magnetometer;
  };

  const getQiblaRotation = () => {
    return qiblaDirection - magnetometer;
  };

  const renderCompassMarks = () => {
    const marks = [];
    
    for (let i = 0; i < 360; i += 30) {
      const angle = (i * Math.PI) / 180;
      const isMainDirection = i % 90 === 0;
      const markLength = isMainDirection ? 20 : 10;
      
      const x1 = COMPASS_RADIUS + (COMPASS_RADIUS - 10) * Math.cos(angle - Math.PI / 2);
      const y1 = COMPASS_RADIUS + (COMPASS_RADIUS - 10) * Math.sin(angle - Math.PI / 2);
      const x2 = COMPASS_RADIUS + (COMPASS_RADIUS - 10 - markLength) * Math.cos(angle - Math.PI / 2);
      const y2 = COMPASS_RADIUS + (COMPASS_RADIUS - 10 - markLength) * Math.sin(angle - Math.PI / 2);
      
      marks.push(
        <Line
          key={`mark-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={Colors.text.secondary}
          strokeWidth={isMainDirection ? 2 : 1}
        />
      );
      
      if (isMainDirection) {
        const direction = i === 0 ? 'N' : i === 90 ? 'E' : i === 180 ? 'S' : 'W';
        const textX = COMPASS_RADIUS + (COMPASS_RADIUS - 40) * Math.cos(angle - Math.PI / 2);
        const textY = COMPASS_RADIUS + (COMPASS_RADIUS - 40) * Math.sin(angle - Math.PI / 2);
        
        marks.push(
          <SvgText
            key={`text-${i}`}
            x={textX}
            y={textY + 5}
            fill={Colors.text.primary}
            fontSize="18"
            fontWeight="bold"
            textAnchor="middle"
          >
            {direction}
          </SvgText>
        );
      }
    }
    
    return marks;
  };

  const renderQiblaPointer = () => {
    const angle = (getQiblaRotation() * Math.PI) / 180;
    const pointerLength = COMPASS_RADIUS - 30;
    
    const x = COMPASS_RADIUS + pointerLength * Math.cos(angle - Math.PI / 2);
    const y = COMPASS_RADIUS + pointerLength * Math.sin(angle - Math.PI / 2);
    
    return (
      <G>
        <Line
          x1={COMPASS_RADIUS}
          y1={COMPASS_RADIUS}
          x2={x}
          y2={y}
          stroke={Colors.secondary}
          strokeWidth={4}
        />
        <Circle
          cx={x}
          cy={y}
          r={15}
          fill={Colors.secondary}
        />
        <SvgText
          x={x}
          y={y + 5}
          fill={Colors.text.light}
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
        >
          Q
        </SvgText>
      </G>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Qibla Direction</Text>
        <Text style={styles.subtitle}>
          Face the Kaaba for your prayers
        </Text>

        <View style={styles.compassContainer}>
          <Svg width={COMPASS_SIZE} height={COMPASS_SIZE}>
            <G transform={`rotate(${getCompassRotation()} ${COMPASS_RADIUS} ${COMPASS_RADIUS})`}>
              <Circle
                cx={COMPASS_RADIUS}
                cy={COMPASS_RADIUS}
                r={COMPASS_RADIUS - 5}
                fill={Colors.surface}
                stroke={Colors.border}
                strokeWidth={2}
              />
              {renderCompassMarks()}
            </G>
            {renderQiblaPointer()}
            <Circle
              cx={COMPASS_RADIUS}
              cy={COMPASS_RADIUS}
              r={10}
              fill={Colors.primary}
            />
          </Svg>
        </View>

        <GradientCard
          colors={[Colors.primary, Colors.primaryLight]}
          style={styles.infoCard}
        >
          <Text style={styles.infoTitle}>Qibla Direction</Text>
          <Text style={styles.infoValue}>{Math.round(qiblaDirection)}°</Text>
          <Text style={styles.infoLabel}>from North</Text>
        </GradientCard>

        {location && (
          <View style={styles.locationInfo}>
            <Text style={styles.locationText}>
              Your Location: {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
            </Text>
            <Text style={styles.distanceText}>
              Distance to Kaaba: {calculateDistance(location)} km
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const calculateDistance = (location: LocationType): string => {
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;
  
  const R = 6371; // Earth's radius in km
  const dLat = ((kaabaLat - location.latitude) * Math.PI) / 180;
  const dLon = ((kaabaLng - location.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((location.latitude * Math.PI) / 180) *
      Math.cos((kaabaLat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance.toFixed(0);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 8,
    marginBottom: 30,
  },
  compassContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  infoCard: {
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  infoTitle: {
    fontSize: 16,
    color: Colors.text.light,
    opacity: 0.9,
  },
  infoValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.text.light,
    marginTop: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.text.light,
    opacity: 0.8,
    marginTop: 4,
  },
  locationInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  distanceText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
});

export default QiblaScreen;