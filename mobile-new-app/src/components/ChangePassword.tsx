import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { users } from '../services/api';

export const ChangePassword: React.FC = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert('Ошибка', 'Новые пароли не совпадают');
      return;
    }

    try {
      await users.changePassword(formData.oldPassword, formData.newPassword);
      Alert.alert('Успех', 'Пароль успешно изменен');
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось изменить пароль');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Текущий пароль</Text>
      <TextInput
        style={styles.input}
        value={formData.oldPassword}
        onChangeText={(text) => setFormData({ ...formData, oldPassword: text })}
        secureTextEntry
      />

      <Text style={styles.label}>Новый пароль</Text>
      <TextInput
        style={styles.input}
        value={formData.newPassword}
        onChangeText={(text) => setFormData({ ...formData, newPassword: text })}
        secureTextEntry
      />

      <Text style={styles.label}>Подтвердите новый пароль</Text>
      <TextInput
        style={styles.input}
        value={formData.confirmPassword}
        onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Изменить пароль</Text>
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