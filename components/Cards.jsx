import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Sample doctors data
const doctors = [
  {
    id: '1',
    name: 'John Wilson',
    specialty: 'Cardiology',
    rating: 4.8,
    image: 'https://via.placeholder.com/100x100.png?text=Dr+1',
  },
  {
    id: '2',
    name: 'Alexa Johnson',
    specialty: 'Heart Surgeon',
    rating: 4.5,
    image: 'https://via.placeholder.com/100x100.png?text=Dr+2',
  },
  {
    id: '3',
    name: 'Tim Smith',
    specialty: 'Microbiology',
    rating: 4.5,
    image: 'https://via.placeholder.com/100x100.png?text=Dr+3',
  },
];

export default function Cards() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.ratingRow}>
          <Icon name="star" size={14} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.specialty}>{item.specialty}</Text>
      </View>
    </View>
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
    marginTop: 20,
    paddingLeft: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 15,
    marginBottom: 10,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    color: '#6C63FF',
  },
  card: {
    width: 140,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 100,
  },
  info: {
    padding: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    color: '#333',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  specialty: {
    fontSize: 12,
    color: 'gray',
  },
});
