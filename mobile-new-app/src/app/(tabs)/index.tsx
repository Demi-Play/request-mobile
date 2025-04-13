import { View, StyleSheet, ScrollView, Animated, Easing } from 'react-native';
import { Text, useTheme, Card, Button, Icon, Avatar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function TabsIndexScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  // const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;

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
  }, []);

  const stats = [
    { label: 'Открытых заявок', value: 5, icon: 'alert-circle-outline' },
    { label: 'В работе', value: 3, icon: 'clock-time-three-outline' },
    { label: 'Завершённых', value: 12, icon: 'check-circle-outline' },
  ];

  // const quickActions = [
  //   { 
  //     title: 'Новая заявка', 
  //     icon: 'plus-circle', 
  //     onPress: () => navigation.navigate('createTicket'),
  //     color: theme.colors.primary
  //   },
  //   { 
  //     title: 'Мои заявки', 
  //     icon: 'format-list-checks', 
  //     onPress: () => navigation.navigate('tickets'),
  //     color: theme.colors.secondary
  //   },
  //   { 
  //     title: 'Сообщения', 
  //     icon: 'message-text', 
  //     onPress: () => navigation.navigate('chat'),
  //     color: theme.colors.tertiary
  //   },
  // ];

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
            label={user?.username?.charAt(0) || 'Г'} 
            style={{ backgroundColor: theme.colors.primaryContainer }}
          />
          <View style={styles.userText}>
            <Text variant="headlineSmall" style={styles.greeting}>
              Привет, {user?.username || 'Гость'}!
            </Text>
            <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              {user?.company || 'Ваша компания'}
            </Text>
          </View>
        </View>

        <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 24 }]}>
          Статистика заявок
        </Text>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <Card key={index} style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content style={styles.statContent}>
                <Icon 
                  source={stat.icon} 
                  size={24} 
                  color={theme.colors.primary}
                />
                <Text variant="titleLarge" style={styles.statValue}>
                  {stat.value}
                </Text>
                <Text variant="bodyMedium" style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  {stat.label}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Быстрые действия
        </Text>

        {/* <View style={styles.actionsContainer}>
          {quickActions.map((action, index) => (
            <Button
              key={index}
              mode="contained-tonal"
              style={[styles.actionButton, { backgroundColor: action.color }]}
              labelStyle={{ color: theme.colors.onPrimary }}
              icon={action.icon}
              onPress={action.onPress}
            >
              {action.title}
            </Button>
          ))}
        </View> */}

        <Card style={[styles.newsCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Title
            title="Новости системы"
            titleVariant="titleMedium"
            left={(props) => <Icon {...props} source="newspaper-variant" />}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
              • Добавлена возможность прикрепления файлов к заявкам
            </Text>
            <Text variant="bodyMedium">
              • Улучшена система уведомлений
            </Text>
          </Card.Content>
        </Card>
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
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 8,
    paddingVertical: 8,
  },
  newsCard: {
    borderRadius: 12,
    elevation: 2,
  },
});