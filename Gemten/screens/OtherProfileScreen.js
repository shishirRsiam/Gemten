import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Api from '../services/Api';

import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const UserProfileScreen = ({ route }) => {
    const { id } = route.params;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${Api.get_other_profile}/${id}`,{
                headers: {
                    Authorization: await AsyncStorage.getItem('authToken'),
                },
            });
            setUser(response.data.user_profile);
        } catch (error) {
            console.error('Error fetching user data:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load profile.</Text>
            </View>
        );
    }

    const {
        user: { username, email, first_name, last_name },
        phone_no,
        date_of_birth,
        gender,
        profile_pic,
        address,
        bio,
    } = user;

    return (
        <View style={styles.container}>
            {/* Blurred Gradient Background */}
            <LinearGradient
                colors={['#6a11cb', '#2575fc']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Blur Overlay */}
            <View style={styles.blurOverlay} />

            <ScrollView contentContainerStyle={styles.contentContainer}>
                {/* Profile Picture */}
                <View style={styles.profilePicContainer}>
                    <Image
                        source={{
                            uri: profile_pic.startsWith('/')
                                ? `https://your-api-endpoint.com${profile_pic}`
                                : profile_pic,
                        }}
                        style={styles.profilePic}
                    />
                </View>

                {/* User Details */}
                <View style={styles.detailsContainer}>
                    <Text style={styles.name}>{`${first_name} ${last_name}`}</Text>
                    <Text style={styles.username}>@{username}</Text>
                    <Text style={styles.bio}>{bio || 'No bio available.'}</Text>

                    {/* Followers/Following Stats */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>1.2K</Text>
                            <Text style={styles.statLabel}>Followers</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>345</Text>
                            <Text style={styles.statLabel}>Following</Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Icon name="settings-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Icon name="chatbubble-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Icon name="notifications-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Additional Info Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.cardTitle}>About Me</Text>
                    <Text style={styles.cardText}>
                        {bio || 'This user has not added a bio yet.'}
                    </Text>
                    <Text style={styles.cardText}>
                        <Text style={styles.cardLabel}>Email:</Text> {email || 'Not provided'}
                    </Text>
                    <Text style={styles.cardText}>
                        <Text style={styles.cardLabel}>Phone:</Text> {phone_no || 'Not provided'}
                    </Text>
                    <Text style={styles.cardText}>
                        <Text style={styles.cardLabel}>Gender:</Text> {gender || 'Not provided'}
                    </Text>
                    <Text style={styles.cardText}>
                        <Text style={styles.cardLabel}>Date of Birth:</Text>{' '}
                        {date_of_birth || 'Not provided'}
                    </Text>
                    <Text style={styles.cardText}>
                        <Text style={styles.cardLabel}>Address:</Text> {address || 'Not provided'}
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default UserProfileScreen;

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    blurOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        // Use react-native-blur or similar libraries for true blur effect
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    loadingText: {
        fontSize: 18,
        color: '#3b82f6',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    errorText: {
        fontSize: 18,
        color: '#ff4d4d',
    },
    contentContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingTop: 50,
    },
    profilePicContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
    profilePic: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    detailsContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    username: {
        fontSize: 18,
        color: '#dcdcdc',
        marginBottom: 10,
    },
    bio: {
        fontSize: 16,
        color: '#e0e0e0',
        textAlign: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        marginBottom: 30,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#dcdcdc',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%',
        marginBottom: 30,
    },
    actionButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
    infoCard: {
        width: '90%',
        padding: 20,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    cardText: {
        fontSize: 16,
        color: '#e0e0e0',
        marginBottom: 5,
    },
    cardLabel: {
        fontWeight: 'bold',
        color: '#fff',
    },
});