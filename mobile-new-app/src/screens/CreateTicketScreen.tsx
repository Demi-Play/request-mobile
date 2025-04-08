import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Input, Button } from '@rneui/themed';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tickets } from '../services/api';
import { router } from 'expo-router';

export default function CreateTicketScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const { mutate: createTicket, isLoading } = useMutation({
    mutationFn: () => tickets.create(title, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      router.back();
    },
    onError: (err: any) => {
      setError(err.message || 'Ошибка при создании заявки');
    },
  });

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    setError('');
    createTicket();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Input
          label="Заголовок"
          value={title}
          onChangeText={setTitle}
          placeholder="Введите заголовок заявки"
          errorMessage={error && !title.trim() ? error : ''}
        />

        <Input
          label="Описание"
          value={description}
          onChangeText={setDescription}
          placeholder="Опишите вашу проблему"
          multiline
          numberOfLines={4}
          errorMessage={error && !description.trim() ? error : ''}
        />

        <Button
          title="Создать заявку"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          containerStyle={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  submitButton: {
    marginTop: 20,
  },
}); 