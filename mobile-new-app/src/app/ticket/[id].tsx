import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Card, Title, Paragraph, Button, ActivityIndicator, Text, useTheme, Divider } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { ticketApi } from '@/services/api';
import { Ticket, Message, TicketStatus } from '@/types';
import { useQuery } from '@tanstack/react-query';

export default function TicketScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const theme = useTheme();

  const { data: ticketData, isLoading } = useQuery<Ticket>({
    queryKey: ['ticket', id],
    queryFn: () => ticketApi.getTicket(id as string),
  });

  useEffect(() => {
    loadTicketData();
  }, [id]);

  const loadTicketData = async () => {
    try {
      const [ticketData, messagesData] = await Promise.all([
        ticketApi.getTicket(id as string),
        ticketApi.getTicketMessages(id as string),
      ]);
      setTicket(ticketData);
      setMessages(messagesData);
    } catch (error) {
      console.error('Error loading ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const message = await ticketApi.sendMessage(id as string, newMessage.trim());
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus: 'open' | 'in_progress' | 'closed') => {
    try {
      const updatedTicket = await ticketApi.updateTicket(id as string, { status: newStatus });
      setTicket(updatedTicket);
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  if (isLoading || !ticket) {
    return (
      <View style={styles.container}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={[styles.content, { backgroundColor: theme.colors.background }]}>
        <Card style={styles.ticketCard}>
          <Card.Content>
            <Title>{ticket.title}</Title>
            <Paragraph>{ticket.description}</Paragraph>
            <View style={styles.statusContainer}>
              <Paragraph>Статус: {ticket.status}</Paragraph>
              {user?.role === 'admin' && (
                <View style={styles.statusButtons}>
                  <Button 
                    mode="contained" 
                    onPress={() => handleStatusChange('open')}
                    disabled={ticket.status === 'open'}
                    style={styles.statusButton}
                  >
                    Открыть
                  </Button>
                  <Button 
                    mode="contained" 
                    onPress={() => handleStatusChange('in_progress')}
                    disabled={ticket.status === 'in_progress'}
                    style={styles.statusButton}
                  >
                    В работе
                  </Button>
                  <Button 
                    mode="contained" 
                    onPress={() => handleStatusChange('closed')}
                    disabled={ticket.status === 'closed'}
                    style={styles.statusButton}
                  >
                    X
                  </Button>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>

        <View style={styles.messages}>
          {messages.map((message) => (
            <Card 
              key={message.id} 
              style={[
                styles.messageCard,
                message.sender.id === user?.id && styles.ownMessage
              ]}
            >
              <Card.Content>
                <Paragraph>{message.text}</Paragraph>
                <Paragraph style={styles.messageTime}>
                  {message.sender.email}
                </Paragraph>
              </Card.Content>
            </Card>
          ))}
        </View>

        <Divider style={styles.divider} />

        {/* <Button
          mode="contained"
          onPress={() => router.push(`/ticket/${id}/chat`)}
          style={styles.button}
        >
          Перейти к чату
        </Button> */}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Введите сообщение..."
          multiline
        />
        <Button 
          mode="contained" 
          onPress={handleSendMessage}
          loading={sending}
          disabled={sending || !newMessage.trim()}
        >
          Отправить
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  ticketCard: {
    marginBottom: 16,
  },
  statusContainer: {
    marginTop: 16,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statusButton: {
    marginHorizontal: 4,
  },
  messages: {
    flex: 1,
  },
  messageCard: {
    marginBottom: 8,
  },
  ownMessage: {
    backgroundColor: '#e3f2fd',
    marginLeft: 32,
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    maxHeight: 100,
  },
  divider: {
    marginVertical: 24,
  },
  button: {
    marginTop: 16,
  },
}); 