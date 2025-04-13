import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

type FormData = {
  username: string;
  password: string;
  email: string;
  company: string;
  phone: string;
  role: 'client';
};

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    company: '',
    phone: '',
    role: 'client' as const,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();
  const { register } = useAuth();

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    // Проверка обязательных полей
    if (!formData.username || !formData.password || !formData.email || !formData.company || !formData.phone) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        company: formData.company,
        phone: formData.phone
      });
      router.replace('/login');
    } catch (err) {
      setError('Ошибка при регистрации. Пожалуйста, попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Регистрация
          </Text>

          <TextInput
            label="Имя пользователя"
            value={formData.username}
            onChangeText={(value: string) => handleChange('username', value)}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Пароль"
            value={formData.password}
            onChangeText={(value: string) => handleChange('password', value)}
            secureTextEntry
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
          />

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(value: string) => handleChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Компания"
            value={formData.company}
            onChangeText={(value: string) => handleChange('company', value)}
            style={styles.input}
            left={<TextInput.Icon icon="office-building" />}
          />

          <TextInput
            label="Телефон"
            value={formData.phone}
            onChangeText={(value: string) => handleChange('phone', value)}
            keyboardType="phone-pad"
            style={styles.input}
            left={<TextInput.Icon icon="phone" />}
          />

          {error ? (
            <Text style={[styles.error, { color: theme.colors.error }]}>
              {error}
            </Text>
          ) : null}

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            style={styles.button}
          >
            Зарегистрироваться
          </Button>

          <Button
            mode="text"
            onPress={() => router.replace('/login')}
            style={styles.button}
          >
            Уже есть аккаунт? Войти
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 8,
  },
  error: {
    textAlign: 'center',
    marginBottom: 16,
  },
}); 