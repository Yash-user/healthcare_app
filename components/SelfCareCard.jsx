import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const selfCareData = [
  {
    icon: "walk-outline",
    title: "Go for a Walk",
    description: "Take a 10-minute walk to refresh your mind.",
  },
  {
    icon: "water-outline",
    title: "Drink Water",
    description: "Stay hydrated by drinking a glass of water.",
  },
  {
    icon: "bed-outline",
    title: "Rest",
    description: "Take a short break and relax your eyes.",
  },
];

const CARD_MARGIN = 8;
const CARD_COUNT = 3;
const screenWidth = Dimensions.get("window").width;
const horizontalPadding = 36; // section horizontal margin * 2 (18 * 2)
const cardWidth = (screenWidth - horizontalPadding - CARD_MARGIN * (CARD_COUNT - 1)) / CARD_COUNT;

export default function SelfCareCards() {
  return (
    <View style={styles.section}>
      	<Text style={styles.sectionTitle}>Self Care</Text>
		<View style={styles.items}>
			{selfCareData.map((item, idx) => (
				<View style={styles.card} key={idx}>
				<Ionicons name={item.icon} size={32} color="#6C63FF" style={styles.icon} />
				<View>
					<Text style={styles.title}>{item.title}</Text>
					{/* <Text style={styles.desc}>{item.description}</Text> */}
				</View>
				</View>
			))}
		</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 8,
	marginHorizontal: 18
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  items: {
	flexDirection: "row",
	justifyContent: "space-between"
  },
  card: {
	height: cardWidth,
	width: cardWidth,
	marginRight: CARD_MARGIN,
    backgroundColor: "rgba(245, 245, 245, 1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  desc: {
    color: "#666",
    fontSize: 14,
  },
});