// App.js
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Api from '../services/Api';

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Home Screen Loaded');
    const fetchPosts = async () => {
      try {
        const response = await axios.get(Api.get_posts);
        setPosts(response.data); // Update state with fetched data
        console.log(response.data); // Log response data
      } catch (error) {
        console.error('Error fetching posts:', error.message || error);
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gemten Feed</Text>

      {posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              {/* User Info Section */}
              <View style={styles.userInfo}>
                <Text style={styles.username}>@{item.user.username}</Text>
                <Text style={styles.fullName}>
                  {item.user.first_name} {item.user.last_name}
                </Text>
              </View>

              {/* Post Content */}
              <Text style={styles.postContent}>{item.content}</Text>

              {/* Timestamp */}
              <Text style={styles.timestamp}>
                {new Date(item.created_at).toLocaleString()}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noPostsText}>No posts available.</Text>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // Light gray background
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6', // Blue color
    marginBottom: 20,
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: '#ffffff', // White background for cards
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // For Android shadow
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  fullName: {
    fontSize: 14,
    color: '#666',
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  noPostsText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});