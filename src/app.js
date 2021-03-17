
let express = require("express");
let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);
let stream = require("./ws/stream");
let path = require("path");
let favicon = require("serve-favicon");
const JSAlert = require("js-alert");
const alert = require("alert");
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  User = require("./models/user");
  feed = require("./models/feedback");
  
 

//Connecting database
var dbConn = mongoose
  .connect("mongodb://localhost:27017/GROUPIES_DB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongodb Connected");
  })
  .catch((e) => {
    console.log("No Connection");
  });
var Schema = mongoose.Schema;
app.use(
  require("express-session")({
    secret: "secret", //decode or encode session
    resave: true,
    saveUninitialized: false,
  })
);
passport.serializeUser(User.serializeUser()); //session encoding
passport.deserializeUser(User.deserializeUser()); //session decoding
passport.use(new LocalStrategy(User.authenticate()));

passport.use(
  new LocalStrategy(function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) {
        console.log({msg:''}, err);
        return;
      }
      if (!user) {
        alert("Email is not registered......");
        console.log("Email is not registered");
        return done();
      }
      if (user.password !== password){
        alert("password is incorrect......");
        console.log("password is incorrect");
        return done();
      }
      console.log("Verification Success, User logged In...");
      return done(null, user);
    });    
  })
);




app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(favicon(path.join(__dirname, "favicon.ico")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/Login.html");
});

app.get("/home", isLoggedIn, (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/Login", (req, res) => {
  res.sendFile(__dirname + "/views/Login.html", {errors});
});

app.post(
  "/Login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
  }),
  function (req, res) {}
);

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/views/Login.html");
});

app.post("/register", (req, res) => {
  var userData = new User(req.body);
  userData.save()
  .then(item => {
    console.log("Registration Succesfully");
    res.redirect("/");
  })
  .catch(err => {
  res.status(400).send("User already exist....");
 
  console.log("User already exist....");
  });
});


app.get("/post-feedback", isLoggedIn, (req, res) => {
  res.sendFile(__dirname + "/views/feedback.html");
});

app.post('/post-feedback', function (req, res) {
  var myData = new feed(req.body);
  myData.save()
  .then(item => {
    res.redirect("/post-feedback");
//  res.send("feedback send successfully...");
  })
  .catch(err => {
  res.status(400).send("unable to send feedback");
  });
  
});

app.get("/logout",(req,res)=>{
    req.logout();
    console.log("Logout successfully");
    res.redirect("/");
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
    res.redirect("/");
}

io.of("/stream").on("connection", stream);

server.listen(3000);