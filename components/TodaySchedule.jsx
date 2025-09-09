import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TherapyCard from './TherapyCard';

export default function TodaySchedule ({ therapies = []}){
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="today" size={24} color="#6366f1" />
        <Text style={styles.title}>Today's Schedule</Text>
      </View>
      
      <View style={styles.therapiesContainer}>
        {therapies.length > 0 ? (
          therapies.map((therapy, index) => (
            <TherapyCard key={index} therapy={therapy} />
          ))
        ) : (
          <View style={styles.noTherapiesContainer}>
            <Ionicons name="leaf-outline" size={48} color="#94a3b8" />
            <Text style={styles.noTherapiesText}>No therapies scheduled for today</Text>
            <Text style={styles.noTherapiesSubtext}>Take time to rest and rejuvenate</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  therapiesContainer: {
    minHeight: 200,
  },
  noTherapiesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noTherapiesText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 12,
  },
  noTherapiesSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
});