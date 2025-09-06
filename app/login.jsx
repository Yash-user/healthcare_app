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
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useSignIn, useOAuth } from "@clerk/clerk-expo";

export default function Login() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow: googleOAuth } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: appleOAuth } = useOAuth({ strategy: "oauth_apple" });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push("/home");
      } else {
        Alert.alert("Error", "Login failed. Please try again.");
      }
    } catch (err) {
      Alert.alert("Error", err.errors?.[0]?.message || "Login failed");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await googleOAuth();
      if (createdSessionId) {
        setActive({ session: createdSessionId });
        router.push("/home");
      }
    } catch (err) {
      Alert.alert("Error", "Google sign-in failed");
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await appleOAuth();
      if (createdSessionId) {
        setActive({ session: createdSessionId });
        router.push("/home");
      }
    } catch (err) {
      Alert.alert("Error", "Apple sign-in failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WELCOME TO VEDA HUB!</Text>
      <Text style={styles.subtitle}>Use credentials to access your account</Text>
      
      {/* Email */}
      <TextInput
        placeholder="Enter Email"
        style={styles.input}
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password */}
      <TextInput
        placeholder="Enter Password"
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
      />

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Log in</Text>
      </TouchableOpacity>

      <Text style={styles.or}>OR</Text>

      {/* Google Sign in */}
      <TouchableOpacity style={styles.socialBtn} onPress={handleGoogleSignIn}>
        <AntDesign name="google" size={20} color="black" />
        <Text style={styles.socialText}>Sign in with Google</Text>
      </TouchableOpacity>

      {/* Apple Sign in */}
      <TouchableOpacity style={styles.socialBtn} onPress={handleAppleSignIn}>
        <FontAwesome name="apple" size={20} color="black" />
        <Text style={styles.socialText}>Sign in with Apple</Text>
      </TouchableOpacity>

      {/* Sign up */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupTextLine}>Don't have an account?</Text>
        <View style={styles.signupButtonsRow}>
          <TouchableOpacity>
            <Text style={styles.signupLink}>Sign up as a PATIENT</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.signupLink}>Sign up as a DOCTOR</Text>
          </TouchableOpacity>
        </View>
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
  forgot: {
    color: "#6C63FF",
    textAlign: "right",
    marginBottom: 20,
  },
  loginBtn: {
    backgroundColor: "#6C63FF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  or: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
    color: "#666",
  },
  socialBtn: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  socialText: {
    marginLeft: 10,
    fontSize: 16,
  },
  signupContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  signupTextLine: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  signupButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupLink: {
    fontSize: 14,
    color: "#6C63FF", // purple
    marginHorizontal: 10,
    textAlign: "center",
  },
});