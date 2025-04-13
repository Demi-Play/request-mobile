import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, List, useTheme } from 'react-native-paper';
import type { IconProps } from 'react-native-paper/lib/typescript/components/MaterialCommunityIcon';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const getInitials = () => {
    if (!user?.first_name || !user?.last_name) {
      return user?.username?.[0]?.toUpperCase() || '?';
    }
    return `${user.first_name[0]}${user.last_name[0]}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={100}
          label={getInitials()}
          style={styles.avatar}
        />
        <Text variant="headlineMedium" style={styles.name}>
          {user?.first_name && user?.last_name 
            ? `${user.first_name} ${user.last_name}`
            : user?.username || 'Пользователь'}
        </Text>
        <Text variant="bodyLarge" style={styles.email}>{user?.email || 'Email не указан'}</Text>
        <Text variant="bodyLarge" style={styles.role}>
          {user?.role === 'admin' ? 'Администратор' : 'Пользователь'}
        </Text>
      </View>

      <List.Section>
        <List.Item
          title="Редактировать профиль"
          left={(props: IconProps) => <List.Icon {...props} icon="account-edit" />}
          onPress={() => router.push('/edit-profile')}
        />
        <List.Item
          title="Изменить пароль"
          left={(props: IconProps) => <List.Icon {...props} icon="lock" />}
          onPress={() => router.push('/change-password')}
        />
        <List.Item
          title="Выйти"
          left={(props: IconProps) => <List.Icon {...props} icon="logout" color={theme.colors.error} />}
          titleStyle={{ color: theme.colors.error }}
          onPress={handleLogout}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    marginBottom: 16,
    backgroundColor: '#007AFF',
  },
  name: {
    marginBottom: 8,
  },
  email: {
    color: '#666',
    marginBottom: 4,
  },
  role: {
    color: '#666',
  },
}); 