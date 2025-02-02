// components/LoadingComponent.js
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingComponent = ({ message = 'Loading...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007BFF" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Optional: Set a background color
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default LoadingComponent;