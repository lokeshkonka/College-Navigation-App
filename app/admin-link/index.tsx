import { useEffect } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/lib/constants/theme';

export default function AdminLinkScreen() {
  useEffect(() => {
    router.replace('/admin');
  }, []);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Redirecting to Admin Console...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg
  },
  title: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: '700'
  }
});
