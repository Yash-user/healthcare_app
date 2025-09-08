// app/screens/Profile.jsx
import React, { useMemo } from "react";
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
import { userData, heatmapSampleData } from "../utils/constants";

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

  // Build a global date => count map from user.reports
  const buildGlobalCounts = (reports = []) => {
    const counts = {};
    reports.forEach((r) => {
      // Some dates may already be ISO strings; normalize
      const iso = new Date(r.date).toISOString().slice(0, 10);
      counts[iso] = (counts[iso] || 0) + 1;
    });
    return counts;
  };

  // Use real report data if present; otherwise fallback to sample data for demo
  const reportsCounts = useMemo(() => buildGlobalCounts(user.reports || []), [user.reports]);
  const heatmapData = Object.keys(reportsCounts).length ? reportsCounts : heatmapSampleData;

  const ListHeader = () => (
    <View>
      <ProfileHeader user={user} onLogout={handleLogout} onSettings={() => router.push("/settings")} />

      {/* Heatmap: last 4 months, horizontal scroll, respects registration date */}
      <View style={styles.section}>
        <Heatmap
          data={heatmapData}
          monthsToShow={4}
          userRegisteredAt={user.registeredAt}
          cellSize={12}
          cellSpacing={4}
          startColor="#e6f4ea"
          endColor="#1b8f3b"
          emptyColor="#f3f3f3"
          onDayPress={(iso, count) => console.log("day press", iso, count)}
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
  safeArea: { flex: 1, backgroundColor: "#f9f9f9" },
  content: { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 36 },
  section: { marginBottom: 18 },
});
