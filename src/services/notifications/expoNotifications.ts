import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { logger } from '@/services/logger';

export type AppNotificationPermission = 'granted' | 'denied' | 'undetermined' | 'unsupported';

let notificationsInitialized = false;

export function initializeNotifications() {
  if (notificationsInitialized) {
    return;
  }
  notificationsInitialized = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false
    })
  });
}

export async function getNotificationPermissionStatus(): Promise<AppNotificationPermission> {
  if (Platform.OS === 'web') {
    return 'unsupported';
  }

  const { status } = await Notifications.getPermissionsAsync();
  return status;
}

export async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.status === 'granted') {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === 'granted';
}

export async function scheduleRouteReminder(params: {
  destinationName: string;
  minutesUntilLeave: number;
}): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  const hasPermission = await ensureNotificationPermission();
  if (!hasPermission) {
    return false;
  }

  const seconds = Math.max(5, Math.floor(params.minutesUntilLeave * 60));

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Route Reminder',
      body: `Leave soon for ${params.destinationName}`
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds
    }
  });

  logger.info('Scheduled route reminder notification', {
    destinationName: params.destinationName,
    seconds
  });

  return true;
}
