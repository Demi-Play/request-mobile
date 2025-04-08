import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, ListItem, useTheme } from '@rneui/themed';
import { useAuth } from '../../src/context/AuthContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar
          size={100}
          rounded
          title={`${user?.first_name[0]}${user?.last_name[0]}`}
          containerStyle={styles.avatar}
        />
        <Text h4 style={styles.name}>
          {user?.first_name} {user?.last_name}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.role}>
          {user?.role === 'admin' ? 'Администратор' : 'Пользователь'}
        </Text>
      </View>

      <View style={styles.section}>
        <ListItem
          containerStyle={styles.listItem}
          onPress={() => router.push('/edit-profile')}
        >
          <ListItem.Content>
            <ListItem.Title>Редактировать профиль</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <ListItem
          containerStyle={styles.listItem}
          onPress={() => router.push('/change-password')}
        >
          <ListItem.Content>
            <ListItem.Title>Изменить пароль</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <ListItem
          containerStyle={styles.listItem}
          onPress={handleLogout}
        >
          <ListItem.Content>
            <ListItem.Title style={{ color: theme.colors.error }}>
              Выйти
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </View>
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
  section: {
    marginTop: 20,
  },
  listItem: {
    marginBottom: 1,
  },
}); 