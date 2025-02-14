import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import Api from '../services/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';



const ConversationShowingScreen = () => {
  const navigation = useNavigation();
  const [conversations, setConversations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); // Show loading indicator on first render

  const fetchConversations = async () => {
    try {
      setRefreshing(true); // Start refreshing
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await axios.get(Api.get_conversations, {
        headers: {
          Authorization: authToken,
        },
      });

      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error.message || error);
    } finally {
      setRefreshing(false); // Stop refreshing
      setLoading(false); // Hide loading indicator
    }
  };

  // Fetch conversations when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchConversations();
    }, [navigation])
  );

  const handleConversationPress = (conversationId) => {
    console.log('Conversation pressed:', conversationId);
    navigation.navigate('Chat', { conversationId });
  };

  const renderConversation = ({ item }) => {
    const receiver = item.receiver;
    return (
      <TouchableOpacity style={styles.conversationContainer} onPress={() => handleConversationPress(item.id)}>
        <Image
          source={{ uri: receiver.avatar || 'https://w7.pngwing.com/pngs/388/487/png-transparent-computer-icons-graphy-img-landscape-graphy-icon-miscellaneous-angle-text-thumbnail.png' }}
          style={styles.avatar}
        />
        <View style={styles.conversationDetails}>
          <Text style={styles.name}>
            @{receiver.username} {(receiver.username === 'shishir' || receiver.username === 'gemten') && (
              <Icon name="checkmark-circle" size={16} color="#1DA1F2" />
            )}
          </Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.last_message ? item.last_message : 'No messages yet'}
          </Text>
        </View>
        <Text style={styles.timestamp}>{new Date(item.updated_at).toLocaleTimeString()}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>

      {/* Loading Indicator on First Load */}
      {loading ? (
        <ActivityIndicator size="large" color="#1DA1F2" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderConversation}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchConversations} colors={['#1DA1F2']} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listContainer: {
    paddingVertical: 10,
  },
  conversationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  conversationDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#aaa',
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default ConversationShowingScreen;
