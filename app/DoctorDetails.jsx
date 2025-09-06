import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DoctorImage from '../components/DoctorImage';
import DoctorDescription from '../components/DoctorDescription';
import DoctorRating from '../components/DoctorRating';
import ConsultButton from '../components/ConsultButton';

export default function DoctorDetails() {
  const { doctorId, name, specialty, rating, image } = useLocalSearchParams();
  const router = useRouter();

  // Create doctor object from params for compatibility with existing components
  const doctor = {
    id: doctorId,
    name: name,
    specialty: specialty,
    rating: rating,
    image: image,
    description: `Dr. ${name} is a specialist in ${specialty} with excellent patient care.`, // Default description
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={{ fontSize: 16, color: 'blue' }}>Back</Text>
      </TouchableOpacity>

      {/* Image */}
      <DoctorImage image={doctor.image} />

      {/* Description */}
      <DoctorDescription description={doctor.description} />

      {/* Footer (Rating + Button) */}
      <View style={styles.footer}>
        <DoctorRating rating={doctor.rating} />
        <ConsultButton onPress={() => alert('Consulting ' + doctor.name)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  backButton: {
    marginLeft: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});
