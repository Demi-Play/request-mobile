import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, ListItem } from '@rneui/themed';
import { useQuery } from '@tanstack/react-query';
import { users } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { logout } = useAuth();
  const { data: user, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: users.getProfile,
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user && (
        <>
          <ListItem>
            <ListItem.Content>
              <ListItem.Title>Имя</ListItem.Title>
              <ListItem.Subtitle>{user.first_name} {user.last_name}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
          <ListItem>
            <ListItem.Content>
              <ListItem.Title>Email</ListItem.Title>
              <ListItem.Subtitle>{user.email}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
          <ListItem>
            <ListItem.Content>
              <ListItem.Title>Роль</ListItem.Title>
              <ListItem.Subtitle>
                {user.role === 'admin' ? 'Администратор' :
                 user.role === 'specialist' ? 'Специалист' : 'Клиент'}
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
          {user.company && (
            <ListItem>
              <ListItem.Content>
                <ListItem.Title>Компания</ListItem.Title>
                <ListItem.Subtitle>{user.company}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          )}
          {user.phone && (
            <ListItem>
              <ListItem.Content>
                <ListItem.Title>Телефон</ListItem.Title>
                <ListItem.Subtitle>{user.phone}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          )}
        </>
      )}
      <Button
        title="Выйти"
        onPress={logout}
        containerStyle={styles.logoutButton}
        buttonStyle={{ backgroundColor: '#FF3B30' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoutButton: {
    margin: 20,
  },
}); 