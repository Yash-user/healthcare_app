import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

// Sample Ayurveda doctors data with coordinates
export const nearbyDoctors = [
  {
    id: '1',
    name: 'Shree Ayurveda Center',
    distance: '1.2km',
    latitude: 28.610, // Delhi area coordinates
    longitude: 77.112,
    rating: 4.5,
    phone: '+91 98765-43210',
    consultationFee: '₹500',
  },
  {
    id: '2',
    name: 'Panchakarma Wellness Clinic',
    distance: '2.3km',
    latitude: 28.608,
    longitude: 77.108,
    rating: 4.8,
    phone: '+91 87654-32109',
    consultationFee: '₹600',
  },
  {
    id: '3',
    name: 'Traditional Ayurveda Hospital',
    distance: '0.8km',
    latitude: 28.612,
    longitude: 77.115,
    rating: 4.7,
    phone: '+91 76543-21098',
    consultationFee: '₹450',
  },
  {
    id: '4',
    name: 'Herbal Medicine Center',
    distance: '3.1km',
    latitude: 28.605,
    longitude: 77.120,
    rating: 4.6,
    phone: '+91 65432-10987',
    consultationFee: '₹550',
  },
];

export default function NearbyDoctorsWithMap() {
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [mapRegion, setMapRegion] = useState({
    latitude: 28.610, // Delhi coordinates
    longitude: 77.112,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to find nearby doctors.',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const userLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocation(userLocation);
      setMapRegion({
        ...userLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Calculate distances and sort doctors
      const doctorsWithDistance = calculateDistances(userLocation, nearbyDoctors);
      setDoctors(doctorsWithDistance);
      setLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your location. Using default location.');
      setDoctors(nearbyDoctors);
      setLoading(false);
    }
  };

  const calculateDistances = (userLocation, doctorsList) => {
    return doctorsList
      .map(doctor => {
        const distance = getDistanceFromLatLonInKm(
          userLocation.latitude,
          userLocation.longitude,
          doctor.latitude,
          doctor.longitude
        );
        return {
          ...doctor,
          calculatedDistance: distance,
          distance: `${distance.toFixed(1)}km`,
        };
      })
      .sort((a, b) => a.calculatedDistance - b.calculatedDistance);
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const handleDoctorPress = (doctor) => {
    router.push({
      pathname: '/DoctorDetails',
      params: {
        doctorId: doctor.id,
        name: doctor.name,
        rating: doctor.rating,
      },
    });
  };

  const renderDoctorItem = ({ item }) => (
    <TouchableOpacity
      style={styles.doctorItem}
      onPress={() => handleDoctorPress(item)}
    >
      <View style={styles.doctorAvatar}>
        <Icon name="medical" size={24} color="#6C63FF" />
      </View>
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
      </View>
      <Text style={styles.distance}>{item.distance}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Finding nearby doctors...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={mapRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          mapType="standard"
        >
          {/* User location marker */}
          {location && (
            <Marker
              coordinate={location}
              title="Your Location"
              pinColor="blue"
            />
          )}
          
          {/* Doctor markers */}
          {doctors.map((doctor) => (
            <Marker
              key={doctor.id}
              coordinate={{
                latitude: doctor.latitude,
                longitude: doctor.longitude,
              }}
              title={doctor.name}
              description={`${doctor.distance}`}
              onPress={() => handleDoctorPress(doctor)}
            >
              <View style={styles.markerContainer}>
                <Icon name="medical" size={20} color="#6C63FF" />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Near you section */}
      <View style={styles.nearYouSection}>
        <Text style={styles.nearYouTitle}>Near you</Text>
        <ScrollView style={styles.doctorsList}>
          {doctors.map((doctor) => (
            <View key={doctor.id}>
              {renderDoctorItem({ item: doctor })}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  mapContainer: {
    height: '50%',
    backgroundColor: '#E8D5FF',
    margin: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  nearYouSection: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  nearYouTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 15,
  },
  doctorsList: {
    flex: 1,
  },
  doctorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F8FF',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
  },
  distance: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});
