import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const ConversationShowingScreen = () => {
  const navigation = useNavigation();

  const conversations = [
    {
      id: '1',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=1',
      lastMessage: 'Hey, how are you?',
      timestamp: '10:30 AM',
    },
    {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
      lastMessage: 'Let’s meet tomorrow.',
      timestamp: 'Yesterday',
    },
    {
      id: '3',
      name: 'Alice Johnson',
      avatar: 'https://i.pravatar.cc/150?img=3',
      lastMessage: 'I sent you the files.',
      timestamp: '2 days ago',
    },
    {
      id: '4',
      name: 'Bob Brown',
      avatar: 'https://i.pravatar.cc/150?img=4',
      lastMessage: 'Are you free now?',
      timestamp: '3 days ago',
    },
  ];


  useEffect(() => {
    
  }, [navigation]);


  const handleConversationPress = (conversationId) => {
    // Handle conversation press action
    console.log('Conversation pressed:', conversationId);
    // You can navigate to the conversation screen here
    navigation.navigate('Chat', { conversationId });
  };

  // Render each conversation item
  const renderConversation = ({ item }) => (
    <TouchableOpacity style={styles.conversationContainer} onPress={() => handleConversationPress(item.id)}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.conversationDetails}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>

      {/* List of Conversations */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        contentContainerStyle={styles.listContainer}
      />
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
});

export default ConversationShowingScreen;