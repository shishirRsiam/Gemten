// screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      {/* Profile Name */}
      <Text style={styles.name}>John Doe</Text>
      
      {/* Profile Email */}
      <Text style={styles.email}>johndoe@example.com</Text>
    </View>
  );
};

// Define custom styles using StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb', // Light gray background
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333', // Dark gray text
    marginBottom: 8, // Add some spacing below the name
  },
  email: {
    fontSize: 16,
    color: '#666666', // Lighter gray text
  },
});

export default ProfileScreen;