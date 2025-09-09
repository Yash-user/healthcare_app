import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useUser, useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import Cards from "../components/Cards";
import Events from "../components/Events";
import SelfCareCard from "../components/SelfCareCard";
import ChatButton from "../components/ChatButton";

export default function Home() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  const handleNearbyDoctors = () => {
    router.push("/NearbyDoctors");
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header with user info and logout */}
      <View style={styles.header}>
        <Text style={styles.welcome}>
          Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!
        </Text>
        {/*chat*/}
        <ChatButton />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
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
    paddingTop: 50,
    backgroundColor: "#f8f9fa",
  },
  welcome: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  logoutBtn: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  logoutText: {
    color: "white",
    fontSize: 14,
  },
  main: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
