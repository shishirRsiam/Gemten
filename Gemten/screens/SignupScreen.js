import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import Api from '../services/Api';




const SignupScreen = ({ navigation, onSignup }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleSignup = async () => {
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword || !phoneNo || !dob) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    const userData = {
      first_name: firstName,
      last_name: lastName,
      username,
      email,
      password,
      phone_no: phoneNo,
      date_of_birth: dob,
      gender,
    };


    try {
      const response = await axios.post(Api.register, userData);      
    } catch (error) {
      Alert.alert('Error', `Signup failed: ${error.response.data.title}`);
      return;
    }
    
    Alert.alert('Success', 'Account created successfully');
  };

  // Function to show the date picker
  const showDatePicker = () => setDatePickerVisible(true);

  // Function to hide the date picker
  const hideDatePicker = () => setDatePickerVisible(false);

  // Function to handle date selection
  const handleConfirm = (date) => {
    setDob(date.toISOString().split('T')[0]);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Gemten Sign Up</Text>

      {/* First Name Input */}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
      />

      {/* Last Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="words"
      />

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Confirm Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* Phone Number Input */}
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNo}
        onChangeText={setPhoneNo}
        keyboardType="phone-pad"
      />

      {/* Date of Birth Input with Date Picker */}
      <TouchableOpacity onPress={showDatePicker} style={styles.input}>
        <Text style={dob ? styles.selectedDate : styles.placeholderDate}>
          {dob || 'Select Date of Birth (YYYY-MM-DD)'}
        </Text>
      </TouchableOpacity>

      {/* Gender Selector */}
      <View style={styles.genderContainer}>
        <TouchableOpacity onPress={() => setGender('Male')} style={styles.genderButton}>
          <Text style={gender === 'Male' ? styles.selectedGender : styles.gender}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setGender('Female')} style={styles.genderButton}>
          <Text style={gender === 'Female' ? styles.selectedGender : styles.gender}>Female</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Up Button */}
      <Button title="Sign Up" onPress={handleSignup} />

      {/* Go to Login Button */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderDate: {
    color: '#999', // Light gray for placeholder text
  },
  selectedDate: {
    color: '#333', // Dark gray for selected date
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 15,
  },
  genderButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  gender: {
    color: '#333',
  },
  selectedGender: {
    color: '#3b82f6', // Highlight selected gender with blue
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 15,
    color: '#3b82f6', // Blue text
    textDecorationLine: 'underline',
  },
});

export default SignupScreen;
