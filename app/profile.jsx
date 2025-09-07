// app/screens/Profile.jsx
import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

import ProfileHeader from "../components/ProfileHeader";
import StatCardRow from "../components/StatCardRow";
import InfoItems from "../components/InfoItems";
import InfoGrid from "../components/InfoGrid";
import DoshaList from "../components/DoshaList";
import ReportsListItem from "../components/ReportsList";
import { userData } from "../utils/constants";

export default function Profile({ user = userData }) {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/login"); // go back to login after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const ListHeader = () => (
    <View>
      <ProfileHeader
        user={user}
        onLogout={handleLogout}
        onSettings={() => router.push("/settings")}
      />

      <View style={styles.section}>
        <StatCardRow user={user} />
      </View>

      <View style={styles.section}>
        <InfoItems user={user} />
      </View>

      <View style={styles.section}>
        <InfoGrid items={user.quickLinks} />
      </View>

      <View style={styles.section}>
        <DoshaList items={user.doshaAnswers} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={user.reports || []}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => <ReportsListItem report={item} />}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={<View style={{ padding: 18 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 36,
  },
  section: {
    marginBottom: 18,
  },
});
