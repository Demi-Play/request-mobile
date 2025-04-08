import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, FAB, useTheme } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { tickets } from '../../src/services/api';
import { router } from 'expo-router';
import { Ticket } from '../../src/types';
import { useAuth } from '../../src/context/AuthContext';

export default function TicketsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const { user } = useAuth();

  const { data: ticketsList = [], isLoading, refetch } = useQuery<Ticket[]>({
    queryKey: ['tickets'],
    queryFn: tickets.list,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'open':
        return 'Открыт';
      case 'in_progress':
        return 'В работе';
      case 'resolved':
        return 'Решен';
      case 'closed':
        return 'Закрыт';
      default:
        return status;
    }
  };

  const formatPriority = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'Низкий';
      case 'medium':
        return 'Средний';
      case 'high':
        return 'Высокий';
      default:
        return priority;
    }
  };

  const renderTicket = ({ item }: { item: Ticket }) => (
    <View style={[styles.ticketItem, { backgroundColor: theme.colors.surface }]}>
      <Text variant="titleMedium" style={styles.ticketTitle}>{item.title}</Text>
      <View style={styles.ticketMeta}>
        <Text style={[styles.status, { color: theme.colors.primary }]}>
          {formatStatus(item.status)}
        </Text>
        <Text style={[styles.priority, { color: theme.colors.error }]}>
          {formatPriority(item.priority)}
        </Text>
      </View>
      <Text variant="bodyMedium" style={styles.ticketDescription} numberOfLines={2}>
        {item.description}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ticketsList}
        renderItem={renderTicket}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text variant="bodyLarge" style={styles.emptyText}>Нет тикетов</Text>
        }
      />
      {user?.role !== 'admin' && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => router.push('/create-ticket')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  ticketItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ticketTitle: {
    marginBottom: 8,
  },
  ticketMeta: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  status: {
    marginRight: 16,
  },
  priority: {
    fontWeight: 'bold',
  },
  ticketDescription: {
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
}); 