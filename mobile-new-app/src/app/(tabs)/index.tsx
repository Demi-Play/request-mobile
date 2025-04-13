import { View, StyleSheet, ScrollView, Animated, Easing } from 'react-native';
import { Text, useTheme, Card, Button, Icon, Avatar, Divider } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { tickets } from '@/services/api';

export default function TabsIndexScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const [stats, setStats] = useState({
    open: 0,
    inProgress: 0,
    completed: 0,
    total: 0
  });

  useEffect(() => {
    // Анимация появления
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();

    // Загрузка статистики
    const loadStats = async () => {
      try {
        const allTickets = await tickets.list(true);
        const stats = {
          open: allTickets.filter(t => t.status === 'open').length,
          inProgress: allTickets.filter(t => t.status === 'in_progress').length,
          completed: allTickets.filter(t => t.status === 'completed').length,
          total: allTickets.length
        };
        setStats(stats);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };
    loadStats();
  }, []);

  const news = [
    {
      title: 'Новые возможности в системе',
      date: '15.03.2024',
      content: 'Добавлена возможность прикрепления файлов к заявкам, включая изображения и документы. Максимальный размер файла - 10 МБ.',
      icon: 'file-upload'
    },
    {
      title: 'Улучшения в работе с заявками',
      date: '10.03.2024',
      content: 'Внедрена новая система приоритетов заявок. Теперь вы можете отмечать срочные задачи для более быстрого решения.',
      icon: 'priority-high'
    },
    {
      title: 'Обновление мобильного приложения',
      date: '05.03.2024',
      content: 'Выпущено обновление мобильного приложения с улучшенным интерфейсом и оптимизацией производительности.',
      icon: 'cellphone'
    }
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Animated.View 
        style={[
          styles.header, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }] 
          }
        ]}
      >
        <View style={styles.userInfo}>
          <Avatar.Text 
            size={56} 
            label={user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'Г'} 
            style={{ backgroundColor: theme.colors.primaryContainer }}
          />
          <View style={styles.userText}>
            <Text variant="headlineSmall" style={styles.greeting}>
              Привет, {user?.first_name || user?.username || 'Гость'}!
            </Text>
            <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              {user?.company || 'Ваша компания'}
            </Text>
          </View>
        </View>

        <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 24 }]}>
          Общая статистика заявок
        </Text>

        <View style={styles.statsContainer}>
          <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.statContent}>
              <Icon 
                source="ticket-outline" 
                size={24} 
                color={theme.colors.primary}
              />
              <Text variant="titleLarge" style={styles.statValue}>
                {stats.total}
              </Text>
              <Text variant="bodyMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Всего заявок
              </Text>
            </Card.Content>
          </Card>
          <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.statContent}>
              <Icon 
                source="clock-time-three-outline" 
                size={24} 
                color={theme.colors.primary}
              />
              <Text variant="titleLarge" style={styles.statValue}>
                {stats.inProgress}
              </Text>
              <Text variant="bodyMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                В работе
              </Text>
            </Card.Content>
          </Card>
          <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.statContent}>
              <Icon 
                source="check-circle-outline" 
                size={24} 
                color={theme.colors.primary}
              />
              <Text variant="titleLarge" style={styles.statValue}>
                {stats.completed}
              </Text>
              <Text variant="bodyMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                Завершено
              </Text>
            </Card.Content>
          </Card>
        </View>

        <Button
          mode="contained"
          onPress={() => router.push('/tickets')}
          style={styles.createButton}
          icon="plus"
        >
          Создать новую заявку
        </Button>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Последние новости
        </Text>

        {news.map((item, index) => (
          <Card key={index} style={[styles.newsCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.newsHeader}>
                <Icon source={item.icon} size={24} color={theme.colors.primary} />
                <View style={styles.newsTitleContainer}>
                  <Text variant="titleMedium" style={styles.newsTitle}>
                    {item.title}
                  </Text>
                  <Text variant="bodySmall" style={[styles.newsDate, { color: theme.colors.onSurfaceVariant }]}>
                    {item.date}
                  </Text>
                </View>
              </View>
              <Divider style={styles.divider} />
              <Text variant="bodyMedium" style={styles.newsContent}>
                {item.content}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userText: {
    marginLeft: 16,
  },
  greeting: {
    marginBottom: 4,
    fontWeight: 'bold',
  },
  subtitle: {
    opacity: 0.8,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '30%',
    borderRadius: 12,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    marginVertical: 8,
    fontWeight: 'bold',
  },
  statLabel: {
    textAlign: 'center',
    fontSize: 12,
  },
  createButton: {
    marginBottom: 24,
  },
  newsCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  newsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  newsTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  newsTitle: {
    fontWeight: 'bold',
  },
  newsDate: {
    marginTop: 2,
  },
  divider: {
    marginVertical: 8,
  },
  newsContent: {
    lineHeight: 20,
  },
});