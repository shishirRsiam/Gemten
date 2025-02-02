let baseUrl = 'http://192.168.0.101:8000/api';

const Api = {
    baseUrl: baseUrl,
    get_posts: `${baseUrl}/posts/`,  
    get_users: `${baseUrl}/users/`,
    get_authors: `${baseUrl}/auth/`, 
    login: `${baseUrl}/login/`, 
    register: `${baseUrl}/user/`,
    get_auth_profile: `${baseUrl}/auth/`, // Get the authenticated user's profile
};

export default Api;
