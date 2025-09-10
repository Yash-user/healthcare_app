import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import Cards from "../components/Cards";
import Events from "../components/Events";
import SelfCareCard from "../components/SelfCareCard";
import ChatButton from "../components/ChatButton";
import NotificationButton from "../components/NotificationButton"

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  const handleNearbyDoctors = () => {
    router.push("/NearbyDoctors");
  };

  return (
     <View style={styles.main}>
      {/* Header with user info and chat */}
      <View style={styles.header}>
        <Text style={styles.welcome}>
          Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!
        </Text>
        <NotificationButton />
        <ChatButton />
      </View>

      <ScrollView>
        <Events />
        <SelfCareCard />
        <Cards />

        {/* New Rectangular Card */}
        <View style={styles.rectangularCard}>
          <Text style={styles.cardTitle}>Nearby Doctors</Text>
          <Text style={styles.cardDescription}>
            Find doctors near you and book an appointment easily.
          </Text>
          <TouchableOpacity
            style={styles.cardButton}
            onPress={handleNearbyDoctors}
          >
            <Text style={styles.cardButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 45,
    backgroundColor: "#acd8ebff",
  },
  welcome: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  main: {
    flex: 1,
  },
  rectangularCard: {
    margin: 15,
    marginTop: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
  },
  cardButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  cardButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
