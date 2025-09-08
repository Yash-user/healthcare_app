import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

// Sample doctors data
const doctors = [
  {
    id: "1",
    name: "Samir Gupta",
    specialty: "",
    rating: 4.8,
    image: "doctor1.jpeg",
  },
  {
    id: "2",
    name: "Ram Bhagat",
    specialty: "",
    rating: 4.5,
    image: "doctor2.jpeg",
  },
  {
    id: "3",
    name: "Shreevatsa Acharya",
    specialty: "",
    rating: 4.5,
    image: "doctor3.jpeg",
  },
];


const imageMap = {
  "doctor1.jpeg": require("../assets/doctor1.jpeg"),
  "doctor2.jpeg": require("../assets/doctor2.jpeg"),
  "doctor3.jpeg": require("../assets/doctor3.jpeg"),
};

export default function Cards() {
  const router = useRouter();

  const handleCardPress = (doctor) => {
    router.push({
      pathname: "/DoctorDetails",
      params: {
        doctorId: doctor.id,
        name: doctor.name,
        specialty: doctor.specialty,
        rating: doctor.rating,
        image: doctor.image,
      },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCardPress(item)}>
      <View style={styles.card}>
        <Image source={imageMap[item.image]} style={styles.image} />
        <View style={styles.info}>
          <View style={styles.ratingRow}>
            <Icon name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.specialty}>{item.specialty}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Popular Doctors</Text>
        <Text style={styles.seeAll}>See All</Text>
      </View>
      <FlatList
        data={doctors}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    paddingLeft: 15,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 15,
    marginBottom: 10,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
  },
  seeAll: {
    fontSize: 14,
    color: "#6C63FF",
  },
  card: {
    width: 140,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    overflow: "hidden",
  },
  image: {
    width: "70%",
    height: 100,
    alignSelf: "center",
  },
  info: {
    padding: 10,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    color: "#333",
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
  },
  specialty: {
    fontSize: 12,
    color: "gray",
  },
});
