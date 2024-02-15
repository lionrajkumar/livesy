let express = require('express');
let app = express();
const { v4: uuidv4 } = require("uuid");

app.use("/public",express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
    res.render("index", { roomId: req.params.room });
});


var server = app.listen(3000, function() {
    console.log('server listening at', server.address())
})

const { ExpressPeerServer } = require("peer");
const opinions = {
    debug: true,
}
app.use("/peerjs", ExpressPeerServer(server, opinions));
var io = require('socket.io')(server)

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId, userName) => {
        socket.join(roomId);
        setTimeout(()=>{
            //socket.to(roomId).broadcast.emit("user-connected", userId);
            socket.broadcast.to(roomId).emit('user-disconnected', userId)
        }, 1000)
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message, userName);
        });
    });
});