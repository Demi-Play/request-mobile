import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, List, Switch, useTheme } from 'react-native-paper';
import type { IconProps } from 'react-native-paper/lib/typescript/components/MaterialCommunityIcon';
import { useAuth } from '../../src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  // const theme = useTheme();
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  // const [darkMode, setDarkMode] = useState(false);

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem('notifications_enabled', value.toString());
  };

  // const toggleDarkMode = async (value: boolean) => {
  //   setDarkMode(value);
  //   await AsyncStorage.setItem('dark_mode', value.toString());
  //   // Здесь нужно будет добавить логику для изменения темы приложения
  // };

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader>Уведомления</List.Subheader>
        <List.Item
          title="Push-уведомления"
          description="Получать уведомления о новых сообщениях и обновлениях тикетов"
          right={() => (
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
            />
          )}
        />
      </List.Section>

      {/* <List.Section>
        <List.Subheader>Внешний вид</List.Subheader>
        <List.Item
          title="Темная тема"
          description="Включить темную тему приложения"
          right={() => (
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
            />
          )}
        />
      </List.Section> */}

      {user?.role === 'admin' && (
        <List.Section>
          <List.Subheader>Административные настройки</List.Subheader>
          <List.Item
            title="Управление пользователями"
            description="Просмотр и управление пользователями системы"
            left={(props: IconProps) => <List.Icon {...props} icon="account-group" />}
          />
          <List.Item
            title="Статистика"
            description="Просмотр статистики по тикетам и пользователям"
            left={(props: IconProps) => <List.Icon {...props} icon="chart-bar" />}
          />
        </List.Section>
      )}

      <List.Section>
        <List.Subheader>О приложении</List.Subheader>
        <List.Item
          title="Версия"
          description="1.0.0"
          left={(props: IconProps) => <List.Icon {...props} icon="information" />}
        />
        <List.Item
          title="Лицензионное соглашение"
          left={(props: IconProps) => <List.Icon {...props} icon="file-document" />}
        />
        <List.Item
          title="Политика конфиденциальности"
          left={(props: IconProps) => <List.Icon {...props} icon="shield-lock" />}
        />
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 