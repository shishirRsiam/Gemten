import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import Api from '../services/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import io from 'socket.io-client';

const SOCKET_URL = 'http://192.168.0.102:3000'; // Replace with your server URL
const socket = io(SOCKET_URL);

const ChatScreen = ({ navigation }) => {
  const [token, setToken] = useState(null);
  const flatListRef = useRef(null);
  const route = useRoute(); // Get route params
  const { conversationId } = route.params || {};
  const [apiMessages, setApiMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  // Fetch messages from the API
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${Api.get_messages}/${conversationId}/messages/`, {
        headers: {
          Authorization: await AsyncStorage.getItem('authToken')
        },
      });
      setApiMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to load messages. Please try again.');
    }
  };

  const setSoketConnection = async () => {
    const userId = await AsyncStorage.getItem('userName');
    if (userId) {
      console.log('username ==>', userId);
      socket.emit('set username', { userId });

      // Listen for incoming messages
      socket.on('chat message', (response) => {
        // setApiMessages((prevMessages) => [
        //   ...prevMessages,
        //   { senderId, content, id: Date.now() }, 
        // ]);
        // console.log('Received message:', content);
        // console.log('Received senderId:', senderId);
        console.log('Received response:', response);
        setApiMessages((prevMessages) => [response, ...prevMessages]);
      });
    }
  };

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setToken(token);
    }
    getToken();
    fetchMessages();
    setSoketConnection();
    console.log('Fetching messages...', conversationId);

    return () => {
      socket.off('chat message');
    };
  }, [conversationId]);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [apiMessages]);

  // Handle sending a new message
  const sendMessage = async () => {
    if (inputText.trim().length === 0) return;

    try {
      // Send the message to the server
      const response = await axios.post(
        `${Api.send_message}/${conversationId}/messages/`,
        { conversationId, content: inputText },
        {
          headers: {
            Authorization: await AsyncStorage.getItem('authToken'),
          },
        }
      );
      console.log('Message sent successfully');
      setApiMessages((prevMessages) => [response.data, ...prevMessages]); // Append new message to the list
      socket.emit('chat message', { authToken: token, chatId: conversationId, content: inputText });
      setInputText(''); // Clear the input field
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send the message. Please try again.');
    }
  };

  // Render chat messages
  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, !item.texted_me ? styles.rightMessage : styles.leftMessage]}>
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Message List */}
          <FlatList
            ref={flatListRef}
            data={apiMessages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.messagesContainer}
            inverted
            initialNumToRender={20} // Load initial items for smoother performance
            maxToRenderPerBatch={10} // Limit the number of items rendered per batch
            windowSize={5} // Number of items to keep in memory
          />

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={sendMessage} // Optional: Send message on "Enter" press
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    padding: 10,
    flexGrow: 1,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  leftMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#d1e7dd',
  },
  rightMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#cfe2ff',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
