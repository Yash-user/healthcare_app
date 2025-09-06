import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DoctorDescription({ description }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
});
