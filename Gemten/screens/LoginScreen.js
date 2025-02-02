// screens/LoginScreen.js
import axios from 'axios';
import Api from '../services/Api';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';

import LoadingComponent from '../components/LoadingComponent';

const LoginScreen = ({ route, navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = route.params;

    const handleLogin = async () => {
        <LoadingComponent />
        const loginData = {
            user_info: email,
            password: password
        };
        try {
            const response = await axios.post(Api.login, loginData);
            setUser(response.data.user_info);
            alert("Login Successfull");
            await AsyncStorage.setItem("authToken", response.data.token);
        } catch (error) {
            alert("Login Failed Invalid Credentials");
            console.error("Login Error Opps:", error.response ? error.response.data : error.message);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput style={styles.input}
                placeholder="Type Email, Username or Phone Number"
                value={email} onChangeText={setEmail} />

            <TextInput style={styles.input}
                placeholder="Password"
                value={password} onChangeText={setPassword} />

            <Button title="Login" onPress={handleLogin} disabled={!email || !password} />

            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupLink}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

// Define custom styles using StyleSheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb', // Light gray background
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333333', // Dark gray text
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#ffffff', // White background for input
    },
    signupLink: {
        marginTop: 15,
        color: '#3b82f6', // Blue text
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;