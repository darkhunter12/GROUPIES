let express = require("express");
let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);
let stream = require("./ws/stream");
let path = require("path");
let favicon = require("serve-favicon");
//require("./db/connection");

const mongoose = require("mongoose"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  User = require("./models/user");

//Connecting database
mongoose
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
    secret: "Any normal Word", //decode or encode session
    resave: false,
    saveUninitialized: false,
  })
);
passport.serializeUser(User.serializeUser()); //session encoding
passport.deserializeUser(User.deserializeUser()); //session decoding
passport.use(new LocalStrategy(User.authenticate()));

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(favicon(path.join(__dirname, "favicon.ico")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/Login.html");
});

app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/demo", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/home");
    }
  })(req, res, next);
});

app.get("/#", (req, res) => {
  res.render("Login.html");
});
app.post("/#", (req, res) => {
  User.register(
    new User({ username: req.body.username, email: req.body.email }),
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.render("Login.html");
      }
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
    }
  );
}); /*
app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});*/
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

io.of("/stream").on("connection", stream);

server.listen(3000);
