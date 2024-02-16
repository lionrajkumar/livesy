const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});
const { ExpressPeerServer } = require("peer");
const opinions = {
    debug: true,
}
app.use("/peerjs", ExpressPeerServer(server, opinions));
const { v4: uuidV4 } = require('uuid')

app.use("/public",express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
    res.render("index", { roomId: req.params.room });
});

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId, userName) => {
        socket.join(roomId);
        setTimeout(()=>{
            socket.broadcast.to(roomId).emit('user-connected', userId)
        }, 1000)
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message, userName);
        });
    });
});

server.listen(3000);