import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  createdAt: string;
};

type TicketListProps = {
  tickets?: Ticket[];
  onTicketPress?: (ticket: Ticket) => void;
  isLoading?: boolean;
};

export const TicketList: React.FC<TicketListProps> = ({
  tickets = [],
  onTicketPress,
  isLoading = false,
}) => {
  const renderTicket = ({ item }: { item: Ticket }) => (
    <Card style={styles.card} onPress={() => onTicketPress?.(item)}>
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph numberOfLines={2}>{item.description}</Paragraph>
        <View style={styles.footer}>
          <Button mode="text" style={styles.status}>
            {item.status.toUpperCase()}
          </Button>
          <Paragraph>{new Date(item.createdAt).toLocaleDateString()}</Paragraph>
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Loading tickets...</Title>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <FlatList
      data={tickets}
      renderItem={renderTicket}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      ListEmptyComponent={
        <Card style={styles.card}>
          <Card.Content>
            <Title>No tickets found</Title>
          </Card.Content>
        </Card>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  status: {
    marginRight: 8,
  },
}); 