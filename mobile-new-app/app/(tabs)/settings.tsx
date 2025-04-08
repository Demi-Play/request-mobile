import React, { useState } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { Text, ListItem, useTheme } from '@rneui/themed';
import { useAuth } from '../../src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem('notifications_enabled', value.toString());
  };

  const toggleDarkMode = async (value: boolean) => {
    setDarkMode(value);
    await AsyncStorage.setItem('dark_mode', value.toString());
    // Здесь нужно будет добавить логику для изменения темы приложения
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Уведомления</Text>
        <ListItem containerStyle={styles.listItem}>
          <ListItem.Content>
            <ListItem.Title>Push-уведомления</ListItem.Title>
            <ListItem.Subtitle>
              Получать уведомления о новых сообщениях и обновлениях тикетов
            </ListItem.Subtitle>
          </ListItem.Content>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
          />
        </ListItem>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Внешний вид</Text>
        <ListItem containerStyle={styles.listItem}>
          <ListItem.Content>
            <ListItem.Title>Темная тема</ListItem.Title>
            <ListItem.Subtitle>
              Включить темную тему приложения
            </ListItem.Subtitle>
          </ListItem.Content>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
          />
        </ListItem>
      </View>

      {user?.role === 'admin' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Административные настройки</Text>
          <ListItem containerStyle={styles.listItem}>
            <ListItem.Content>
              <ListItem.Title>Управление пользователями</ListItem.Title>
              <ListItem.Subtitle>
                Просмотр и управление пользователями системы
              </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
          <ListItem containerStyle={styles.listItem}>
            <ListItem.Content>
              <ListItem.Title>Статистика</ListItem.Title>
              <ListItem.Subtitle>
                Просмотр статистики по тикетам и пользователям
              </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>О приложении</Text>
        <ListItem containerStyle={styles.listItem}>
          <ListItem.Content>
            <ListItem.Title>Версия</ListItem.Title>
            <ListItem.Subtitle>1.0.0</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
        <ListItem containerStyle={styles.listItem}>
          <ListItem.Content>
            <ListItem.Title>Лицензионное соглашение</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem containerStyle={styles.listItem}>
          <ListItem.Content>
            <ListItem.Title>Политика конфиденциальности</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 8,
    color: '#666',
  },
  listItem: {
    marginBottom: 1,
  },
}); 