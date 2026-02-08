import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";


export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View>
            <Text>
                Log in
            </Text>
            <TextInput placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
            <Pressable>
                <Text>Log in</Text>
            </Pressable>

            <Pressable onPress={() => {console.log("Do Nothing")}}>
                <Text>No account? Register</Text>
            </Pressable>
        </View>
    );
}