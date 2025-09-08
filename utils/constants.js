// Mock User Data
export const userData = {
  id: "u1",
  name: "Nikunj Sharma",
  avatar: "https://i.pravatar.cc/150?img=32",
  email: "nikunj@dmail.com",
  address: "Pune, India",
  contact: "+91 6969696969",

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
    // { id: "q1", key: "Book Appointment", value: "" },  // removed for now
    { id: "q2", key: "My Prescriptions" },
    { id: "q3", key: "Payment History" },
  ],

  doshaAnswers: [
    { id: "d1", q: "Skin dryness?", a: "Sometimes" },
    { id: "d2", q: "Digestion regular?", a: "Yes" },
    { id: "d3", q: "Appetite good?", a: "Usually" },
  ],

  reports: [
    { id: "r1", title: "Blood Test", date: "2025-09-01" },
    { id: "r2", title: "MRI Scan", date: "2025-08-28" },
  ],
};

// Profile Action Buttons
export const profileButtons = [
  { id: "pb1", key: "My Prescriptions" },
  { id: "pb2", key: "Payment History" },
];

// Styles for Profile Action Buttons
export const profileButtonStyles = {
  container: {
    marginTop: 16,
    gap: 14,
  },
  button: {
    backgroundColor: "#2e86de",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
};
// returns { 'YYYY-MM-DD': count }
function buildMonthlyCounts(reports, year, month) {
  const counts = {};
  reports?.forEach(r => {
    // assume r.date exists as ISO or convert accordingly
    const iso = new Date(r.date).toISOString().slice(0,10);
    const d = new Date(iso);
    if (d.getFullYear() === year && d.getMonth() + 1 === month) {
      counts[iso] = (counts[iso] || 0) + 1;
    }
  });
  return counts;
}
