import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';
import { useAuth } from '../../src/contexts/AuthContext';
import { TicketList } from '../../src/components/TicketList';
import { router } from 'expo-router';

export default function AdminScreen() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return (
      <View style={styles.container}>
        <Title>Доступ запрещен</Title>
      </View>
    );
  }

  const handleTicketPress = (ticket: any) => {
    router.push(`/ticket/${ticket.id}`);
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Панель администратора</Title>
      <TicketList onTicketPress={handleTicketPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 16,
  },
}); 