import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function DoctorImage({ image }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: '90%',
    height: 380,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
});
