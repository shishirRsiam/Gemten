import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import axios from 'axios';
import Api from './services/Api';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ProfileScreen from './screens/ProfileScreen';
import PostDetailsScreen from './screens/PostDetailsScreen';


const Authenticated = ({ user }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const SignupAndLoginPage = ({ setUser }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} initialParams={{ setUser }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


const Stack = createNativeStackNavigator();
export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.get(Api.get_auth_profile, {
            headers: {
              'Authorization': `${token}`
            }
          });
          setUser(response.data.user_info);
          console.log('Response:', response.data);
        } catch (error) {
          alert('Error fetching user data');
          console.error('Error fetching user data:', error.response.data);
        }
      }
    };
    checkAuth();
  }, []);

  return user ? <Authenticated user={user} /> : <SignupAndLoginPage setUser={setUser} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});