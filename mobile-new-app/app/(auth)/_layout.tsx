import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function AuthLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.onBackground,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: 'Вход',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Регистрация',
        }}
      />
    </Stack>
  );
} 