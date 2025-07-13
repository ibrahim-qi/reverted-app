import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { UserPreferences } from '../types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return false;
    }
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('prayer-reminders', {
        name: 'Prayer Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

export async function schedulePrayerNotification(
  prayerName: string,
  prayerTime: string,
  preferences: UserPreferences
): Promise<string | null> {
  try {
    if (!preferences.notifications.enabled) {
      return null;
    }

    const [hours, minutes] = prayerTime.split(':').map(Number);
    const notificationTime = new Date();
    notificationTime.setHours(hours, minutes - preferences.notifications.beforeMinutes, 0, 0);
    
    // If the time has already passed today, schedule for tomorrow
    if (notificationTime <= new Date()) {
      notificationTime.setDate(notificationTime.getDate() + 1);
    }

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: `🕌 ${prayerName} Prayer Time`,
        body: `It's time for ${prayerName} prayer. May Allah accept your prayers.`,
        sound: preferences.notifications.sound ? 'default' : undefined,
        data: { prayerName, prayerTime },
      },
      trigger: {
        date: notificationTime,
        repeats: false,
      },
    });

    return identifier;
  } catch (error) {
    console.error('Error scheduling prayer notification:', error);
    return null;
  }
}

export async function scheduleAllPrayerNotifications(
  prayerTimes: Record<string, string>,
  preferences: UserPreferences
): Promise<void> {
  try {
    // Cancel existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Schedule new notifications
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    
    for (const prayer of prayers) {
      const time = prayerTimes[prayer.toLowerCase()];
      if (time) {
        await schedulePrayerNotification(prayer, time, preferences);
      }
    }
  } catch (error) {
    console.error('Error scheduling all prayer notifications:', error);
  }
}

export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling notifications:', error);
  }
}

export async function getNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error getting notification permissions:', error);
    return false;
  }
}