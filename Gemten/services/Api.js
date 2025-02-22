let baseUrl = 'http://192.168.0.104:8000/api';
// let baseUrl = 'https://gemten-django-backend.vercel.app/api';


const Api = {
    baseUrl: baseUrl,
    get_posts: `${baseUrl}/posts/`,  
    connect: `${baseUrl}/connect`, 
    get_other_profile: `${baseUrl}/user`, 
    accept_friend_request: `${baseUrl}/user`, 
    cancel_friend_request: `${baseUrl}/user`, 
    add_post: `${baseUrl}/posts/`,  
    get_conversations: `${baseUrl}/chats/`,
    get_messages: `${baseUrl}/chats`,
    send_message: `${baseUrl}/chats`,
    get_users: `${baseUrl}/users/`,
    login: `${baseUrl}/login/`, 
    register: `${baseUrl}/user/`,
    get_auth_profile: `${baseUrl}/auth/`, // Get the authenticated user's profile
    like_post: `${baseUrl}/posts`, // http://192.168.0.101:8000/api/posts/{post_id}/like/
    add_comment: `${baseUrl}/posts/comments`, // http://192.168.0.101:8000/api/posts/{post_id}/comments/
};

export default Api;
