import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Button, Chip, Divider, Dialog } from '@rneui/themed';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tickets, messages, chats } from '../services/api';
import { router, useLocalSearchParams } from 'expo-router';
import { Ticket, Message, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

export default function TicketDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showPriorityDialog, setShowPriorityDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: ticket, isLoading, refetch } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => tickets.get(Number(id)),
  });

  const { data: chat } = useQuery({
    queryKey: ['chat', id],
    queryFn: () => chats.get(Number(id)),
    enabled: !!ticket,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => tickets.update(Number(id), status, ticket?.priority || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setShowStatusDialog(false);
    },
  });

  const updatePriorityMutation = useMutation({
    mutationFn: (priority: string) => tickets.update(Number(id), ticket?.status || '', priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setShowPriorityDialog(false);
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const canManageTicket = user?.role === 'admin' || user?.role === 'specialist';

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  if (!ticket) {
    return (
      <View style={styles.container}>
        <Text>Заявка не найдена</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text h4>{ticket.title}</Text>
        <View style={styles.meta}>
          <Chip
            title={ticket.status}
            type="outline"
            size="sm"
            containerStyle={styles.chip}
            onPress={canManageTicket ? () => setShowStatusDialog(true) : undefined}
          />
          <Chip
            title={ticket.priority}
            type="outline"
            size="sm"
            containerStyle={styles.chip}
            onPress={canManageTicket ? () => setShowPriorityDialog(true) : undefined}
          />
        </View>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Описание</Text>
        <Text>{ticket.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Информация</Text>
        <Text>Создано: {new Date(ticket.created_at).toLocaleString()}</Text>
        <Text>Обновлено: {new Date(ticket.updated_at).toLocaleString()}</Text>
        <Text>Автор: {ticket.user.first_name} {ticket.user.last_name}</Text>
        {ticket.specialist && (
          <Text>Специалист: {ticket.specialist.first_name} {ticket.specialist.last_name}</Text>
        )}
      </View>

      <Button
        title="Перейти к чату"
        onPress={() => router.push(`/chat/${id}`)}
        containerStyle={styles.chatButton}
      />

      <Dialog
        isVisible={showStatusDialog}
        onBackdropPress={() => setShowStatusDialog(false)}
      >
        <Dialog.Title title="Изменить статус" />
        {['open', 'in_progress', 'resolved', 'closed'].map((status) => (
          <Button
            key={status}
            title={status}
            onPress={() => updateStatusMutation.mutate(status)}
            containerStyle={styles.dialogButton}
          />
        ))}
      </Dialog>

      <Dialog
        isVisible={showPriorityDialog}
        onBackdropPress={() => setShowPriorityDialog(false)}
      >
        <Dialog.Title title="Изменить приоритет" />
        {['low', 'medium', 'high'].map((priority) => (
          <Button
            key={priority}
            title={priority}
            onPress={() => updatePriorityMutation.mutate(priority)}
            containerStyle={styles.dialogButton}
          />
        ))}
      </Dialog>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
  },
  meta: {
    flexDirection: 'row',
    marginTop: 10,
  },
  chip: {
    marginRight: 10,
  },
  divider: {
    marginVertical: 10,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chatButton: {
    margin: 15,
  },
  dialogButton: {
    marginVertical: 5,
  },
}); 