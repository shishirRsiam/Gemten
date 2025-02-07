// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import axios from 'axios';
import Api from '../services/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
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
        setPosts(response.data.posts);
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.errorContainer}>
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
        <Image source={{ uri: 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png' }} style={styles.profilePic} />
      </View>

      {/* Full Name */}
      <Text style={styles.name}>
        {user.first_name} {user.last_name}
      </Text>

      {/* Username */}
      <Text style={styles.username}>@{user.username}</Text>
      {/* Bio Section */}
      <View style={styles.bioSection}>
        {/* <Text style={styles.sectionTitle}>About Me</Text> */}
        <Text style={styles.bioText}>{bio || 'No bio available'}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* User Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{phone_no || 'Not provided'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Date of Birth:</Text>
          <Text style={styles.infoValue}>{date_of_birth || 'Not provided'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Gender:</Text>
          <Text style={styles.infoValue}>{gender || 'Not provided'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoValue}>{address || 'Not provided'}</Text>
        </View>
      </View>

      {/* Bio Section */}
      {/* <View style={styles.bioSection}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.bioText}>{bio || 'No bio available'}</Text>
      </View> */}

      {/* Edit Profile Button */}
      {/* <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity> */}

      {/* Posts List */}
      {posts.length > 0 ? (
        <FlatList data={posts} keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              {/* User Info Section */}
              <View style={styles.userInfo}>
                <Image
                  source={{ uri: item.user.profile_pic || 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png' }}
                  style={styles.PostProfilePic}
                />
                <View style={styles.userDetails}>
                  <TouchableOpacity onPress={async () => {
                    const username = await AsyncStorage.getItem('userName')
                    if (item.user.username == username) navigation.navigate('Profile')
                    else navigation.navigate('OtherProfile', { id: item.user.id });
                  }}>
                    <Text style={styles.username}>
                      @{item.user.username} {item.user.username === 'shishir' && (
                        <Icon name="checkmark-circle" size={16} color="#1DA1F2" />
                      )}
                    </Text>
                  </TouchableOpacity>


                  <Text style={styles.fullName}>
                    {item.views} views • {new Date(item.created_at).toLocaleString()}
                  </Text>
                </View>
              </View>


              {/* Post Content */}
              <Text style={styles.postContent}>{item.content}</Text>

              {/* Media Section */}
              {item.media && item.media.length > 0 ? (
                <View horizontal showsHorizontalScrollIndicator={false}>
                  {item.media.map((mediaItem, index) => (
                    <Image
                      key={index}
                      source={{ uri: mediaItem.url }}
                      style={styles.mediaImage}
                    />
                  ))}
                </View>
              ) : null}

              {/* Post Actions */}
              <View style={styles.postActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleLikePost(item.id)}>
                  <Icon name={item.is_liked ? 'heart' : 'heart-outline'} size={24} color={item.is_liked ? '#ff4444' : '#333'} />
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

    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  postForm: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
    marginBottom: 0,
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
  PostProfilePic: {
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
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff', // White background
    padding: 20,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 18,
    color: '#666666',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c', // Red text for errors
  },
  profilePicContainer: {
    marginBottom: 20,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75, // Circular profile picture
    borderWidth: 3,
    borderColor: '#3b82f6', // Blue border
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333', // Dark gray text
    marginBottom: 8,
  },
  username: {
    fontSize: 20,
    color: '#3b82f6', // Blue text for username
    marginBottom: 2,
  },
  divider: {
    height: 1,
    width: '80%',
    backgroundColor: '#e0e0e0', // Light gray divider
    marginVertical: 20,
  },
  infoSection: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666666', // Lighter gray text
  },
  infoValue: {
    fontSize: 16,
    color: '#333333', // Dark gray text
    fontWeight: '500',
  },
  bioSection: {
    width: '100%',
    // marginBottom: 20,
  },
  bioText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  editButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  editButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});