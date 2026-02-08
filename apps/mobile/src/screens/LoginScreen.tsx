import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import BrandHeader from "../components/BrandHeader";
import {authStyles as styles} from "../styles/auth.styles";
import authApi from "../api/auth";
import { useAuthStore } from "../stores/authStore";
import { getErrorMessage } from "../utils/apiError";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setSession = useAuthStore((s) => s.setSession);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
        const data = await authApi.login({ email: email.trim(), password });
        setSession({ token: data.token, user: data.user });
    } 
    catch (err) {
        setError(getErrorMessage(err));
    }
    finally {
        setIsSubmitting(false);
    }
  }
    

  return (
    <View style={styles.container}>

      <BrandHeader subtitle="Log workouts. Track progress." />

      <Text style={styles.title}>Welcome back</Text>

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

      {error ? <Text style={{ color: "crimson", textAlign: "center", marginBottom: 12 }}>{error}</Text> : null}

      <Pressable style={styles.primaryButton} onPress={onSubmit} disabled={isSubmitting}>
        <Text style={styles.primaryButtonText}>{isSubmitting ? "Logging in..." : "Log in"}</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>
          Don't have an account? <Text style={styles.linkStrong}>Register</Text>
        </Text>
      </Pressable>
    </View>
  );
}