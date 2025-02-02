// App.js
import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import axios from 'axios';
import Api from '../services/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';



const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({ postId: null, text: '' });
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(Api.get_posts, {
          headers: {
            Authorization: await AsyncStorage.getItem('authToken'),
          },
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLikePost = async (postId) => {
    try {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
              ...post, is_liked: !post.is_liked,
              likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1,
            }
            : post
        )
      );
      
      const api = `${Api.like_post}/${postId}/like/`;
      const response = await axios.post(api, {}, {
        headers: {
          Authorization: await AsyncStorage.getItem('authToken'),
        },
      });
    } catch (error) {
      console.error('Error liking post:', error.message || error);
      alert('Failed to like the post. Please try again.');
    }
  };

  const handleAddComment = async (postId) => {
    try {
      if (!newComment.text.trim()) {
        alert('Comment cannot be empty');
        return;
      }

      const response = await axios.post(`${Api.add_comment}/${postId}/`, {
        content: newComment.text,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
              ...post,
              comments: [...(post.comments || []), response.data],
            }
            : post
        )
      );

      setNewComment({ postId: null, text: '' });
    } catch (error) {
      console.error('Error adding comment:', error.message || error);
      alert('Failed to add comment. Please try again.');
    }
  };

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
      <Text style={styles.title}>Social Media Feed</Text>

      {posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              {/* User Info Section */}
              <View style={styles.userInfo}>
                <Text style={styles.username}>{item.user.username}</Text>
                <Text style={styles.fullName}>
                  {item.user.first_name} {item.user.last_name}
                </Text>
              </View>

              {/* Post Content */}
              <Text style={styles.postContent}>{item.content}</Text>

              {/* Media Section */}
              {item.media && item.media.length > 0 ? (
                <View style={styles.mediaContainer}>
                  {item.media.map((mediaItem, index) => (
                    <Image
                      key={index}
                      source={{ uri: mediaItem.url }}
                      style={styles.mediaImage}
                    />
                  ))}
                </View>
              ) : null}

              {/* Views, Timestamp, and Likes */}
              <View style={styles.metaInfo}>
                <Text style={styles.metaText}>Views: {item.views}</Text>
                <Text style={styles.timestamp}>
                  Created: {new Date(item.created_at).toLocaleString()}
                </Text>
                <Text style={styles.timestamp}>
                  Updated: {new Date(item.updated_at).toLocaleString()}
                </Text>
              </View>

              {/* Like Button */}
              <TouchableOpacity style={styles.likeButton}
                onPress={() => handleLikePost(item.id)}>
                <Text style={styles.likeButtonText}>
                  {item.is_liked ? '❤' : '🤍'} {item.likes_count}
                </Text>
              </TouchableOpacity>

              {/* Comment Section */}
              <View style={styles.commentSection}>
                <Text style={styles.commentTitle}>Comments:</Text>
                {item.comments && item.comments.length > 0 ? (
                  item.comments.map((comment, index) => (
                    <View key={index} style={styles.comment}>
                      <Text style={styles.commentAuthor}>
                        {comment.user.username}
                      </Text>
                      <Text style={styles.commentText}>{comment.content}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noCommentsText}>No comments yet.</Text>
                )}

                {/* Add Comment Input */}
                <View style={styles.addComment}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    value={newComment.postId === item.id ? newComment.text : ''}
                    onChangeText={(text) =>
                      setNewComment({ postId: item.id, text })
                    }
                  />
                  <TouchableOpacity
                    style={styles.commentSubmitButton}
                    onPress={() => handleAddComment(item.id)}
                  >
                    <Text style={styles.commentSubmitButtonText}>Post</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  mediaImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  metaInfo: {
    marginBottom: 10,
  },
  metaText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  likeButton: {
    alignSelf: 'flex-start',
    paddingLeft: 10,
    paddingTop: 8,
    paddingRight: 10,
    paddingBottom: 8,
    borderRadius: 5,
    backgroundColor: '#e0f7fa', // Light blue background
    marginBottom: 10,
    fontSize: 14,
  },
  likeButtonText: {
    fontSize: 14,
    color: '#00796b', // Dark teal color
  },
  commentSection: {
    marginTop: 10,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  comment: {
    marginBottom: 10,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  noCommentsText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  addComment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  commentSubmitButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#3b82f6',
    borderRadius: 5,
  },
  commentSubmitButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
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