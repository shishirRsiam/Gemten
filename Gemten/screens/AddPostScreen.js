// screens/AddPostScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import Api from '../services/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddPostScreen = ({ navigation }) => {
    const [content, setContent] = useState('');

    const handleAddPost = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await axios.post(Api.add_post,
                { content },
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            alert('Post created successfully!');
            setContent('');
            navigation.goBack(); // Navigate back to the previous screen
        } catch (error) {
            console.error('Error adding post:', error.response?.data || error.message);
            alert('Failed to create post. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create a New Post</Text>
            <TextInput
                style={styles.input}
                placeholder="What's on your mind?"
                value={content}
                onChangeText={setContent}
                multiline
            />
            <TouchableOpacity style={styles.button} onPress={handleAddPost}>
                <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddPostScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9fafb',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3b82f6',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#3b82f6',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});