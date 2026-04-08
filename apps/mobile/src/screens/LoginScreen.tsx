import { useState } from "react";
import { Platform, KeyboardAvoidingView, ScrollView, View, Text, TextInput, Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import BrandHeader from "../components/BrandHeader";
import {authStyles as styles} from "../styles/auth.styles";
import authApi from "../api/auth";
import { useAuthStore } from "../stores/authStore";
import { getErrorMessage } from "../utils/apiError";
import AuthBackground from "../components/AuthBackground";
import AuthCard from "../components/AuthCard"

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
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
    <AuthBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inner}>
            <BrandHeader subtitle="Log workouts. Track progress." />

            <AuthCard
                title="Welcome back"
                footer={
                  <Pressable onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.link}>
                      Don't have an account? <Text style={styles.linkStrong}>Register</Text>
                    </Text>
                  </Pressable>
                }
              >
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

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Pressable style={styles.primaryButton} onPress={onSubmit} disabled={isSubmitting}>
                <Text style={styles.primaryButtonText}>{isSubmitting ? "Logging in..." : "Log in"}</Text>
              </Pressable>
            </AuthCard>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthBackground>
  );
}