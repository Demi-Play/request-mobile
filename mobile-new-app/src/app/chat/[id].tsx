import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, useTheme, IconButton, Portal, Modal } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { messages } from '@/services/api';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Message } from '@/types';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [selectedImage, setSelectedImage] = useState<{ uri: string; type?: string; name?: string } | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadMessages();
  }, [id]);

  const loadMessages = async () => {
    try {
      const data = await messages.list(Number(id));
      setChatMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage({
        uri: result.assets[0].uri,
        type: result.assets[0].type || 'image/jpeg',
        name: result.assets[0].fileName || 'photo.jpg',
      });
    }
  };

  const sendMessage = async () => {
    if (!message.trim() && !selectedImage) return;

    try {
      await messages.send(Number(id), message, selectedImage || undefined);
      setMessage('');
      setSelectedImage(null);
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const openPreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  const renderMessage = (msg: Message) => {
    const isOwnMessage = msg.user.id === user?.id;

    return (
      <View
        key={msg.id}
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        <View style={[styles.messageBubble, { backgroundColor: isOwnMessage ? theme.colors.primary : theme.colors.surfaceVariant }]}>
          {msg.text && (
            <Text style={[styles.messageText, { color: isOwnMessage ? theme.colors.onPrimary : theme.colors.onSurface }]}>
              {msg.text}
            </Text>
          )}
          {msg.file && (
            <TouchableOpacity onPress={() => openPreview(msg.file)}>
              <Image
                source={{ uri: msg.file }}
                style={styles.messageImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
          <Text style={[styles.messageTime, { color: isOwnMessage ? theme.colors.onPrimary : theme.colors.onSurfaceVariant }]}>
            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {chatMessages.map(renderMessage)}
      </ScrollView>

      <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
        {selectedImage && (
          <View style={styles.selectedImageContainer}>
            <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
            <IconButton
              icon="close"
              size={20}
              onPress={() => setSelectedImage(null)}
              style={styles.removeImageButton}
            />
          </View>
        )}
        <View style={styles.inputRow}>
          <IconButton
            icon="image"
            size={24}
            onPress={pickImage}
            style={[styles.attachmentButton, { backgroundColor: theme.colors.surfaceVariant }]}
            iconColor={theme.colors.primary}
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.surfaceVariant }]}
            value={message}
            onChangeText={setMessage}
            placeholder="Введите сообщение..."
            multiline
          />
          <IconButton
            icon="send"
            size={24}
            onPress={sendMessage}
            disabled={!message.trim() && !selectedImage}
            style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
            iconColor={theme.colors.onPrimary}
          />
        </View>
      </View>

      <Portal>
        <Modal
          visible={previewVisible}
          onDismiss={() => setPreviewVisible(false)}
          contentContainerStyle={styles.previewContainer}
        >
          <Image
            source={{ uri: previewImage }}
            style={styles.previewImage}
            resizeMode="contain"
          />
          <IconButton
            icon="close"
            size={24}
            onPress={() => setPreviewVisible(false)}
            style={styles.closePreviewButton}
          />
        </Modal>
      </Portal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 8,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '100%',
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    maxHeight: 100,
    borderRadius: 20,
  },
  attachmentButton: {
    margin: 0,
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  sendButton: {
    margin: 0,
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  selectedImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  closePreviewButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
}); 