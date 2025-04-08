import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Button, SearchBar, Chip } from '@rneui/themed';
import { useQuery } from '@tanstack/react-query';
import { tickets } from '../services/api';
import { Ticket, TicketStatus, TicketPriority } from '../types';
import { router } from 'expo-router';

export default function TicketsScreen() {
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | null>(null);

  const { data: ticketsList, isLoading, refetch } = useQuery({
    queryKey: ['tickets'],
    queryFn: tickets.list,
  });

  const filteredTickets = ticketsList?.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(search.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    const matchesPriority = !priorityFilter || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderTicket = ({ item }: { item: Ticket }) => (
    <Button
      containerStyle={styles.ticketItem}
      onPress={() => router.push(`/tickets/${item.id}`)}
    >
      <View style={styles.ticketContent}>
        <Text style={styles.ticketTitle}>{item.title}</Text>
        <Text style={styles.ticketDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.ticketMeta}>
          <Chip
            title={item.status}
            type="outline"
            size="sm"
            containerStyle={styles.chip}
          />
          <Chip
            title={item.priority}
            type="outline"
            size="sm"
            containerStyle={styles.chip}
          />
        </View>
      </View>
    </Button>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Поиск заявок..."
        onChangeText={setSearch}
        value={search}
        platform="ios"
        containerStyle={styles.searchBar}
      />

      <View style={styles.filters}>
        <Text style={styles.filterTitle}>Статус:</Text>
        <View style={styles.filterChips}>
          {['open', 'in_progress', 'resolved', 'closed'].map((status) => (
            <Chip
              key={status}
              title={status}
              type={statusFilter === status ? 'solid' : 'outline'}
              onPress={() => setStatusFilter(statusFilter === status ? null : status as TicketStatus)}
              containerStyle={styles.chip}
            />
          ))}
        </View>

        <Text style={styles.filterTitle}>Приоритет:</Text>
        <View style={styles.filterChips}>
          {['low', 'medium', 'high'].map((priority) => (
            <Chip
              key={priority}
              title={priority}
              type={priorityFilter === priority ? 'solid' : 'outline'}
              onPress={() => setPriorityFilter(priorityFilter === priority ? null : priority as TicketPriority)}
              containerStyle={styles.chip}
            />
          ))}
        </View>
      </View>

      {isLoading ? (
        <Text>Загрузка...</Text>
      ) : (
        <FlatList
          data={filteredTickets}
          renderItem={renderTicket}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Заявки не найдены</Text>
          }
        />
      )}

      <Button
        title="Создать заявку"
        onPress={() => router.push('/create')}
        containerStyle={styles.createButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  filters: {
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  chip: {
    margin: 5,
  },
  ticketItem: {
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  ticketContent: {
    padding: 15,
    width: '100%',
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ticketDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  ticketMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 25,
  },
}); 