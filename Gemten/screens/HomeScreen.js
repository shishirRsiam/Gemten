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
  ScrollView,
} from 'react-native';
import axios from 'axios';
import Api from '../services/Api';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // For icons

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
    Keyboard.dismiss();
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gemten Feed</Text>
      </View>

      {/* Posts List */}
      {posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              {/* User Info Section */}
              <View style={styles.userInfo}>
                <Image
                  source={{ uri: item.user.profile_pic || 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png' }}
                  style={styles.profilePic}
                />
                <View style={styles.userDetails}>
                  <Text style={styles.username}>
                    @{item.user.username} 
                  </Text>
                  <Text style={styles.fullName}>
                    {item.views} views • {new Date(item.created_at).toLocaleString()}
                  </Text>
                </View>
              </View>


              {/* Post Content */}
              <Text style={styles.postContent}>{item.content}</Text>

              {/* Media Section */}
              {item.media && item.media.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {item.media.map((mediaItem, index) => (
                    <Image
                      key={index}
                      source={{ uri: mediaItem.url }}
                      style={styles.mediaImage}
                    />
                  ))}
                </ScrollView>
              ) : null}

              {/* Post Actions */}
              <View style={styles.postActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleLikePost(item.id)}
                >
                  <Icon
                    name={item.is_liked ? 'heart' : 'heart-outline'}
                    size={24}
                    color={item.is_liked ? '#ff4444' : '#333'}
                  />
                  <Text style={styles.actionText}>{item.likes_count}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openCommentModal(item)}
                >
                  <Icon name="chatbubble-outline" size={24} color="#333" />
                  <Text style={styles.actionText}>{item.comments?.length || 0}</Text>
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
                    <Image
                      source={{ uri: item.user.profile_pic || 'https://via.placeholder.com/150' }}
                      style={styles.commentProfilePic}
                    />
                    <View style={styles.commentContent}>
                      <Text style={styles.commentAuthor}>@{item.user.username}</Text>
                      <Text style={styles.commentText}>{item.content}</Text>
                    </View>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.noCommentsText}>No comments yet.</Text>
            )}

            {/* Add Comment Input */}
            <View style={styles.addComment}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                value={newComment.post === selectedPost?.id ? newComment.content : ''}
                onChangeText={(content) =>
                  setNewComment({ post: selectedPost?.id, content })
                }
              />
              <TouchableOpacity
                style={styles.commentSubmitButton}
                onPress={handleAddComment}
              >
                <Text style={styles.commentSubmitButtonText}>Post</Text>
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
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: '#3b82f6',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userDetails: {
    flexDirection: 'column',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
  mediaImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginRight: 10,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  commentProfilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
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
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  commentSubmitButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#3b82f6',
    borderRadius: 20,
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
    borderRadius: 20,
  },
  closeModalButtonText: {
    fontSize: 14,
    color: '#00796b',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  noPostsText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});