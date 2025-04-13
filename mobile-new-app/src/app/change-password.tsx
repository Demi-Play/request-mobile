import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { users } from '@/services/api';
import { router } from 'expo-router';

export default function ChangePasswordScreen() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (formData.new_password !== formData.confirm_password) {
      setError('Новые пароли не совпадают');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await users.changePassword(formData.old_password, formData.new_password);
      router.back();
    } catch (err) {
      setError('Ошибка при изменении пароля');
      console.error('Error changing password:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>Изменение пароля</Text>
        
        <TextInput
          label="Текущий пароль"
          value={formData.old_password}
          onChangeText={(text: string) => setFormData({ ...formData, old_password: text })}
          style={styles.input}
          secureTextEntry
        />
        
        <TextInput
          label="Новый пароль"
          value={formData.new_password}
          onChangeText={(text: string) => setFormData({ ...formData, new_password: text })}
          style={styles.input}
          secureTextEntry
        />
        
        <TextInput
          label="Подтвердите новый пароль"
          value={formData.confirm_password}
          onChangeText={(text: string) => setFormData({ ...formData, confirm_password: text })}
          style={styles.input}
          secureTextEntry
        />

        {error ? (
          <Text style={[styles.error, { color: theme.colors.error }]}>
            {error}
          </Text>
        ) : null}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Изменить пароль
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  error: {
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
  },
}); 