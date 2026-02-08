import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import BrandHeader from "../components/BrandHeader";
import {authStyles as styles} from "../styles/auth.styles";
import authApi from "../api/auth";
import { useAuthStore } from "../stores/authStore";
import { getErrorMessage } from "../utils/apiError";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setSession = useAuthStore((s) => s.setSession);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) return "Email is required.";
    if (!trimmedEmail.includes("@")) return "Enter a valid email.";
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";

    return null;
  };

  const onSubmit = async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const data = await authApi.register({ email: email.trim(), password });
      setSession({ token: data.token, user: data.user });
      
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {error ? <Text style={{ color: "crimson", textAlign: "center", marginBottom: 12 }}>{error}</Text> : null}

      <Pressable style={styles.primaryButton} onPress={onSubmit} disabled={isSubmitting}>
        <Text style={styles.primaryButtonText}>{isSubmitting ? "Registering..." : "Register"}</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>
          Already have an account? <Text style={styles.linkStrong}>Log In</Text>
        </Text>
      </Pressable>
    </View>
  );
}