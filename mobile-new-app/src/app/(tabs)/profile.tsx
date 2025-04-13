import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileEdit } from '../../components/ProfileEdit';
import { ChangePassword } from '../../components/ChangePassword';
import { ICONS } from '../../assets/icons';

export default function ProfileScreen() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Пожалуйста, войдите в систему</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Профиль</Text>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
            onPress={() => setActiveTab('profile')}
          >
            <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
              Редактировать профиль
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'password' && styles.activeTab]}
            onPress={() => setActiveTab('password')}
          >
            <Text style={[styles.tabText, activeTab === 'password' && styles.activeTabText]}>
              Сменить пароль
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {activeTab === 'profile' ? (
          <ProfileEdit user={user} onUpdate={updateUser} />
        ) : (
          <ChangePassword />
        )}
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
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
}); 