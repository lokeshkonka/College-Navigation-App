import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { ClayCard } from '@/components/ui/ClayCard';
import { signOut } from '@/features/auth/api/authApi';
import { getProfile, updateProfilePrefs } from '@/features/profile/api/profileApi';
import { isAdminRole } from '@/lib/auth';
import { theme } from '@/lib/constants/theme';
import {
  ensureNotificationPermission,
  getNotificationPermissionStatus,
  type AppNotificationPermission
} from '@/services/notifications/expoNotifications';

export default function ProfileScreen() {
  const queryClient = useQueryClient();
  const [notificationPermission, setNotificationPermission] = useState<AppNotificationPermission>('undetermined');

  useEffect(() => {
    getNotificationPermissionStatus()
      .then((status) => setNotificationPermission(status))
      .catch(() => setNotificationPermission('undetermined'));
  }, []);

  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 2 * 60_000
  });

  const mutation = useMutation({
    mutationFn: updateProfilePrefs,
    onSuccess: (nextPrefs) => {
      queryClient.setQueryData(['profile'], (previous: Awaited<ReturnType<typeof getProfile>> | undefined) => {
        if (!previous) {
          return previous;
        }
        return {
          ...previous,
          accessibility_prefs: nextPrefs
        };
      });
    }
  });

  const prefs = data?.accessibility_prefs ?? {};

  const toggle = (key: 'highContrast' | 'largerText' | 'notificationsEnabled', value: boolean) => {
    mutation.mutate({ [key]: value });
  };

  const toggleNotifications = async (next: boolean) => {
    if (!next) {
      toggle('notificationsEnabled', false);
      return;
    }

    const granted = await ensureNotificationPermission();
    setNotificationPermission(granted ? 'granted' : 'denied');
    toggle('notificationsEnabled', granted);
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Profile Settings</Text>
      <ClayCard>
        <Text style={styles.name}>{data?.full_name ?? 'Campus User'}</Text>
        <Text style={styles.role}>{data?.role ?? 'student'}</Text>
      </ClayCard>

      <ClayCard style={styles.prefsCard}>
        <PreferenceRow
          label="High Contrast"
          value={Boolean(prefs.highContrast)}
          onValueChange={(next) => toggle('highContrast', next)}
        />
        <PreferenceRow
          label="Larger Text"
          value={Boolean(prefs.largerText)}
          onValueChange={(next) => toggle('largerText', next)}
        />
        <PreferenceRow
          label="Notifications"
          value={Boolean(prefs.notificationsEnabled)}
          onValueChange={(next) => {
            void toggleNotifications(next);
          }}
        />
        <Text style={styles.permissionText}>Notification permission: {notificationPermission}</Text>
      </ClayCard>

      <Pressable onPress={() => router.push('/feedback')} style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Send Feedback</Text>
      </Pressable>

      {data && isAdminRole(data.role) ? (
        <Pressable onPress={() => router.push('/admin')} style={styles.adminButton}>
          <Text style={styles.adminButtonText}>Open Admin Console</Text>
        </Pressable>
      ) : null}

      <Pressable
        onPress={async () => {
          await signOut();
          router.replace('/(auth)/sign-in');
        }}
        style={styles.signOutButton}
      >
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

function PreferenceRow({
  label,
  value,
  onValueChange
}: {
  label: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
}) {
  return (
    <View style={styles.prefRow}>
      <Text style={styles.prefLabel}>{label}</Text>
      <Switch onValueChange={onValueChange} value={value} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.background,
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.section
  },
  title: {
    color: theme.colors.primary,
    fontSize: 30,
    fontWeight: '900',
    marginBottom: theme.spacing.lg
  },
  name: {
    color: theme.colors.primary,
    fontSize: 22,
    fontWeight: '800'
  },
  role: {
    color: theme.colors.textMuted,
    marginTop: 4,
    textTransform: 'capitalize'
  },
  prefsCard: {
    marginTop: theme.spacing.lg
  },
  prefRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md
  },
  prefLabel: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600'
  },
  permissionText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
    textTransform: 'capitalize'
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSunken,
    borderRadius: theme.radii.pill,
    marginTop: theme.spacing.section,
    paddingVertical: theme.spacing.md
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontWeight: '700'
  },
  adminButton: {
    alignItems: 'center',
    backgroundColor: '#d1fadf',
    borderRadius: theme.radii.pill,
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.md
  },
  adminButtonText: {
    color: theme.colors.tertiary,
    fontWeight: '800'
  },
  signOutButton: {
    alignItems: 'center',
    backgroundColor: '#fee4e2',
    borderRadius: theme.radii.pill,
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.md
  },
  signOutButtonText: {
    color: theme.colors.danger,
    fontWeight: '800'
  }
});
