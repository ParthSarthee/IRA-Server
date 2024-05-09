const fs = require("fs");
const cors = require("cors");
const morgan = require("morgan");
// const Boot = require("./src/boot");
const Encoder = require("./plugins/Encoder");
const Auth = require("./plugins/Auth");


// Setup Express
let port = process.env.PORT || 6800;
const express = require("express");
const app = express();
app.use(cors());

// Connect to MongoDB Database
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://ari:SJV68oLR53GcuAT9@ari.dgn8mgq.mongodb.net/?retryWrites=true&w=majority&appName=ari");
mongoose.connection.on("error", (err) => console.log("MongoDB Connection Error: " + err));
mongoose.connection.on("connected", () => console.log("MongoDB Connected"));

// Decode incoming requests
app.use(express.urlencoded({ extended: false })); //decodes url queries
app.use(express.json()); //decodes form data
app.use(morgan("tiny")); //logs requests
app.use(Auth.verifyToken); //handles authorization headers



// import route files
const auth = require("./routes/auth"); ``
const account = require("./routes/account");
const service = require("./routes/service");

// route the incoming requests
let text = "IRA SERVER | PORT: " + port + " | STATUS: OK";
app.get('/', (req, res, next) => { res.send(text); })
app.use('/auth', auth);
app.use('/account', account);
app.use('/service', service);



// Encode outgoing response
app.use(Encoder.manageResponse);
app.use(Encoder.manageError);


// Initialize the server
let http = require("http").createServer(app);
http.listen(port, () => console.log("Server Running | HTTP:" + port));