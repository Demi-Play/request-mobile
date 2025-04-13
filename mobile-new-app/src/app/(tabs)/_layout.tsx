import { Tabs } from 'expo-router';
import { ICONS } from '../../assets/icons';
import { useAuth } from '../../contexts/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Заявки',
          tabBarIcon: ({ color, size }) => ICONS.ticket({ color, size }),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Чаты',
          tabBarIcon: ({ color, size }) => ICONS.chat({ color, size }),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color, size }) => ICONS.profile({ color, size }),
        }}
      />
      {user?.role === 'admin' && (
        <Tabs.Screen
          name="admin"
          options={{
            title: 'Админ',
            tabBarIcon: ({ color, size }) => ICONS.settings({ color, size }),
          }}
        />
      )}
    </Tabs>
  );
} 