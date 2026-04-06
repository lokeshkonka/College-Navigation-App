import { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { clayShadow, theme } from '@/lib/constants/theme';

type TabItem = {
  name: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  onPress: () => void;
};

interface BottomNavBarProps {
  tabs: TabItem[];
  activeTab: string;
}

export function BottomNavBar({ tabs, activeTab }: BottomNavBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + theme.spacing.lg }]}>
      <View style={styles.navBar}>
        {tabs.map((tab, index) => {
          const isActive = tab.name === activeTab;
          const isCenter = index === Math.floor(tabs.length / 2);

          if (isCenter && isActive) {
            // Center active tab gets special elevated treatment
            return (
              <Pressable
                key={tab.name}
                onPress={tab.onPress}
                style={({ pressed }) => [
                  styles.centerActiveTab,
                  pressed && styles.tabPressed
                ]}
              >
                <MaterialIcons
                  name={tab.icon}
                  size={28}
                  color={theme.colors.onTertiary}
                />
              </Pressable>
            );
          }

          return (
            <Pressable
              key={tab.name}
              onPress={tab.onPress}
              style={({ pressed }) => [
                styles.tab,
                isActive && styles.activeTab,
                pressed && styles.tabPressed
              ]}
            >
              <MaterialIcons
                name={tab.icon}
                size={isActive ? 26 : 24}
                color={isActive ? theme.colors.tertiary : theme.colors.outline}
              />
              <Text style={[
                styles.label,
                isActive && styles.activeLabel
              ]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.lg,
    backgroundColor: 'transparent',
    pointerEvents: 'box-none'
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: theme.radii['3xl'],
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    ...clayShadow,
    backdropFilter: 'blur(20px)',
    height: 72
  },
  tab: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    minWidth: 60,
    opacity: 0.6
  },
  activeTab: {
    opacity: 1
  },
  centerActiveTab: {
    width: 56,
    height: 56,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    ...clayShadow,
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12
  },
  tabPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }]
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  activeLabel: {
    color: theme.colors.tertiary,
    fontWeight: '700'
  }
});
