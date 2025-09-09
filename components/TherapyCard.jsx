import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TherapyCard ({ therapy }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />;
      case 'upcoming':
        return <Ionicons name="time-outline" size={24} color="#FF9800" />;
      case 'missed':
        return <Ionicons name="close-circle" size={24} color="#F44336" />;
      default:
        return <Ionicons name="time-outline" size={24} color="#FF9800" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#E8F5E8';
      case 'upcoming':
        return '#FFF3E0';
      case 'missed':
        return '#FFEBEE';
      default:
        return '#FFF3E0';
    }
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'missed':
        return '#F44336';
      default:
        return '#FF9800';
    }
  };

  return (
    <View style={[styles.therapyCard, { backgroundColor: getStatusColor(therapy.status) }]}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(therapy.time)}</Text>
      </View>
      <View style={styles.therapyInfo}>
        <Text style={styles.therapyName}>{therapy.name}</Text>
        <View style={styles.statusContainer}>
          {getStatusIcon(therapy.status)}
          <Text style={[styles.statusText, { color: getStatusTextColor(therapy.status) }]}>
            {therapy.status.charAt(0).toUpperCase() + therapy.status.slice(1)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  therapyCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timeContainer: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  therapyInfo: {
    flex: 1,
    marginLeft: 16,
  },
  therapyName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
});