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
  Modal,
  Keyboard,
  Button,
} from 'react-native';
import axios from 'axios';
import Api from '../services/Api';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newComment, setNewComment] = useState({ post: null, content: '' });

  useFocusEffect(
    React.useCallback(() => {
      const fetchPosts = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          const response = await axios.get(Api.get_posts, {
            headers: {
              Authorization: `${token}`,
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
    }, [])
  );

  const handleLikePost = async (postId) => {
    try {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
              ...post,
              is_liked: !post.is_liked,
              likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1,
            }
            : post
        )
      );

      const api = `${Api.like_post}/${postId}/like/`;
      await axios.post(api, {}, {
        headers: {
          Authorization: await AsyncStorage.getItem('authToken'),
        },
      });
    } catch (error) {
      console.error('Error liking post:', error.message || error);
      alert('Failed to like the post. Please try again.');
    }
  };

  const handleAddComment = async () => {
    Keyboard.dismiss()
    try {
      if (!newComment.content.trim()) {
        alert('Comment cannot be empty');
        return;
      }

      const api = `${Api.add_comment}/`;
      const response = await axios.post(api, newComment, {
        headers: {
          Authorization: await AsyncStorage.getItem('authToken'),
        },
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === selectedPost.id
            ? {
              ...post,
              comments: [...(post.comments || []), response.data],
            }
            : post
        )
      );
      setSelectedPost((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), response.data],
      }));

      setNewComment({ post: null, content: '' });
    } catch (error) {
      console.error('Error adding comment:', error.message || error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const openCommentModal = (post) => {
    setSelectedPost(post);
    setIsModalVisible(true);
  };

  const closeCommentModal = () => {
    setSelectedPost(null);
    setIsModalVisible(false);
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
                {/* <Text style={styles.timestamp}>
                  Updated: {new Date(item.updated_at).toLocaleString()}
                </Text> */}
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {/* Like Button */}
                <TouchableOpacity style={styles.likeButton} onPress={() => handleLikePost(item.id)}>
                  <Text style={styles.likeButtonText}>
                    {item.is_liked ? '❤' : '🤍'} {item.likes_count}
                  </Text>
                </TouchableOpacity>

                {/* Comment Box */}
                <TouchableOpacity style={styles.commentBox} onPress={() => openCommentModal(item)}>
                  <Text style={styles.commentCount}>
                    💬 {item.comments?.length || 0} Comments
                  </Text>
                </TouchableOpacity>

              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noPostsText}>No posts available.</Text>
      )}

      {/* Comment Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Comments ({selectedPost?.comments?.length || 0})</Text>

            {/* Display Existing Comments */}
            {selectedPost?.comments && selectedPost.comments.length > 0 ? (
              <FlatList
                data={selectedPost.comments}
                keyExtractor={(comment) => comment.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.comment}>
                    <Text style={styles.commentAuthor}>
                      @{item.user.username}
                    </Text>
                    <Text style={styles.commentText}>{item.content}</Text>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.noCommentsText}>No comments yet.</Text>
            )}

            {/* Add Comment Input */}
            <View style={styles.addComment}>
              <TextInput style={styles.commentInput}
                placeholder="Add a comment..."
                value={newComment.post === selectedPost?.id ? newComment.content : ''}
                onChangeText={(content) =>
                  setNewComment({ post: selectedPost?.id, content })
                }
              />
              <TouchableOpacity
                style={styles.commentSubmitButton}
                onPress={handleAddComment}>
                <Text style={styles.commentSubmitButtonText} >Post</Text>
              </TouchableOpacity>
            </View>

            {/* Close Modal Button */}
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={closeCommentModal}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#e0f7fa', // Light blue background
    marginBottom: 10,
  },
  likeButtonText: {
    fontSize: 14,
    color: '#00796b', // Dark teal color
  },
  commentBox: {
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#e0f7fa', // Light blue background
    marginBottom: 10,
  },
  commentCount: {
    fontSize: 14,
    color: '#00796b', // Dark teal color
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
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
    textAlign: 'center',
    marginTop: 10,
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
  closeModalButton: {
    alignSelf: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 5,
  },
  closeModalButtonText: {
    fontSize: 14,
    color: '#00796b',
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