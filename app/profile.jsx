// app/screens/Profile.jsx
import React from "react";
import { ScrollView } from "react-native";
import ProfileHeader from "../components/ProfileHeader";
import InfoItems from "../components/InfoItems";



export default function Profile({ user = userData }) {
  const infoItems = [
    { key: "Full name", value: user.name },
    { key: "Age", value: user.public.age },
    { key: "Gender", value: user.public.gender },
    { key: "Height", value: `${user.public.heightCm} cm` },
    { key: "Weight", value: `${user.public.weightKg} kg` },
    { key: "BMI", value: user.public.bmi },
    { key: "Major conditions", value: (user.public.conditions || []).join(", ") || "—", fullWidth: true },
    { key: "Allergies", value: (user.public.allergies || []).join(", ") || "—", fullWidth: true },
    { key: "Food habits", value: user.public.foodHabits || "—" },
    { key: "Lifestyle", value: user.public.lifestyle || "—" },
    { key: "Sleep", value: user.public.sleepPattern || "—" },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f9f9f9", padding: 16, paddingTop: 40 }}>
      <ProfileHeader user={user} />
      <InfoItems items={infoItems} />
    </ScrollView>
  );
}
