import { PrayerTimes, Location, CalculationMethod } from '../types';
import { format } from 'date-fns';

// Prayer time calculation parameters for different methods
const CALCULATION_PARAMS = {
  [CalculationMethod.MWL]: { fajr: 18, isha: 17 },
  [CalculationMethod.ISNA]: { fajr: 15, isha: 15 },
  [CalculationMethod.Egypt]: { fajr: 19.5, isha: 17.5 },
  [CalculationMethod.Makkah]: { fajr: 18.5, isha: 90 }, // 90 min after Maghrib
  [CalculationMethod.Karachi]: { fajr: 18, isha: 18 },
  [CalculationMethod.Tehran]: { fajr: 17.7, isha: 14 },
  [CalculationMethod.Jafari]: { fajr: 16, isha: 14 },
};

export function calculatePrayerTimes(
  date: Date,
  location: Location,
  method: CalculationMethod = CalculationMethod.MWL
): PrayerTimes {
  const julianDate = getJulianDate(date);
  const sunPosition = calculateSunPosition(julianDate, location);
  const params = CALCULATION_PARAMS[method];
  
  // Calculate prayer times
  const times = {
    fajr: calculateTime(sunPosition.sunrise, -params.fajr, sunPosition.declination, location.latitude),
    sunrise: formatTime(sunPosition.sunrise),
    dhuhr: formatTime(sunPosition.noon),
    asr: calculateAsrTime(sunPosition.noon, sunPosition.declination, location.latitude),
    maghrib: formatTime(sunPosition.sunset),
    isha: method === CalculationMethod.Makkah 
      ? calculateTime(sunPosition.sunset, 90 / 60, 0, 0)
      : calculateTime(sunPosition.sunset, params.isha, sunPosition.declination, location.latitude),
  };
  
  return times;
}

function getJulianDate(date: Date): number {
  const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
  const y = date.getFullYear() + 4800 - a;
  const m = (date.getMonth() + 1) + 12 * a - 3;
  
  return date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + 
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function calculateSunPosition(julianDate: number, location: Location) {
  const D = julianDate - 2451545.0;
  const g = 357.529 + 0.98560028 * D;
  const q = 280.459 + 0.98564736 * D;
  const L = q + 1.915 * Math.sin(deg2rad(g)) + 0.020 * Math.sin(deg2rad(2 * g));
  
  const e = 23.439 - 0.00000036 * D;
  const declination = Math.asin(Math.sin(deg2rad(e)) * Math.sin(deg2rad(L)));
  
  const RA = Math.atan2(Math.cos(deg2rad(e)) * Math.sin(deg2rad(L)), Math.cos(deg2rad(L))) / 15;
  const equation = q / 15 - RA;
  
  const noon = 12 - equation - location.longitude / 15;
  const sunrise = noon - calculateHourAngle(declination, location.latitude, -0.833) / 15;
  const sunset = noon + calculateHourAngle(declination, location.latitude, -0.833) / 15;
  
  return { sunrise, noon, sunset, declination };
}

function calculateHourAngle(declination: number, latitude: number, angle: number): number {
  const latRad = deg2rad(latitude);
  const angleRad = deg2rad(angle);
  
  return rad2deg(Math.acos(
    (Math.sin(angleRad) - Math.sin(declination) * Math.sin(latRad)) /
    (Math.cos(declination) * Math.cos(latRad))
  ));
}

function calculateTime(base: number, angle: number, declination: number, latitude: number): string {
  const hourAngle = calculateHourAngle(declination, latitude, -angle);
  const time = base + (angle > 0 ? hourAngle : -hourAngle) / 15;
  return formatTime(time);
}

function calculateAsrTime(noon: number, declination: number, latitude: number): string {
  const shadowRatio = 1; // Shafi'i method
  const latRad = deg2rad(latitude);
  const angle = -rad2deg(Math.atan(1 / (shadowRatio + Math.tan(Math.abs(latitude - rad2deg(declination))))));
  const hourAngle = calculateHourAngle(declination, latitude, angle);
  return formatTime(noon + hourAngle / 15);
}

function formatTime(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  const adjustedH = h % 24;
  const adjustedM = m % 60;
  
  return `${adjustedH.toString().padStart(2, '0')}:${adjustedM.toString().padStart(2, '0')}`;
}

function deg2rad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function rad2deg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function getQiblaDirection(location: Location): number {
  // Kaaba coordinates
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;
  
  const lat1 = deg2rad(location.latitude);
  const lat2 = deg2rad(kaabaLat);
  const deltaLng = deg2rad(kaabaLng - location.longitude);
  
  const x = Math.sin(deltaLng) * Math.cos(lat2);
  const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
  
  const bearing = Math.atan2(x, y);
  return (rad2deg(bearing) + 360) % 360;
}

export function getNextPrayer(prayerTimes: PrayerTimes): { name: string; time: string } {
  const now = new Date();
  const currentTime = format(now, 'HH:mm');
  
  const prayers = [
    { name: 'Fajr', time: prayerTimes.fajr },
    { name: 'Dhuhr', time: prayerTimes.dhuhr },
    { name: 'Asr', time: prayerTimes.asr },
    { name: 'Maghrib', time: prayerTimes.maghrib },
    { name: 'Isha', time: prayerTimes.isha },
  ];
  
  for (const prayer of prayers) {
    if (prayer.time > currentTime) {
      return prayer;
    }
  }
  
  return { name: 'Fajr', time: prayerTimes.fajr };
}