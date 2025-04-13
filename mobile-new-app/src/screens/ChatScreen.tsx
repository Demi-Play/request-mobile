import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { Text, Input, Button, Avatar } from '@rneui/themed';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messages, chats } from '../services/api';
import { useLocalSearchParams } from 'expo-router';
import { Message, User } from '../types';
import { useAuth } from '../context/AuthContext';
import * as Notifications from 'expo-notifications';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const queryClient = useQueryClient();

  const { data: chat, isLoading, refetch } = useQuery({
    queryKey: ['chat', id],
    queryFn: () => chats.get(Number(id)),
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const sendMessageMutation = useMutation({
    mutationFn: (text: string) => messages.send(Number(id), text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', id] });
      setMessage('');
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (messageId: number) => messages.markAsRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', id] });
    },
  });

  useEffect(() => {
    // Mark unread messages as read when opening chat
    if (chat?.messages) {
      chat.messages.forEach(msg => {
        if (!msg.is_read && msg.sender.id !== user?.id) {
          markAsReadMutation.mutate(msg.id);
        }
      });
    }
  }, [chat]);

  useEffect(() => {
    // Set up notification listener
    const subscription = Notifications.addNotificationReceivedListener((notification: Notifications.Notification) => {
      if (notification.request.content.data.ticketId === Number(id)) {
        refetch();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleSend = () => {
    if (message.trim()) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.sender.id === user?.id;
    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        {!isOwnMessage && (
          <Avatar
            size={32}
            rounded
            title={`${item.sender.first_name[0]}${item.sender.last_name[0]}`}
            containerStyle={styles.avatar}
          />
        )}
        <View style={[
          styles.messageBubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble
        ]}>
          {!isOwnMessage && (
            <Text style={styles.senderName}>
              {item.sender.first_name} {item.sender.last_name}
            </Text>
          )}
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.created_at).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={chat?.messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Нет сообщений</Text>
        }
      />
      <View style={styles.inputContainer}>
        <Input
          value={message}
          onChangeText={setMessage}
          placeholder="Введите сообщение..."
          containerStyle={styles.input}
          rightIcon={
            <Button
              title="Отправить"
              onPress={handleSend}
              disabled={!message.trim() || sendMessageMutation.isPending}
              loading={sendMessageMutation.isPending}
            />
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  ownMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    marginRight: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
  },
  ownBubble: {
    backgroundColor: '#007AFF',
  },
  otherBubble: {
    backgroundColor: '#E5E5EA',
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  input: {
    marginBottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
}); 