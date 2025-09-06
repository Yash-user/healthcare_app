import React from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";

export default function Profile() {
  const upcomingAppointments = [
    { id: "1", title: "Consultation with Dr. Sharma", date: "2025-09-10" },
    { id: "2", title: "Panchakarma Therapy", date: "2025-09-15" },
  ];

  const recentReports = [
    { id: "1", title: "Blood Test Report", date: "2025-09-01" },
    { id: "2", title: "MRI Scan", date: "2025-08-28" },
  ];

  return (
    <View style={styles.container}>
      {/* Header with profile image */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=32" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Nikunj Sharma</Text>
        <Text style={styles.email}>nikunj@dmail.com</Text>
        <Text style={styles.info}>Age: 30 | Gender: Male</Text>
        <Text style={styles.info}>📍 Pune, India</Text>
        <Text style={styles.info}>📞 +91 6969696969</Text>

        <View style={{ flexDirection: "row", marginTop: 12 }}>
          <TouchableOpacity style={styles.editBtn} onPress={() => alert("Edit Profile")}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={() => alert("Logged out")}>
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Appointments</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Lab Reports</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Active Treatments</Text>
        </View>
      </View>

      {/* Upcoming Appointments */}
      <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
      <FlatList
        data={upcomingAppointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>{item.title}</Text>
            <Text style={styles.activityDate}>📅 {item.date}</Text>
          </View>
        )}
      />

      {/* Recent Reports */}
      <Text style={styles.sectionTitle}>Latest Lab Reports</Text>
      <FlatList
        data={recentReports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>{item.title}</Text>
            <Text style={styles.activityDate}>📄 {item.date}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f9f9f9", 
    padding: 16,
    paddingTop: 40, 
  },
  header: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: "bold", color: "#333" },
  email: { fontSize: 14, color: "gray" },
  info: { fontSize: 13, color: "#555", marginTop: 2 },

  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    marginHorizontal: 5,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: { fontSize: 20, fontWeight: "bold", color: "#2e86de" },
  statLabel: { fontSize: 12, color: "gray" },

  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10, marginTop: 10, color: "#333" },
  activityCard: {
    backgroundColor: "white",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  activityTitle: { fontSize: 14, fontWeight: "500", color: "#444" },
  activityDate: { fontSize: 12, color: "gray" },

  editBtn: {
    backgroundColor: "#2e86de",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  editBtnText: { color: "white", fontWeight: "bold" },
  logoutBtn: {
    backgroundColor: "#e74c3c",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutBtnText: { color: "white", fontWeight: "bold" },
});
