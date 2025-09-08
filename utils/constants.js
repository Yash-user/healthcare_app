// app/utils/constants.js
// Mock User Data + sample heatmap data for frontend demo

export const heatmapSampleData = {
  // sample counts across a few dates (YYYY-MM-DD)
  "2025-09-01": 1,
  "2025-09-02": 2,
  "2025-09-03": 1,
  "2025-08-28": 1,
  "2025-08-15": 3,
  "2025-07-10": 2,
  "2025-07-22": 1,
  "2025-06-05": 4,
  "2025-06-18": 1,
};

export const userData = {
  id: "u1",
  name: "Nikunj Sharma",
  avatar: "https://i.pravatar.cc/150?img=32",
  email: "nikunj@dmail.com",
  address: "Pune, India",
  contact: "+91 6969696969",
  // <-- add a registration date so heatmap respects it in demos
  registeredAt: "2025-08-15",

  public: {
    age: 30,
    gender: "Male",
    heightCm: 175,
    weightKg: 72,
    bmi: 23.5,
    conditions: ["Hypertension"],
    allergies: ["Penicillin"],
    foodHabits: "Vegetarian",
    lifestyle: "Active",
    sleepPattern: "7-8 hrs",
  },

  stats: {
    appointments: 5,
    treatments: 3,
  },

  quickLinks: [
    { id: "q2", key: "My Prescriptions" },
    { id: "q3", key: "Payment History" },
  ],

  doshaAnswers: [
    { id: "d1", q: "Skin dryness?", a: "Sometimes" },
    { id: "d2", q: "Digestion regular?", a: "Yes" },
    { id: "d3", q: "Appetite good?", a: "Usually" },
  ],

  // use empty or minimal reports for demo; real app will fetch these from backend
  reports: [
    { id: "r1", title: "Blood Test", date: "2025-09-01" },
    { id: "r2", title: "MRI Scan", date: "2025-08-28" },
  ],
};

export default {
  heatmapSampleData,
  userData,
};
