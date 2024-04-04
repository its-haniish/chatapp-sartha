const express = require("express");
const app = express();
const socket = require("socket.io");
const cors = require("cors");
const PORT = process.env.PORT || 8080;

app.use(cors(
{
        origin: "https://chatapp-sartha.vercel.app",
        methods: ["GET", "POST"]
    }
));

// Socket.io
const server = app.listen(PORT, () => {
    console.log("Server live on PORT:", PORT);
});

const io = socket(server, {
    cors: {
        origin: "https://chatapp-sartha.vercel.app",
        methods: ["GET", "POST"]
    }
});

let users = [];

io.on('connection', (socket) => {
    const user = { name: socket.handshake.query.name, title: socket.handshake.query.title }
    if (user.name !== "" || user.title !== "") {
        users.push(user);
        console.log("New connection:", user);
    }

    // Emit new user to all connected sockets
    io.emit("new-user", users);

    // Handle messages
    socket.on('new-message', (data) => {
        console.log(data);
        io.emit('new-message', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        users = users.filter(elem => elem.name !== user.name);
        io.emit("user-disconnected", user);
        console.log("Disconnected user:", user);
        console.log("Remaining users:", users);
    });
});

