import { useEffect } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/lib/constants/theme';

export default function AdminTabEntryScreen() {
  useEffect(() => {
    router.replace('/admin');
  }, []);

  return (
    <View style={styles.root}>
      <Text style={styles.text}>Opening Admin Console...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg
  },
  text: {
    color: theme.colors.primary,
    fontWeight: '700'
  }
});
