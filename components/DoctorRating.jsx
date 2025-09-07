import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DoctorRating({ rating }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>⭐ {rating} / 5</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
  },
});
