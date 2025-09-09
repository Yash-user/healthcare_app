import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import Cards from "../components/Cards";
import Events from "../components/Events"
import SelfCareCard from "../components/SelfCareCard";
import ChatButton from "../components/ChatButton";
import NotificationButton from "../components/NotificationButton"

export default function Home() {
  const { user } = useUser();

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

      {/* Scrollable Content */}
      <ScrollView>
        <Events />
        <SelfCareCard />
        <Cards />
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
    backgroundColor: "#f1f1f1ff",
    flex: 1
  },
});
