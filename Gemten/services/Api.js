let baseUrl = 'http://192.168.0.101:8000/api';

const Api = {
    baseUrl: baseUrl,
    get_posts: `${baseUrl}/posts/`,  
    get_other_profile: `${baseUrl}/user`,  
    add_post: `${baseUrl}/posts/`,  
    get_users: `${baseUrl}/users/`,
    login: `${baseUrl}/login/`, 
    register: `${baseUrl}/user/`,
    get_auth_profile: `${baseUrl}/auth/`, // Get the authenticated user's profile
    like_post: `${baseUrl}/posts`, // http://192.168.0.101:8000/api/posts/{post_id}/like/
    add_comment: `${baseUrl}/posts/comments`, // http://192.168.0.101:8000/api/posts/{post_id}/comments/
};

export default Api;
