import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../../src/contexts/AuthContext';
import { ticketApi } from '../../src/services/api';
import { Ticket, Message } from '../../src/types/ticket';

export default function TicketScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

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

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!ticket) {
    return (
      <View style={styles.container}>
        <Title>Заявка не найдена</Title>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.content}>
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
                    Закрыть
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
                message.userId === user?.id && styles.ownMessage
              ]}
            >
              <Card.Content>
                <Paragraph>{message.content}</Paragraph>
                <Paragraph style={styles.messageTime}>
                  {new Date(message.createdAt).toLocaleString()}
                </Paragraph>
              </Card.Content>
            </Card>
          ))}
        </View>
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
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
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
}); 