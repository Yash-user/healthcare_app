import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { ProgressBar } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Survey() {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [dob, setDob] = useState(new Date());
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [foodHabit, setFoodHabit] = useState("");
  const [lifestyle, setLifestyle] = useState("");
  const [sleep, setSleep] = useState({ wakeUp: "07:00", sleep: "23:00" });

  const totalSteps = 4;
  const progress = step / totalSteps;

  const toggleCondition = (condition) => {
    setMedicalConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  const renderPage = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text style={styles.title}>Select your gender</Text>
            {["Male", "Female", "Non-binary", "Prefer not to say"].map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.option, gender === g && styles.selected]}
                onPress={() => setGender(g)}
              >
                <Text style={styles.optionText}>{g}</Text>
              </TouchableOpacity>
            ))}
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.title}>Height (cm): {height}</Text>
            <Slider
              style={{ width: "100%" }}
              minimumValue={100}
              maximumValue={220}
              step={1}
              value={height}
              onValueChange={setHeight}
            />
            <Text style={styles.title}>Weight (kg): {weight}</Text>
            <Slider
              style={{ width: "100%" }}
              minimumValue={30}
              maximumValue={150}
              step={1}
              value={weight}
              onValueChange={setWeight}
            />
            <Text style={styles.title}>Date of Birth</Text>
            <DateTimePicker
              value={dob}
              mode="date"
              display="default"
              onChange={(event, selectedDate) =>
                setDob(selectedDate || dob)
              }
            />
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.title}>Do you have any medical conditions?</Text>
            {["Diabetes", "Hypertension", "Asthma"].map((condition) => (
              <TouchableOpacity
                key={condition}
                style={[
                  styles.option,
                  medicalConditions.includes(condition) && styles.selected,
                ]}
                onPress={() => toggleCondition(condition)}
              >
                <Text style={styles.optionText}>{condition}</Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.title}>Food Habit</Text>
            {["Vegetarian", "Non-Vegetarian", "Vegan"].map((habit) => (
              <TouchableOpacity
                key={habit}
                style={[styles.option, foodHabit === habit && styles.selected]}
                onPress={() => setFoodHabit(habit)}
              >
                <Text style={styles.optionText}>{habit}</Text>
              </TouchableOpacity>
            ))}
          </>
        );
      case 4:
        return (
          <>
            <Text style={styles.title}>Lifestyle</Text>
            {["Sedentary", "Active", "Very Active"].map((life) => (
              <TouchableOpacity
                key={life}
                style={[styles.option, lifestyle === life && styles.selected]}
                onPress={() => setLifestyle(life)}
              >
                <Text style={styles.optionText}>{life}</Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.title}>Sleep Pattern</Text>
            <Text style={styles.label}>Wake-up Time: {sleep.wakeUp}</Text>
            <Text style={styles.label}>Sleep Time: {sleep.sleep}</Text>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <ProgressBar progress={progress} color="#007AFF" style={styles.progress} />

      {/* Page Content */}
      <View style={styles.content}>{renderPage()}</View>

      {/* Navigation Buttons */}
      <View style={styles.nav}>
        {step > 1 && (
          <TouchableOpacity style={styles.navBtn} onPress={() => setStep(step - 1)}>
            <Text style={styles.navText}>Back</Text>
          </TouchableOpacity>
        )}
        {step < totalSteps ? (
          <TouchableOpacity style={styles.navBtn} onPress={() => setStep(step + 1)}>
            <Text style={styles.navText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.navBtn}>
            <Text style={styles.navText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  progress: { height: 6, borderRadius: 3, marginBottom: 20, marginTop: 80 },
  content: { flex: 1, justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "600", marginVertical: 12 },
  option: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginVertical: 6,
    alignItems: "center",
  },
  optionText: { fontSize: 16 },
  selected: { borderColor: "#007AFF", backgroundColor: "#eaf2ff" },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navBtn: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  navText: { color: "white", fontSize: 16, fontWeight: "600" },
  label: { fontSize: 16, marginVertical: 6 },
});
