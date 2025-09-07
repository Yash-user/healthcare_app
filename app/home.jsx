import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useUser, useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import Cards from "../components/Cards";
import Events from "../components/Events"
import SelfCareCard from "../components/SelfCareCard";

export default function Home() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header with user info and logout */}
      <View style={styles.header}>
        <Text style={styles.welcome}>
          Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!
        </Text>
        {/*chat-icon*/}
      </View>

      <Events />
      <SelfCareCard/>
      <Cards />

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
    flex: 1
  }
});
