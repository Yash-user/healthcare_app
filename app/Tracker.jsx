import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import TodaySchedule from '../components/TodaySchedule';
import CalendarSection from '../components/CalendarSection';

const therapies = {
  "2025-09-10": [
    { time: "07:00", name: "Abhyanga (Oil Massage)", status: "completed" },
    { time: "08:00", name: "Swedana (Steam Therapy)", status: "completed" },
    { time: "10:00", name: "Virechana (Purgation)", status: "upcoming" },
    { time: "16:00", name: "Nasya (Nasal Drops)", status: "upcoming" },
  ],
  "2025-09-05": [
    { time: "07:00", name: "Abhyanga (Oil Massage)", status: "completed" },
    { time: "08:00", name: "Swedana (Steam Therapy)", status: "completed" },
    { time: "10:00", name: "Virechana (Purgation)", status: "missed" },
    { time: "16:00", name: "Nasya (Nasal Drops)", status: "completed" },
  ],
  "2025-09-06": [
    { time: "07:30", name: "Basti (Enema)", status: "completed" },
    { time: "09:00", name: "Abhyanga (Oil Massage)", status: "completed" },
  ],
  "2025-09-12": [
    { time: "08:00", name: "Panchakarma Consultation", status: "upcoming" },
    { time: "10:30", name: "Shirodhara (Oil Pouring)", status: "upcoming" },
  ],
  "2025-09-15": [
    { time: "07:00", name: "Abhyanga (Oil Massage)", status: "upcoming" },
    { time: "11:00", name: "Karna Purana (Ear Treatment)", status: "upcoming" },
  ],
  "2025-09-18": [
    { time: "08:30", name: "Akshi Tarpana (Eye Treatment)", status: "upcoming" },
    { time: "14:00", name: "Udvartana (Herbal Powder Massage)", status: "upcoming" },
  ],
  "2025-09-20": [
    { time: "09:00", name: "Pizhichil (Oil Bath)", status: "upcoming" },
    { time: "15:30", name: "Shirobasti (Head Oil Treatment)", status: "upcoming" },
  ],
};

export default function Tracker() {
  const [selectedDate, setSelectedDate] = useState('2025-09-10');
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const todaysTherapies = therapies[today] || therapies['2025-09-10'] || [];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={styles.scrollContent}
      >
        <TodaySchedule therapies={todaysTherapies} />
        
        <CalendarSection 
          therapies={therapies}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 20,
  },
});