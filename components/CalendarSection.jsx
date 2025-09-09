import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import TherapyCard from './TherapyCard';

export default function CalendarSection({ therapies, selectedDate, onDateSelect }){
  // Generate marked dates for calendar
  const getMarkedDates = () => {
    const marked = {};
    Object.keys(therapies).forEach(date => {
      const dayTherapies = therapies[date];
      const completedCount = dayTherapies.filter(t => t.status === 'completed').length;
      const totalCount = dayTherapies.length;
      
      let color = '#FF9800'; // upcoming (yellow/orange)
      if (completedCount === totalCount) {
        color = '#4CAF50'; // completed (green)
      } else if (completedCount > 0) {
        color = '#2196F3'; // ongoing (blue)
      }
      
      marked[date] = {
        marked: true,
        dotColor: color,
        selected: date === selectedDate,
        selectedColor: date === selectedDate ? '#6366f1' : undefined,
      };
    });
    return marked;
  };

  const selectedDateTherapies = therapies[selectedDate] || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="calendar" size={24} color="#6366f1" />
        <Text style={styles.title}>Calendar View</Text>
      </View>
      
      <Calendar
        style={styles.calendar}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#6366f1',
          selectedDayBackgroundColor: '#6366f1',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#6366f1',
          dayTextColor: '#1f2937',
          textDisabledColor: '#9ca3af',
          dotColor: '#6366f1',
          selectedDotColor: '#ffffff',
          arrowColor: '#6366f1',
          monthTextColor: '#1f2937',
          indicatorColor: '#6366f1',
          textDayFontFamily: 'System',
          textMonthFontFamily: 'System',
          textDayHeaderFontFamily: 'System',
          textDayFontWeight: '400',
          textMonthFontWeight: '600',
          textDayHeaderFontWeight: '500',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        markedDates={getMarkedDates()}
        onDayPress={(day) => onDateSelect(day.dateString)}
        markingType="dot"
      />

      {/* Selected Date Therapies */}
      {selectedDateTherapies.length > 0 && (
        <View style={styles.selectedDateSection}>
          <Text style={styles.selectedDateTitle}>
            Therapies for {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
          <ScrollView 
            style={styles.selectedDateScroll} 
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {selectedDateTherapies.map((therapy, index) => (
              <TherapyCard key={index} therapy={therapy} />
            ))}
          </ScrollView>
        </View>
      )}
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
  calendar: {
    borderRadius: 12,
    marginBottom: 16,
  },
  selectedDateSection: {
    maxHeight: 200,
  },
  selectedDateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  selectedDateScroll: {
    maxHeight: 180,
  },
});
