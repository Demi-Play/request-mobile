import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useAuth } from '../../src/context/AuthContext';

export default function TabsIndexScreen() {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.greeting}>
          Привет, {user?.username || 'Гость'}!
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Добро пожаловать в систему поддержки
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
  },
});