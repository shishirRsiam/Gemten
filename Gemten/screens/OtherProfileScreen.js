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
    const [friendshipStatus, setFriendshipStatus] = useState(null); // Tracks friendship status

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${Api.get_other_profile}/${id}`, {
                headers: {
                    Authorization: await AsyncStorage.getItem('authToken'),
                },
            });
            setUser(response.data);
            setFriendshipStatus(response.data.friendship_status);
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
        user_profile: {
            user: { username, email, first_name, last_name },
            phone_no,
            date_of_birth,
            gender,
            profile_pic,
            address,
            bio,
        },
        auth,
    } = user;

    // Handle friendship actions
    const handleFriendshipAction = async (action) => {
        try {
            let api, newStatus;

            if (action === 'add_friend') {
                api = `${Api.connect}/${id}/?sent_request=true`;
                newStatus = 'request_sent';
            } else if (action === 'cancel_request') {
                api = `${Api.connect}/${id}/?cancel_requst=true`;
                newStatus = 'not_friends';
            } else if (action === 'accept_request') {
                api = `${Api.connect}/${id}/?accept_request=true`;
                newStatus = 'friends';
            } else if (action === 'reject_request') {
                api = `${Api.connect}/${id}/?reject_request=true`;
                newStatus = 'not_friends';
            }

            const response = await axios.post(api, {}, {
                headers: {
                    Authorization: `${await AsyncStorage.getItem('authToken')}`,
                },
            });
            setFriendshipStatus(newStatus);
        } catch (error) {
            console.error('Error updating friendship status:', error.response?.data || error.message);
            alert('Failed to update friendship status.');
        }
    };

    // Render friendship status button
    const renderFriendshipButton = () => {
        if (auth) {
            return null; // No action needed if it's the user's own profile
        }

        switch (friendshipStatus) {
            case 'friends':
                return (
                    <TouchableOpacity style={styles.friendButton}>
                        <Text style={styles.friendButtonText}>Friends</Text>
                    </TouchableOpacity>
                );
            case 'request_sent':
                return (
                    <TouchableOpacity
                        style={styles.friendButton}
                        onPress={() => handleFriendshipAction('cancel_request')}
                    >
                        <Text style={styles.friendButtonText}>Cancel Request</Text>
                    </TouchableOpacity>
                );
            case 'request_received':
                return (
                    <View style={{ justifyContent: 'space-between' }}>
                        <TouchableOpacity style={styles.friendButton}
                            onPress={() => handleFriendshipAction('accept_request')}>
                            <Text style={styles.friendButtonText}>Accept Request</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.friendButton}
                            onPress={() => handleFriendshipAction('reject_request')}>
                            <Text style={styles.friendButtonText}>Reject Request</Text>
                        </TouchableOpacity>
                    </View>
                );
            default:
                return (
                    <TouchableOpacity
                        style={styles.friendButton}
                        onPress={() => handleFriendshipAction('add_friend')}
                    >
                        <Text style={styles.friendButtonText}>Add Friend</Text>
                    </TouchableOpacity>
                );
        }
    };

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
                                ? `${Api.base_url}${profile_pic}`
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

                    {/* Friendship Status Button */}
                    {renderFriendshipButton()}

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
    friendButton: {
        width: '80%',
        paddingVertical: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    friendButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
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