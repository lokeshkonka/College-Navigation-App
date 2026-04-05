import { MaterialIcons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { ClayCard } from '@/components/ui/ClayCard';
import { FloatingHeader } from '@/components/ui/FloatingHeader';
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

  const { data, isPending, isError } = useQuery({
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

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/sign-in');
  };

  if (isPending) {
    return (
      <View style={styles.root}>
        <FloatingHeader title="Tactile Cartographer" showMenu={false} showProfile={false} />
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.root}>
        <FloatingHeader title="Tactile Cartographer" showMenu={false} showProfile={false} />
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Unable to load profile</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <FloatingHeader title="Tactile Cartographer" showMenu={false} showProfile={false} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <ClayCard style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <MaterialIcons name="person" size={48} color={theme.colors.primary} />
              <View style={styles.statusBadge}>
                <MaterialIcons name="check" size={12} color="#ffffff" />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{data?.full_name ?? 'Campus User'}</Text>
              <Text style={styles.role}>{data?.role ?? 'student'}</Text>
            </View>
          </View>
        </ClayCard>

        {/* Dark Mode Toggle */}
        <ClayCard style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <MaterialIcons name="dark-mode" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Switch to a darker interface for low-light campus walking.
              </Text>
            </View>
            <Switch
              onValueChange={() => {}}
              value={false}
              trackColor={{ false: theme.colors.surfaceContainerHigh, true: theme.colors.tertiary }}
              thumbColor="#ffffff"
            />
          </View>
        </ClayCard>

        {/* Accessibility Toggle */}
        <ClayCard style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <MaterialIcons name="accessibility" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Accessibility</Text>
              <Text style={styles.settingDescription}>
                Enable high-contrast markers and wheelchair-accessible routing.
              </Text>
            </View>
            <Switch
              onValueChange={(next) => toggle('highContrast', next)}
              value={Boolean(prefs.highContrast)}
              trackColor={{ false: theme.colors.surfaceContainerHigh, true: theme.colors.tertiary }}
              thumbColor="#ffffff"
            />
          </View>
        </ClayCard>

        {/* Preferences & Privacy Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Preferences & Privacy</Text>
        </View>

        {/* Notifications */}
        <Pressable onPress={() => {}}>
          <ClayCard style={styles.menuCard}>
            <View style={styles.menuRow}>
              <View style={styles.menuIcon}>
                <MaterialIcons name="notifications" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Notifications</Text>
                <Text style={styles.menuSubtitle}>Arrival alerts and route changes</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={theme.colors.outlineVariant} />
            </View>
          </ClayCard>
        </Pressable>

        {/* Location History */}
        <Pressable onPress={() => {}}>
          <ClayCard style={styles.menuCard}>
            <View style={styles.menuRow}>
              <View style={styles.menuIcon}>
                <MaterialIcons name="location-on" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Location History</Text>
                <Text style={styles.menuSubtitle}>Manage your saved frequent spots</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={theme.colors.outlineVariant} />
            </View>
          </ClayCard>
        </Pressable>

        {/* Security */}
        <Pressable onPress={() => {}}>
          <ClayCard style={styles.menuCard}>
            <View style={styles.menuRow}>
              <View style={styles.menuIcon}>
                <MaterialIcons name="security" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>Security</Text>
                <Text style={styles.menuSubtitle}>Two-factor and login history</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={theme.colors.outlineVariant} />
            </View>
          </ClayCard>
        </Pressable>

        {/* Send Feedback */}
        <ClayCard style={styles.actionCard} onPress={() => router.push('/feedback')}>
          <View style={styles.actionContent}>
            <View style={styles.feedbackIconContainer}>
              <MaterialIcons name="chat" size={28} color={theme.colors.tertiary} />
            </View>
            <View>
              <Text style={styles.actionTitle}>Send Feedback</Text>
              <Text style={styles.actionSubtitle}>Help us improve the map</Text>
            </View>
          </View>
        </ClayCard>

        {/* Admin Console */}
        {data && isAdminRole(data.role) && (
          <Button
            onPress={() => router.push('/admin')}
            variant="tertiary"
            icon="admin-panel-settings"
            fullWidth
            style={styles.adminButton}
          >
            Open Admin Console
          </Button>
        )}

        {/* Sign Out */}
        <ClayCard style={styles.signOutCard} onPress={handleSignOut}>
          <View style={styles.actionContent}>
            <View style={styles.signOutIconContainer}>
              <MaterialIcons name="logout" size={28} color={theme.colors.error} />
            </View>
            <View>
              <Text style={styles.signOutTitle}>Sign Out</Text>
              <Text style={styles.signOutSubtitle}>Securely exit your session</Text>
            </View>
          </View>
        </ClayCard>

        {/* App Version */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>TACTILE CARTOGRAPHER V2.4.1</Text>
          <Text style={styles.footerSubtext}>Crafted with precision for campus explorers</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingTop: 110,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: 120
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.screenPadding
  },
  stateText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center'
  },
  profileCard: {
    marginBottom: theme.spacing['4xl']
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 3,
    borderColor: theme.colors.surfaceContainerLowest
  },
  statusBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surfaceContainerLowest
  },
  profileInfo: {
    flex: 1
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs
  },
  role: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant,
    textTransform: 'capitalize'
  },
  settingCard: {
    marginBottom: theme.spacing.xl
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4
  },
  settingContent: {
    flex: 1
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs
  },
  settingDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: theme.colors.onSurfaceVariant,
    lineHeight: 18
  },
  sectionHeader: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 1.5
  },
  menuCard: {
    marginBottom: theme.spacing.md
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuContent: {
    flex: 1
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 2
  },
  menuSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: theme.colors.onSurfaceVariant
  },
  actionCard: {
    marginTop: theme.spacing['3xl'],
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surfaceContainerLowest
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg
  },
  feedbackIconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.tertiaryContainer,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs
  },
  actionSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant
  },
  adminButton: {
    marginBottom: theme.spacing.lg
  },
  signOutCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    marginBottom: theme.spacing['4xl']
  },
  signOutIconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9
  },
  signOutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs
  },
  signOutSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl
  },
  footerText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.outline,
    letterSpacing: 1.5,
    marginBottom: theme.spacing.xs
  },
  footerSubtext: {
    fontSize: 11,
    fontWeight: '400',
    color: theme.colors.outlineVariant,
    textAlign: 'center'
  }
});
