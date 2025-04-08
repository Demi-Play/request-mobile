import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useAuth } from '../../src/context/AuthContext';

export default function TabsIndexScreen() {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Привет, {user?.username || 'Гость'}!</Text>
        <Text style={styles.subtitle}>Добро пожаловать в систему поддержки</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});