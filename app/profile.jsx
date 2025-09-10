// profile.jsx
import React, { useMemo } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

import ProfileHeader from "../components/ProfileHeader";
import InfoItems from "../components/InfoItems";
import InfoGrid from "../components/InfoGrid";
import DoshaList from "../components/DoshaList";
import ReportsListItem from "../components/ReportsList";
import ActivityHeatmap from "../components/ActivityHeatmap";

import { userData, heatmapSampleData } from "../utils/constants";
import { getHeatmapActivities } from "../utils/heatmapUtils";

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

  const heatmapActivities = useMemo(
    () => getHeatmapActivities(user.reports || []),
    [user.reports]
  );

  const finalHeatmapData = heatmapActivities.length > 0 ? heatmapActivities : heatmapSampleData;

  const ListHeader = () => (
    <View>
      <ProfileHeader user={user} onLogout={handleLogout} onSettings={() => router.push("/settings")} />

      {/* Activity Heatmap: pass user's registeredAt as startDate so heatmap respects registration */}
      <ActivityHeatmap activities={finalHeatmapData} startDate={user.registeredAt ? new Date(user.registeredAt) : undefined} />


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

  legendRow: { flexDirection: "row", alignItems: "center", marginTop: 12, paddingHorizontal: 2 },
  legendItem: { flexDirection: "row", alignItems: "center", marginRight: 12 },
  legendSwatch: { width: 14, height: 14, borderRadius: 3, marginRight: 6 },
  legendLabel: { fontSize: 11, color: "#555" },
});
