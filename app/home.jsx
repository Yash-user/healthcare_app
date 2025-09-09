import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import Cards from "../components/Cards";
import Events from "../components/Events"
import SelfCareCard from "../components/SelfCareCard";
import ChatButton from "../components/ChatButton";

export default function Home() {
  const { user } = useUser();

  return (
    <View style={styles.main}>
      {/* Header with user info and logout */}
      <View style={styles.header}>
        <Text style={styles.welcome}>
          Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!
        </Text>
        {/*chat*/}
        <ChatButton />
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
    backgroundColor: "#acd8ebff",
  },
  welcome: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  logoutText: {
    color: "white",
    fontSize: 14,
  },
  main: {
    backgroundColor: "#f1f1f1ff",
    flex: 1
  }
});
