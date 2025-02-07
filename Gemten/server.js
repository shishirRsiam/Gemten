const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const { Client } = require('pg');


const client = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
});


client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});




app.use(cors());
app.use(express.json());


const users = {};

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for username submission
    socket.on('set username', ({ userId, token }) => {
        console.log(`User ${userId} has set their username.`);
        users[userId] = socket.id;
        console.log(`User ${userId} has joined the chat.`);
    });

    // Listen for chat messages
    socket.on('chat message', async ({ authToken, chatId, content, response }) => {
        const apiUrl = `http://localhost:8000/api/chats/${chatId}/messages/`;

        try {
            // const response = await axios.post(apiUrl,
            //     { content: content }, {
            //     headers: {
            //         Authorization: authToken,
            //         'Content-Type': 'application/json',
            //     }
            // }
            // );
            const senderUserId = response.data.sender.username;
            const receiverUserId = response.data.receiver.username;

            console.log('Sender User Name:', senderUserId);
            console.log('Receiver User Name:', receiverUserId);

            // io.emit('chat message', response.data);

            // console.log('Message Sent:', response.data);

            for (const userId in users) {
                console.log(`User ${userId} is online`);
                if (userId == receiverUserId) {
                    console.log(`User ${userId} is online`);
                    response.data.texted_me = true;
                    io.to(users[receiverUserId]).emit('chat message', response.data);
                    break;
                }
            }
            // res.json({ message: 'Message sent successfully', response: response.data });
        } catch (error) {
            console.error('Error sending message:', error.response ? error.response.data : error.message);
            res.status(500).json({ error: 'Failed to send message' });
        }

        console.log(`Message from ${authToken} to ${chatId}: ${content}`);
        // try {
        //     const receiverSocket = Object.keys(users).find(socketId => users[socketId] === receiverId);
        //     if (receiverSocket) {
        //         io.to(receiverSocket).emit('chat message', { senderId, content });
        //     }

        // } catch (error) {
        //     console.error('Error handling chat message:', error);
        // }
        // io.emit('chat message', response.data);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        const userId = users[socket.id];
        if (userId) {
            console.log(`User ${userId} has disconnected.`);
            delete users[socket.id];
        }
    });
});


const axios = require('axios');
// API endpoint to check if a user is connected
app.get('/user/', async (req, res) => {
    console.log('Users ==>', users);

    const content = 'Hello From Node.js Server';
    const authToken = 'Token f1b9e6042d3da347dc0f77d152dcac2f7f8a6517';
    const apiUrl = 'http://localhost:8000/api/chats/9/messages/';

    try {
        // const response = await axios.post(apiUrl,
        //     { content: content }, // Message payload
        //     {
        //         headers: {
        //             Authorization: authToken,
        //             'Content-Type': 'application/json',
        //         }
        //     }
        // );

        res.json({ message: 'Message sent successfully', user: users });
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

app.get('/user/:userId', (req, res) => {
    const { userId } = req.params;

    // Check if the user is in the `users` object
    const isConnected = Object.values(users).includes(userId);
    console.log('Users ==>', users);
    res.json({ userId, isConnected });
});

app.get('/user/conect/:userId', (req, res) => {
    const { userId } = req.params;

    // Check if the user is in the `users` object
    const isConnected = Object.values(users).includes(userId);
    console.log('Users ==>', users);
    res.json({ userId, isConnected });
});




// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});