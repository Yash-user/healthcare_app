import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Events() {
  const [blinking, setBlinking] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinking(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sample events data - replace with your actual data
  const events = [
    { id: 1, title: "Doctor Appointment", time: "2:00 PM", isNext: true },
    { id: 2, title: "Medicine Reminder", time: "4:00 PM", isNext: false },
    { id: 3, title: "Blood Test", time: "Tomorrow 10:00 AM", isNext: false },
  ];

  const handleEventPress = (event) => {
    if (event.isNext) {
      setSelectedEvent(event);
      setModalVisible(true);
    }
  };

  const handleAction = (action) => {
    // Handle complete or skip action here
    console.log(`Event ${selectedEvent?.title} was ${action}`);
    setModalVisible(false);
    setSelectedEvent(null);
  };

  return (
	<View>
		<Text style={styles.title}> Upcoming Events </Text>
		<View style={styles.container}>
		{events.map((event) => (
			<Pressable
			key={event.id}
			onPress={() => handleEventPress(event)}
			style={styles.eventBox}
			>
			<View style={styles.eventContent}>
				<View style={styles.iconContainer}>
				<Ionicons
					name="radio-button-on"
					size={24}
					color={event.isNext ? (blinking ? "#4CAF50" : "#e0e0e0") : "#4CAF50"}
				/>
				</View>
				<View style={styles.textContainer}>
				<Text style={styles.title}>{event.title}</Text>
				<Text style={styles.time}>{event.time}</Text>
				</View>
			</View>
			</Pressable>
		))}

		<Modal
			animationType="slide"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => setModalVisible(false)}
		>
			<View style={styles.modalContainer}>
			<View style={styles.modalContent}>
				<Text style={styles.modalTitle}>{selectedEvent?.title}</Text>
				<View style={styles.modalButtons}>
				<Pressable
					style={[styles.button, styles.completeButton]}
					onPress={() => handleAction('completed')}
				>
					<Text style={styles.buttonText}>Complete</Text>
				</Pressable>
				<Pressable
					style={[styles.button, styles.skipButton]}
					onPress={() => handleAction('skipped')}
				>
					<Text style={styles.buttonText}>Skip</Text>
				</Pressable>
				</View>
				<Pressable
				style={styles.cancelButton}
				onPress={() => setModalVisible(false)}
				>
				<Text style={styles.cancelText}>Cancel</Text>
				</Pressable>
			</View>
			</View>
		</Modal>
		</View>
	</View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  eventBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  time: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  skipButton: {
    backgroundColor: '#FF5722',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  cancelButton: {
    padding: 12,
  },
  cancelText: {
    color: '#666',
  },
});