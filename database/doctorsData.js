// Database of nearby doctors with real coordinates
// These coordinates are spread around a general metropolitan area
// You can replace these with actual coordinates for your city

export const nearbyDoctorsDB = [
  {
    id: '1',
    name: 'Dr. Ram Bhagat',
    specialty: 'Cardiologist',
    rating: 4.5,
    image: require('../assets/doctor2.jpeg'),
    latitude: 37.7849,
    longitude: -122.4094,
    address: '1234 Heart Medical Center, Downtown',
    phone: '+1 (555) 123-4567',
    experience: '15 years',
    consultationFee: '$150',
  },
  {
    id: '2',
    name: 'Dr. Shreevatsa Acharya',
    specialty: 'Neurologist',
    rating: 4.8,
    image: require('../assets/doctor3.jpeg'),
    latitude: 37.7749,
    longitude: -122.4194,
    address: '5678 Brain Health Clinic, Medical District',
    phone: '+1 (555) 987-6543',
    experience: '12 years',
    consultationFee: '$200',
  },
  {
    id: '3',
    name: 'Dr. Samir Gupta',
    specialty: 'General Physician',
    rating: 4.7,
    image: require('../assets/doctor1.jpeg'),
    latitude: 37.7649,
    longitude: -122.4294,
    address: '9012 Family Care Center, Suburb Plaza',
    phone: '+1 (555) 456-7890',
    experience: '10 years',
    consultationFee: '$100',
  },
  {
    id: '4',
    name: 'Dr. Yash Bindal',
    specialty: 'Dermatologist',
    rating: 4.6,
    image: require('../assets/doctor1.jpeg'),
    latitude: 37.7949,
    longitude: -122.3994,
    address: '3456 Skin Care Specialist, North End',
    phone: '+1 (555) 234-5678',
    experience: '8 years',
    consultationFee: '$120',
  },
  {
    id: '5',
    name: 'Dr. Priya Sharma',
    specialty: 'Pediatrician',
    rating: 4.9,
    image: require('../assets/doctor2.jpeg'),
    latitude: 37.7549,
    longitude: -122.4394,
    address: '7890 Children\'s Health Center, West Side',
    phone: '+1 (555) 345-6789',
    experience: '14 years',
    consultationFee: '$110',
  },
  {
    id: '6',
    name: 'Dr. Arjun Patel',
    specialty: 'Orthopedic Surgeon',
    rating: 4.4,
    image: require('../assets/doctor3.jpeg'),
    latitude: 37.7850,
    longitude: -122.4000,
    address: '2468 Bone & Joint Institute, Central',
    phone: '+1 (555) 567-8901',
    experience: '18 years',
    consultationFee: '$250',
  },
  {
    id: '7',
    name: 'Dr. Kavya Reddy',
    specialty: 'Gynecologist',
    rating: 4.7,
    image: require('../assets/doctor1.jpeg'),
    latitude: 37.7650,
    longitude: -122.4100,
    address: '1357 Women\'s Health Clinic, East District',
    phone: '+1 (555) 678-9012',
    experience: '11 years',
    consultationFee: '$180',
  },
  {
    id: '8',
    name: 'Dr. Vikram Singh',
    specialty: 'Psychiatrist',
    rating: 4.8,
    image: require('../assets/doctor2.jpeg'),
    latitude: 37.7750,
    longitude: -122.4200,
    address: '9753 Mental Wellness Center, South Bay',
    phone: '+1 (555) 789-0123',
    experience: '16 years',
    consultationFee: '$160',
  },
  {
    id: '9',
    name: 'Dr. Meera Joshi',
    specialty: 'Ophthalmologist',
    rating: 4.5,
    image: require('../assets/doctor3.jpeg'),
    latitude: 37.7950,
    longitude: -122.4150,
    address: '4682 Eye Care Center, Vision Plaza',
    phone: '+1 (555) 890-1234',
    experience: '9 years',
    consultationFee: '$140',
  },
  {
    id: '10',
    name: 'Dr. Rahul Kumar',
    specialty: 'Endocrinologist',
    rating: 4.6,
    image: require('../assets/doctor1.jpeg'),
    latitude: 37.7600,
    longitude: -122.4250,
    address: '8024 Diabetes & Hormone Clinic, Metro',
    phone: '+1 (555) 901-2345',
    experience: '13 years',
    consultationFee: '$170',
  },
];

// Helper function to calculate distance between two coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

// Function to get doctors sorted by distance from user location
export const getDoctorsByDistance = (userLatitude, userLongitude) => {
  return nearbyDoctorsDB
    .map(doctor => {
      const distance = calculateDistance(
        userLatitude,
        userLongitude,
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

// Function to filter doctors by specialty
export const getDoctorsBySpecialty = (specialty) => {
  return nearbyDoctorsDB.filter(doctor => 
    doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
  );
};

// Function to get doctors within a certain radius
export const getDoctorsInRadius = (userLatitude, userLongitude, radiusKm = 10) => {
  return nearbyDoctorsDB.filter(doctor => {
    const distance = calculateDistance(
      userLatitude,
      userLongitude,
      doctor.latitude,
      doctor.longitude
    );
    return distance <= radiusKm;
  });
};
