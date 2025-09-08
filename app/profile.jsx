// app/screens/Profile.jsx
import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

import ProfileHeader from "../components/ProfileHeader";
import InfoItems from "../components/InfoItems";
import InfoGrid from "../components/InfoGrid";
import DoshaList from "../components/DoshaList";
import ReportsListItem from "../components/ReportsList";
import Heatmap from "../components/Heatmap";
import { userData } from "../utils/constants";

export default function Profile({ user = userData }) {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Helper: build counts for current month
  const buildMonthlyCounts = (reports, year, month) => {
    const counts = {};
    reports?.forEach((r) => {
      const iso = new Date(r.date).toISOString().slice(0, 10);
      const d = new Date(iso);
      if (d.getFullYear() === year && d.getMonth() + 1 === month) {
        counts[iso] = (counts[iso] || 0) + 1;
      }
    });
    return counts;
  };

  const today = new Date();
  const monthlyCounts = buildMonthlyCounts(
    user.reports || [],
    today.getFullYear(),
    today.getMonth() + 1
  );

  const ListHeader = () => (
    <View>
      <ProfileHeader
        user={user}
        onLogout={handleLogout}
        onSettings={() => router.push("/settings")}
      />

      {/* Heatmap section */}
      <View style={styles.section}>
        <Heatmap
          year={today.getFullYear()}
          month={today.getMonth() + 1}
          data={monthlyCounts}
          startColor="#e6f4ea"
          endColor="#1b8f3b"
          emptyColor="#f3f3f3"
          cellSize={18}
          onDayPress={(iso, count) => console.log("Day pressed:", iso, count)}
        />
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
    paddingTop: 20,
    paddingBottom: 36,
  },
  section: {
    marginBottom: 18,
  },
});
