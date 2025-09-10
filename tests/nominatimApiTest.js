// Test file to demonstrate OpenStreetMap Nominatim API integration
// You can run this in a web browser console or Node.js to test the API

// Example API calls based on your IP location coordinates (28.6, 77.2 - Delhi area)

// 1. Search for Ayurveda clinics (as per your original request)
const testAyurvedaClinics = async () => {
  const url = 'https://nominatim.openstreetmap.org/search?q=ayurveda+clinic&format=json&limit=10&lat=28.6&lon=77.2';
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('Ayurveda Clinics found:', data.length);
    data.forEach((clinic, index) => {
      console.log(`${index + 1}. ${clinic.display_name}`);
      console.log(`   Location: ${clinic.lat}, ${clinic.lon}`);
      console.log(`   Type: ${clinic.type}`);
      console.log('---');
    });
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};



// Run all tests
const runAllTests = async () => {
  console.log('🧪 Testing OpenStreetMap Nominatim API...');
  console.log('📍 Location: Delhi, India (28.6, 77.2)');
  console.log('');
  
  console.log('🏥 Searching for Ayurveda Clinics...');
  await testAyurvedaClinics();
  
  console.log('✅ All tests completed!');
};

// Uncomment the line below to run tests
// runAllTests();

// Example usage in your app:
export const demoSearches = {
  testAyurvedaClinics,
  runAllTests
};

// Sample API response format:
const sampleResponse = [
  {
    "place_id": 123456789,
    "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
    "osm_type": "way",
    "osm_id": 987654321,
    "lat": "28.6234567",
    "lon": "77.2345678",
    "class": "amenity",
    "type": "clinic",
    "place_rank": 30,
    "importance": 0.5,
    "addresstype": "amenity",
    "name": "Example Ayurveda Clinic",
    "display_name": "Example Ayurveda Clinic, Street Name, Area, Delhi, 110001, India",
    "boundingbox": ["28.6234", "28.6235", "77.2345", "77.2346"]
  }
];

console.log('📚 OpenStreetMap Nominatim API Test Suite loaded!');
console.log('🔗 API Documentation: https://nominatim.org/release-docs/latest/api/Search/');
console.log('🌍 Coverage: Worldwide healthcare providers');
console.log('💰 Cost: Completely FREE!');
