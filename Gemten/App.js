import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import axios from 'axios';
import Api from './services/Api';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ProfileScreen from './screens/ProfileScreen';
import PostDetailsScreen from './screens/PostDetailsScreen';
import AddPostScreen from './screens/AddPostScreen'; // New screen for adding posts
import Icon from 'react-native-vector-icons/Ionicons'; // For icons

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthenticatedScreens = ({ setUser }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken'); 
      setUser(null); 
      
    } catch (error) {
      console.error('Error logging out:', error.message);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Add Post') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Logout') {
            iconName = focused ? 'log-out' : 'log-out-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6', // Active tab color
        tabBarInactiveTintColor: '#999', // Inactive tab color
        tabBarStyle: {
          backgroundColor: '#fff', // Background color of the tab bar
          borderTopWidth: 1,
          borderTopColor: '#ddd',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Feed', headerShown: false }}
      />
      <Tab.Screen
        name="Add Post"
        component={AddPostScreen}
        options={{ title: 'Add Post', headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile', headerShown: false }}
      />
      <Tab.Screen
        name="Logout"
        component={View} // Placeholder component
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault(); // Prevent default navigation
            Alert.alert(
              'Logout',
              'Are you sure you want to log out?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Logout',
                  onPress: handleLogout,
                },
              ],
              { cancelable: true }
            );
          },
        })}
        options={{
          title: 'Logout',
          tabBarLabel: 'Logout',
        }}
      />
    </Tab.Navigator>
  );
};

// Unauthenticated User Screens (Login and Signup)
const UnauthenticatedScreens = ({ setUser }) => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
        initialParams={{ setUser }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.get(Api.get_auth_profile, {
            headers: {
              Authorization: `${token}`,
            },
          });
          setUser(response.data.user_info);
        } catch (error) {
          alert('Error fetching user data');
          console.error('Error fetching user data:', error.response?.data || error.message);
        }
      }
    };
    checkAuth();
  }, []);

  return (
    <NavigationContainer>
      {user ? (
        <AuthenticatedScreens setUser={setUser} />
      ) : (
        <UnauthenticatedScreens setUser={setUser} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});