import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { searchNearbyHealthcare, searchSpecificHealthcare } from '../services/nominatimService';

const { width, height } = Dimensions.get('window');

export default function NearbyDoctors() {
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchType, setSearchType] = useState('ayurveda clinic');
  const [refreshing, setRefreshing] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 28.6, // Default to Delhi coordinates
    longitude: 77.2,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [mapError, setMapError] = useState(false);

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
        // Use default location (Delhi)
        await searchDoctorsAtLocation(28.6, 77.2);
        setLoading(false);
        return;
      }

      setLoading(true);
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

      // Search for nearby doctors using OpenStreetMap
      await searchDoctorsAtLocation(userLocation.latitude, userLocation.longitude);
      setLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your location. Using default location (Delhi).');
      // Use default location
      await searchDoctorsAtLocation(28.6, 77.2);
      setLoading(false);
    }
  };

  const searchDoctorsAtLocation = async (latitude, longitude) => {
    try {
      setRefreshing(true);
      const nearbyDoctors = await searchNearbyHealthcare(latitude, longitude);
      const formattedDoctors = nearbyDoctors.map(doctor => ({
        ...doctor,
        distance: `${doctor.distance.toFixed(1)}km`
      }));
      setDoctors(formattedDoctors);
    } catch (error) {
      console.error('Error searching doctors:', error);
      Alert.alert('Error', 'Failed to search nearby doctors. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    if (location) {
      await searchDoctorsAtLocation(location.latitude, location.longitude);
    }
  };

  const handleSearchTypeChange = async (newSearchType) => {
    setSearchType(newSearchType);
    if (location) {
      setLoading(true);
      try {
        const specificDoctors = await searchSpecificHealthcare(
          location.latitude, 
          location.longitude, 
          newSearchType
        );
        const formattedDoctors = specificDoctors.map(doctor => ({
          ...doctor,
          distance: `${doctor.distance.toFixed(1)}km`
        }));
        setDoctors(formattedDoctors);
      } catch (error) {
        console.error('Error in specific search:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDoctorPress = (doctor) => {
    setSelectedDoctor(doctor);
    // Animate to doctor location on map
    setMapRegion({
      latitude: doctor.latitude,
      longitude: doctor.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const handleViewDoctorDetails = (doctor) => {
    router.push({
      pathname: '/DoctorDetails',
      params: {
        doctorId: doctor.id,
        name: doctor.name,
        rating: doctor.rating,
      },
    });
  };

  const handleMyLocation = () => {
    if (location) {
      setMapRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setSelectedDoctor(null);
    }
  };

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
        
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Icon name="refresh" size={20} color="#6C63FF" />
        </TouchableOpacity>
      </View>

      {/* Search Type Selector */}
      <View style={styles.searchTypeContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['ayurveda clinic'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.searchTypeButton,
                searchType === type && styles.activeSearchType
              ]}
              onPress={() => handleSearchTypeChange(type)}
            >
              <Text style={[
                styles.searchTypeText,
                searchType === type && styles.activeSearchTypeText
              ]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        {!mapError ? (
          <MapView
            style={styles.map}
            region={mapRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
            onRegionChangeComplete={setMapRegion}
            onError={() => setMapError(true)}
            mapType="standard"
          >
            {/* User location marker */}
            {location && (
              <Marker
                coordinate={location}
                title="Your Location"
                description="You are here"
              >
                <View style={styles.userMarker}>
                  <Icon name="person" size={20} color="#fff" />
                </View>
              </Marker>
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
                <View style={[
                  styles.doctorMarker,
                  selectedDoctor?.id === doctor.id && styles.selectedMarker
                ]}>
                  <Icon name="medical" size={16} color="#fff" />
                </View>
              </Marker>
            ))}
          </MapView>
        ) : (
          <View style={styles.mapFallback}>
            <Icon name="map" size={80} color="#6C63FF" />
            <Text style={styles.mapText}>OpenStreetMap</Text>
            <Text style={styles.mapSubtext}>
              Map will load with nearby healthcare providers.{'\n'}
              Data from OpenStreetMap & Nominatim.
            </Text>
          </View>
        )}

        {/* My Location Button */}
        {!mapError && (
          <TouchableOpacity 
            style={styles.myLocationButton} 
            onPress={handleMyLocation}
          >
            <Icon name="locate" size={24} color="#6C63FF" />
          </TouchableOpacity>
        )}

        {/* Loading indicator for map */}
        {refreshing && (
          <View style={styles.mapLoadingOverlay}>
            <ActivityIndicator size="large" color="#6C63FF" />
            <Text style={styles.mapLoadingText}>Searching nearby...</Text>
          </View>
        )}

        {/* Selected Doctor Info Card */}
        {selectedDoctor && !mapError && (
          <View style={styles.selectedDoctorCard}>
            <View style={styles.selectedDoctorInfo}>
              <View style={styles.selectedDoctorIconContainer}>
                <Icon name="medical" size={24} color="#6C63FF" />
              </View>
              <View style={styles.selectedDoctorDetails}>
                <Text style={styles.selectedDoctorName}>{selectedDoctor.name}</Text>
                <View style={styles.selectedDoctorRating}>
                  <Icon name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>{selectedDoctor.rating}</Text>
                  <Text style={styles.distanceText}>• {selectedDoctor.distance}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.viewDetailsButton}
              onPress={() => handleViewDoctorDetails(selectedDoctor)}
            >
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Near you section */}
      <View style={styles.nearYouSection}>
        <View style={styles.nearYouHeader}>
          <Text style={styles.nearYouTitle}>Near you</Text>
          <Text style={styles.resultsCount}>
            {doctors.length} {searchType}s found
          </Text>
        </View>
        <ScrollView style={styles.doctorsList} showsVerticalScrollIndicator={false}>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <TouchableOpacity
                key={doctor.id}
                style={[
                  styles.doctorItem,
                  selectedDoctor?.id === doctor.id && styles.selectedDoctorItem
                ]}
                onPress={() => handleDoctorPress(doctor)}
              >
                <View style={styles.doctorAvatar}>
                  <Icon name="medical" size={24} color="#6C63FF" />
                </View>
                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName} numberOfLines={1}>
                    {doctor.name}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Icon name="star" size={16} color="#FFD700" />
                    <Text style={styles.rating}>{doctor.rating}</Text>
                    {doctor.source === 'openstreetmap' && (
                      <Text style={styles.sourceTag}>OSM</Text>
                    )}
                  </View>
                  <Text style={styles.doctorAddress} numberOfLines={1}>
                    {doctor.address}
                  </Text>
                </View>
                <View style={styles.distanceContainer}>
                  <Text style={styles.distance}>{doctor.distance}</Text>
                  <TouchableOpacity 
                    style={styles.bookButton}
                    onPress={() => handleViewDoctorDetails(doctor)}
                  >
                    <Text style={styles.bookButtonText}>View</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Icon name="search" size={60} color="#ccc" />
              <Text style={styles.noResultsText}>
                No {searchType}s found nearby
              </Text>
              <Text style={styles.noResultsSubtext}>
                Try refreshing or selecting a different category
              </Text>
            </View>
          )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  refreshButton: {
    padding: 8,
  },
  searchTypeContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  searchTypeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeSearchType: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  searchTypeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeSearchTypeText: {
    color: '#fff',
  },
  mapContainer: {
    height: height * 0.5,
    margin: 15,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8D5FF',
    padding: 20,
  },
  mapText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginTop: 10,
    textAlign: 'center',
  },
  mapSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
  mapLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapLoadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6C63FF',
    fontWeight: '500',
  },
  userMarker: {
    backgroundColor: '#6C63FF',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  doctorMarker: {
    backgroundColor: '#FF6B6B',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  selectedMarker: {
    backgroundColor: '#4ECDC4',
    transform: [{ scale: 1.2 }],
  },
  myLocationButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  selectedDoctorCard: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  selectedDoctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedDoctorIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedDoctorDetails: {
    flex: 1,
  },
  selectedDoctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  selectedDoctorRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  distanceText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  viewDetailsButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  viewDetailsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  nearYouSection: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  nearYouHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  nearYouTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
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
  selectedDoctorItem: {
    backgroundColor: '#F0F8FF',
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
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
  doctorAddress: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
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
  sourceTag: {
    marginLeft: 8,
    fontSize: 10,
    color: '#6C63FF',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    fontWeight: '500',
  },
  distanceContainer: {
    alignItems: 'flex-end',
  },
  distance: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  bookButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noResultsText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
    fontWeight: '500',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
});
