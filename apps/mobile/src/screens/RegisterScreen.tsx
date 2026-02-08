import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import BrandHeader from "../components/BrandHeader";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>

      <BrandHeader subtitle="Log workouts. Track progress." />

      <Text style={styles.title}>Create your account</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#6B7280"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#6B7280"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Register</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>
          Already have an account? <Text style={styles.linkStrong}>Log In</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8F7",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    height: 96,
    marginBottom: 32,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#1F2933",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    color: "#111827",
  },
  primaryButton: {
    backgroundColor: "#1F2933",
    padding: 16,
    borderRadius: 10,
    marginTop: 12,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#6B7280",
  },
  linkStrong: {
    color: "#1F2933",
    fontWeight: "600",
  },
});