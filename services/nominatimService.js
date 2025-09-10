// OpenStreetMap Nominatim API service for finding nearby healthcare providers
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// Rate limiting to respect Nominatim's usage policy
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

// Generic healthcare search terms
const HEALTHCARE_SEARCH_TERMS = [
  'Ayurvedic clinic',
];

// Rate-limited fetch function
const rateLimitedFetch = async (url, options = {}) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
  return fetch(url, {
    ...options,
    headers: {
      'User-Agent': 'HealthcareApp/1.0 (your-email@example.com)',
      'Accept': 'application/json',
      ...options.headers,
    },
  });
};

// Function to search for nearby healthcare providers using Nominatim API
export const searchNearbyHealthcare = async (latitude, longitude, radius = 5000) => {
  try {
    console.log(`Searching for healthcare providers near ${latitude}, ${longitude}`);
    
    const searchPromises = HEALTHCARE_SEARCH_TERMS.map(async (searchTerm) => {
      try {
        const url = `${NOMINATIM_BASE_URL}/search?q=${encodeURIComponent(searchTerm)}&format=json&limit=5&lat=${latitude}&lon=${longitude}&bounded=1&viewbox=${longitude-0.1},${latitude+0.1},${longitude+0.1},${latitude-0.1}`;
        
        const response = await rateLimitedFetch(url);
        
        if (!response.ok) {
          console.warn(`Nominatim API error for "${searchTerm}": ${response.status} ${response.statusText}`);
          return [];
        }
        
        const text = await response.text();
        
        // Check if response is valid JSON
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.warn(`Invalid JSON response from Nominatim for "${searchTerm}":`, text.substring(0, 200));
          return [];
        }
        
        // Ensure data is an array
        if (!Array.isArray(data)) {
          console.warn(`Unexpected data format from Nominatim for "${searchTerm}":`, data);
          return [];
        }
        
        return data.map(place => ({
          id: place.place_id.toString(),
          name: place.display_name.split(',')[0] || place.name || `${searchTerm} Center`,
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
      } catch (termError) {
        console.warn(`Error searching for "${searchTerm}":`, termError.message);
        return [];
      }
    });

    const allResults = await Promise.all(searchPromises);
    const flatResults = allResults.flat();
    
    if (flatResults.length === 0) {
      console.log('No results from Nominatim, using fallback data');
      return getFallbackDoctors(latitude, longitude);
    }
    
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
  // Generate Indian phone numbers
  const area = Math.floor(Math.random() * 90000) + 10000; // 5 digits
  const number = Math.floor(Math.random() * 90000) + 10000; // 5 digits
  return `+91 ${area}-${number}`;
};

const generateRandomFee = () => {
  const fees = ['₹300', '₹500', '₹750', '₹1000', '₹1200', '₹1500'];
  return fees[Math.floor(Math.random() * fees.length)];
};

const generateRandomExperience = () => {
  return `${Math.floor(Math.random() * 20) + 3} years`;
};

// Fallback doctors data when API fails - generic healthcare providers
const getFallbackDoctors = (userLat, userLon) => {
  const fallbackData = [
    {
      id: 'fb1',
      name: 'City Medical Center',
      latitude: userLat + 0.01,
      longitude: userLon + 0.01,
      address: 'Near Dwarka Sector 21, New Delhi',
      rating: '4.5',
      phone: '+91 98765-43210',
      consultationFee: '₹500',
      experience: '15 years',
      source: 'fallback'
    },
    {
      id: 'fb2',
      name: 'Community Health Clinic',
      latitude: userLat - 0.008,
      longitude: userLon - 0.012,
      address: 'Near Dwarka Sector 18, New Delhi',
      rating: '4.3',
      phone: '+91 87654-32109',
      consultationFee: '₹600',
      experience: '12 years',
      source: 'fallback'
    },
    {
      id: 'fb3',
      name: 'General Hospital',
      latitude: userLat + 0.005,
      longitude: userLon - 0.005,
      address: 'Near Dwarka Sector 19, New Delhi',
      rating: '4.7',
      phone: '+91 76543-21098',
      consultationFee: '₹450',
      experience: '18 years',
      source: 'fallback'
    },
    {
      id: 'fb4',
      name: 'Multi-Specialty Clinic',
      latitude: userLat - 0.015,
      longitude: userLon + 0.008,
      address: 'Near Dwarka Sector 23, New Delhi',
      rating: '4.6',
      phone: '+91 65432-10987',
      consultationFee: '₹700',
      experience: '20 years',
      source: 'fallback'
    },
    {
      id: 'fb5',
      name: 'Primary Care Center',
      latitude: userLat + 0.012,
      longitude: userLon + 0.006,
      address: 'Near Dwarka Sector 22, New Delhi',
      rating: '4.4',
      phone: '+91 54321-09876',
      consultationFee: '₹550',
      experience: '10 years',
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
    
    const response = await rateLimitedFetch(url);
    
    if (!response.ok) {
      console.warn(`Nominatim API error: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const text = await response.text();
    
    // Check if response is valid JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.warn(`Invalid JSON response from Nominatim for "${searchType}":`, text.substring(0, 200));
      return [];
    }
    
    // Ensure data is an array
    if (!Array.isArray(data)) {
      console.warn(`Unexpected data format from Nominatim for "${searchType}":`, data);
      return [];
    }
    
    return data.map(place => ({
      id: place.place_id.toString(),
      name: place.display_name.split(',')[0] || place.name || `Healthcare Provider`,
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
