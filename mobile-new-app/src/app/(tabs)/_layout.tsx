import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { ICONS } from '@/assets/icons';

type TabBarIconProps = {
  color: string;
  size: number;
};

export default function TabLayout() {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.onBackground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Заявки',
          tabBarIcon: ({ color, size }: TabBarIconProps) => ICONS.ticket(color, size),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Чаты',
          tabBarIcon: ({ color, size }: TabBarIconProps) => ICONS.chat(color, size),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color, size }: TabBarIconProps) => ICONS.profile(color, size),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Настройки',
          tabBarIcon: ({ color, size }: TabBarIconProps) => ICONS.settings(color, size),
        }}
      />
    </Tabs>
  );
} 