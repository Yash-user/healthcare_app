// OpenStreetMap Nominatim API service for finding nearby healthcare providers
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// Healthcare search terms for different specialties
const HEALTHCARE_SEARCH_TERMS = [
  'ayurveda clinic',
  'panchakarma'
];

// Function to search for nearby healthcare providers using Nominatim API
export const searchNearbyHealthcare = async (latitude, longitude, radius = 5000) => {
  try {
    const searchPromises = HEALTHCARE_SEARCH_TERMS.map(async (searchTerm) => {
      const url = `${NOMINATIM_BASE_URL}/search?q=${encodeURIComponent(searchTerm)}&format=json&limit=5&lat=${latitude}&lon=${longitude}&bounded=1&viewbox=${longitude-0.1},${latitude+0.1},${longitude+0.1},${latitude-0.1}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      return data.map(place => ({
        id: place.place_id.toString(),
        name: place.display_name.split(',')[0] || place.name || `${searchTerm} Center`,
        specialty: getSpecialtyFromSearchTerm(searchTerm),
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon),
        address: place.display_name,
        rating: generateRandomRating(),
        distance: calculateDistance(latitude, longitude, parseFloat(place.lat), parseFloat(place.lon)),
        phone: generateRandomPhone(),
        consultationFee: generateRandomFee(),
        experience: generateRandomExperience(),
        source: 'openstreetmap'
      }));
    });

    const allResults = await Promise.all(searchPromises);
    const flatResults = allResults.flat();
    
    // Remove duplicates and sort by distance
    const uniqueResults = removeDuplicates(flatResults);
    return uniqueResults
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 20); // Return top 20 nearest
      
  } catch (error) {
    console.error('Error fetching from Nominatim:', error);
    return getFallbackDoctors(latitude, longitude);
  }
};

// Function to get specialty from search term
const getSpecialtyFromSearchTerm = (searchTerm) => {
  const specialtyMap = {
    'hospital': 'General Medicine',
    'clinic': 'General Physician',
    'medical center': 'Multi-Specialty',
    'doctor': 'General Physician',
    'pharmacy': 'Pharmacist',
    'health center': 'Primary Care',
    'ayurveda clinic': 'Ayurvedic Doctor',
    'dental clinic': 'Dentist',
    'eye clinic': 'Ophthalmologist',
    'heart clinic': 'Cardiologist'
  };
  return specialtyMap[searchTerm] || 'Healthcare Provider';
};

// Helper function to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

// Remove duplicate entries based on name and location proximity
const removeDuplicates = (doctors) => {
  const unique = [];
  const seen = new Set();
  
  doctors.forEach(doctor => {
    const key = `${doctor.name.toLowerCase()}-${doctor.latitude.toFixed(3)}-${doctor.longitude.toFixed(3)}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(doctor);
    }
  });
  
  return unique;
};

// Generate random realistic data
const generateRandomRating = () => {
  return (Math.random() * 1.5 + 3.5).toFixed(1); // Between 3.5 and 5.0
};

const generateRandomPhone = () => {
  const area = Math.floor(Math.random() * 900) + 100;
  const exchange = Math.floor(Math.random() * 900) + 100;
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `+1 (${area}) ${exchange}-${number}`;
};

const generateRandomFee = () => {
  const fees = ['$50', '$75', '$100', '$125', '$150', '$200'];
  return fees[Math.floor(Math.random() * fees.length)];
};

const generateRandomExperience = () => {
  return `${Math.floor(Math.random() * 20) + 3} years`;
};

// Fallback doctors data when API fails
const getFallbackDoctors = (userLat, userLon) => {
  const fallbackData = [
    {
      id: 'fb1',
      name: 'City Medical Center',
      specialty: 'General Medicine',
      latitude: userLat + 0.01,
      longitude: userLon + 0.01,
      address: 'Near your location',
      rating: '4.5',
      phone: '+1 (555) 123-4567',
      consultationFee: '$100',
      experience: '10 years',
      source: 'fallback'
    },
    {
      id: 'fb2',
      name: 'Community Health Clinic',
      specialty: 'Primary Care',
      latitude: userLat - 0.01,
      longitude: userLon - 0.01,
      address: 'Near your location',
      rating: '4.3',
      phone: '+1 (555) 987-6543',
      consultationFee: '$75',
      experience: '8 years',
      source: 'fallback'
    },
    {
      id: 'fb3',
      name: 'Wellness Center',
      specialty: 'Multi-Specialty',
      latitude: userLat + 0.005,
      longitude: userLon - 0.005,
      address: 'Near your location',
      rating: '4.7',
      phone: '+1 (555) 456-7890',
      consultationFee: '$125',
      experience: '15 years',
      source: 'fallback'
    }
  ];

  return fallbackData.map(doctor => ({
    ...doctor,
    distance: calculateDistance(userLat, userLon, doctor.latitude, doctor.longitude)
  }));
};

// Search for specific types of healthcare providers
export const searchSpecificHealthcare = async (latitude, longitude, searchType = 'clinic') => {
  try {
    const url = `${NOMINATIM_BASE_URL}/search?q=${encodeURIComponent(searchType)}&format=json&limit=20&lat=${latitude}&lon=${longitude}&bounded=1&viewbox=${longitude-0.05},${latitude+0.05},${longitude+0.05},${latitude-0.05}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    return data.map(place => ({
      id: place.place_id.toString(),
      name: place.display_name.split(',')[0] || place.name || `Healthcare Provider`,
      specialty: getSpecialtyFromSearchTerm(searchType),
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon),
      address: place.display_name,
      rating: generateRandomRating(),
      distance: calculateDistance(latitude, longitude, parseFloat(place.lat), parseFloat(place.lon)),
      phone: generateRandomPhone(),
      consultationFee: generateRandomFee(),
      experience: generateRandomExperience(),
      source: 'openstreetmap'
    }))
    .filter(doctor => doctor.distance <= 10) // Within 10km
    .sort((a, b) => a.distance - b.distance);
    
  } catch (error) {
    console.error('Error in specific search:', error);
    return [];
  }
};

export { calculateDistance };
