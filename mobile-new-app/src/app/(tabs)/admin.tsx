import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { TicketList } from '../../components/TicketList';

export default function AdminScreen() {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>У вас нет доступа к этой странице</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Панель администратора</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Все заявки</Text>
        <TicketList user={user} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
}); 