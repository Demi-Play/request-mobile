import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

type TabBarIconProps = {
  color: string;
  size: number;
};

export default function TabLayout() {
  const theme = useTheme();

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
          title: 'Тикеты',
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color, size }: TabBarIconProps) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 