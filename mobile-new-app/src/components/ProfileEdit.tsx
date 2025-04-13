import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { users } from '../services/api';
import { User, UserUpdateData } from '../types';

interface ProfileEditProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

export const ProfileEdit: React.FC<ProfileEditProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState<UserUpdateData>({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    company: user.company,
    phone: user.phone,
  });

  const handleUpdate = async () => {
    try {
      const updatedUser = await users.updateProfile(formData);
      onUpdate(updatedUser);
      Alert.alert('Успех', 'Профиль успешно обновлен');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось обновить профиль');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Имя</Text>
      <TextInput
        style={styles.input}
        value={formData.first_name}
        onChangeText={(text) => setFormData({ ...formData, first_name: text })}
      />

      <Text style={styles.label}>Фамилия</Text>
      <TextInput
        style={styles.input}
        value={formData.last_name}
        onChangeText={(text) => setFormData({ ...formData, last_name: text })}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Компания</Text>
      <TextInput
        style={styles.input}
        value={formData.company}
        onChangeText={(text) => setFormData({ ...formData, company: text })}
      />

      <Text style={styles.label}>Телефон</Text>
      <TextInput
        style={styles.input}
        value={formData.phone}
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Сохранить изменения</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 