import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PostDetailsScreen = ({ route }) => {
  // Extract post data from route.params
  const { title, content, author } = route.params;

  return (
    <View style={styles.container}>
      {/* Post Title */}
      <Text style={styles.title}>{title}</Text>
      
      {/* Post Content */}
      <Text style={styles.content}>{content}</Text>
      
      {/* Post Author */}
      <Text style={styles.author}>By: {author}</Text>
    </View>
  );
};

// Define custom styles using StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafb', // Light gray background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333', // Dark gray text
    marginBottom: 16, // Add some spacing below the title
  },
  content: {
    fontSize: 16,
    color: '#555555', // Medium gray text
    marginBottom: 16, // Add some spacing below the content
  },
  author: {
    fontSize: 14,
    color: '#888888', // Light gray text
    fontStyle: 'italic', // Italicize the author's name
  },
});

export default PostDetailsScreen;