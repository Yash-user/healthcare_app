import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";

export default function SignUp() {
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const handleSignUp = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      // Send email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      Alert.alert("Error", err.errors?.[0]?.message || "Sign-up failed");
    }
  };

  const handleVerification = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/home");
      } else {
        Alert.alert("Error", "Verification failed");
      }
    } catch (err) {
      Alert.alert("Error", err.errors?.[0]?.message || "Verification failed");
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          Enter the verification code sent to {email}
        </Text>

        <TextInput
          placeholder="Enter verification code"
          style={styles.input}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
        />

        <TouchableOpacity style={styles.signupBtn} onPress={handleVerification}>
          <Text style={styles.signupText}>Verify</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SIGN UP</Text>
      <Text style={styles.subtitle}>Create your account</Text>

      <TextInput
        placeholder="First Name"
        style={styles.input}
        placeholderTextColor="#888"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        placeholder="Last Name"
        style={styles.input}
        placeholderTextColor="#888"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        placeholder="Enter Email"
        style={styles.input}
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Enter Password"
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.signupBtn} onPress={handleSignUp}>
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.loginText}> Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  signupBtn: {
    backgroundColor: "#6C63FF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  signupText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  loginText: {
    color: "#6C63FF",
    fontWeight: "bold",
  },
});
