import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";


export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View>
            <Text>
                Create an account
            </Text>
            <TextInput placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
            <Pressable>
                <Text>Register</Text>
            </Pressable>

            <Pressable onPress={() => {console.log("Do Nothing")}}>
                <Text>Already have an account? Log in</Text>
            </Pressable>
        </View>
    );
}