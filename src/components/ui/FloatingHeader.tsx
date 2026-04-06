import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { glassEffect, theme } from '@/lib/constants/theme';

interface FloatingHeaderProps {
  title?: string;
  showMenu?: boolean;
  showProfile?: boolean;
  showBack?: boolean;
  onMenuPress?: () => void;
  onProfilePress?: () => void;
  onBackPress?: () => void;
  profileImageUrl?: string;
}

export function FloatingHeader({
  title = 'Tactile Cartographer',
  showMenu = true,
  showProfile = true,
  showBack = false,
  onMenuPress,
  onProfilePress,
  onBackPress,
  profileImageUrl
}: FloatingHeaderProps) {
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress();
    }
  };

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      router.push('/(tabs)/profile');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + theme.spacing.md }]}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showBack && (
            <Pressable
              onPress={handleBackPress}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.iconButtonPressed
              ]}
            >
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={theme.colors.primary}
              />
            </Pressable>
          )}
          {showMenu && !showBack && (
            <Pressable
              onPress={handleMenuPress}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.iconButtonPressed
              ]}
            >
              <MaterialIcons
                name="menu"
                size={24}
                color={theme.colors.primary}
              />
            </Pressable>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
        {showProfile && (
          <Pressable
            onPress={handleProfilePress}
            style={({ pressed }) => [
              styles.profileButton,
              pressed && styles.profileButtonPressed
            ]}
          >
            {profileImageUrl ? (
              <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <MaterialIcons
                  name="person"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    ...glassEffect,
    borderBottomLeftRadius: theme.radii['2xl'],
    borderBottomRightRadius: theme.radii['2xl']
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: theme.spacing.lg
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  iconButtonPressed: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    transform: [{ scale: 0.95 }]
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: -0.5,
    flex: 1
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.full,
    overflow: 'hidden',
    backgroundColor: theme.colors.primaryFixed,
    borderWidth: 2,
    borderColor: theme.colors.surfaceContainerLowest
  },
  profileButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }]
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  profilePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryFixed
  }
});
