// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import Api from '../services/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';



const ProfileScreen = () => {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await axios.get(Api.get_auth_profile, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setUserProfile(response.data.user_info);
      } catch (error) {
        console.error('Error fetching user profile:', error.message || error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load profile.</Text>
      </View>
    );
  }

  const { user, phone_no, date_of_birth, gender, profile_pic, address, bio } =
    userProfile;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Picture */}
      <View style={styles.profilePicContainer}>
        <Image
          source={{
            uri: profile_pic
              ? `${Api.baseUrl}${profile_pic}`
              : 'https://via.placeholder.com/150', // Default placeholder image
          }}
          style={styles.profilePic}
        />
      </View>

      {/* Full Name */}
      <Text style={styles.name}>
        {user.first_name} {user.last_name}
      </Text>

      {/* Username */}
      <Text style={styles.username}>@{user.username}</Text>

      {/* Email */}
      <Text style={styles.infoText}>{user.email}</Text>

      {/* Phone Number */}
      <Text style={styles.infoText}>
        Phone: {phone_no || 'Not provided'}
      </Text>

      {/* Date of Birth */}
      <Text style={styles.infoText}>
        Date of Birth: {date_of_birth || 'Not provided'}
      </Text>

      {/* Gender */}
      <Text style={styles.infoText}>
        Gender: {gender || 'Not provided'}
      </Text>

      {/* Address */}
      <Text style={styles.infoText}>
        Address: {address || 'Not provided'}
      </Text>

      {/* Bio */}
      <Text style={styles.bioText}>
        Bio: {bio || 'No bio available'}
      </Text>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#f9fafb', // Light gray background
    padding: 20,
  },
  profilePicContainer: {
    marginBottom: 20,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75, // Circular profile picture
    borderWidth: 2,
    borderColor: '#3b82f6', // Blue border
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333', // Dark gray text
    marginBottom: 8,
  },
  username: {
    fontSize: 18,
    color: '#3b82f6', // Blue text for username
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#666666', // Lighter gray text
    marginBottom: 8,
  },
  bioText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  editButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
  },
  editButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c', // Red text for errors
    textAlign: 'center',
    marginTop: 20,
  },
});