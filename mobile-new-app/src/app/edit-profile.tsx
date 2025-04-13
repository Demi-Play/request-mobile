import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { users } from '@/services/api';
import { router } from 'expo-router';

export default function EditProfileScreen() {
  const theme = useTheme();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      const updatedUser = await users.updateProfile(formData);
      updateUser(updatedUser);
      router.back();
    } catch (err) {
      setError('Ошибка при обновлении профиля');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>Редактирование профиля</Text>
        
        <TextInput
          label="Имя"
          value={formData.first_name}
          onChangeText={(text: string) => setFormData({ ...formData, first_name: text })}
          style={styles.input}
        />
        
        <TextInput
          label="Фамилия"
          value={formData.last_name}
          onChangeText={(text: string) => setFormData({ ...formData, last_name: text })}
          style={styles.input}
        />
        
        <TextInput
          label="Email"
          value={formData.email}
          onChangeText={(text: string) => setFormData({ ...formData, email: text })}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          label="Телефон"
          value={formData.phone}
          onChangeText={(text: string) => setFormData({ ...formData, phone: text })}
          style={styles.input}
          keyboardType="phone-pad"
        />
        
        <TextInput
          label="Компания"
          value={formData.company}
          onChangeText={(text: string) => setFormData({ ...formData, company: text })}
          style={styles.input}
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
          Сохранить
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