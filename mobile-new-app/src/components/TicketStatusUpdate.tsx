import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TicketStatus } from '../types';

interface TicketStatusUpdateProps {
  currentStatus: TicketStatus;
  onUpdate: (status: TicketStatus) => void;
}

const STATUS_COLORS = {
  open: '#FFA500',
  in_progress: '#007AFF',
  resolved: '#4CAF50',
  closed: '#9E9E9E',
};

export const TicketStatusUpdate: React.FC<TicketStatusUpdateProps> = ({
  currentStatus,
  onUpdate,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleStatusChange = (status: TicketStatus) => {
    onUpdate(status);
    setShowOptions(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.statusButton, { backgroundColor: STATUS_COLORS[currentStatus] }]}
        onPress={() => setShowOptions(!showOptions)}
      >
        <Text style={styles.statusText}>{currentStatus}</Text>
      </TouchableOpacity>

      {showOptions && (
        <View style={styles.optionsContainer}>
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <TouchableOpacity
              key={status}
              style={[styles.optionButton, { backgroundColor: color }]}
              onPress={() => handleStatusChange(status as TicketStatus)}
            >
              <Text style={styles.optionText}>{status}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  statusButton: {
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  optionsContainer: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  optionButton: {
    padding: 8,
    borderRadius: 5,
    margin: 2,
  },
  optionText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 