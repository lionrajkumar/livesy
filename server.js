let express = require('express');
let app = express();

app.use("/public",express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var http=require("http").createServer(app);

http.listen(3000, function(){
    console.log("Server started");

    app.get("/", function (req, resp){
        resp.render("index");
    });
});