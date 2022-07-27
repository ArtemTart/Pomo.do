require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser');
const passport = require("passport")
var session = require('express-session')
var GoogleStrategy = require('passport-google-oauth2').Strategy;
const mongoose = require("mongoose");
const {User} = require("./model/models")
const Auth = require("./router/auth")
const cors = require("cors")
const port = process.env.PORT || 8080
const app = express();


app.use(express.json())
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '');
//   next();
// });
mongoose.connect(`mongodb+srv://${process.env.MONGODB_UID}:${process.env.MONGODB_PASS}@cluster0.akq99.mongodb.net/pomodoDB`, {useNewUrlParser: true});

//Cookies setup
var expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
var sess = {
    secret: process.env.COOKIE_SECRET,
    cookie: { },
    resave: true,
    saveUninitialized: true,
    sameSite: "none"
    
  }
  
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
    sess.cookie.httpOnly = false
    sess.cookie.maxAge = expiryDate
    sess.cookie.sameSite = "none"
  }
  
app.use(session(sess))


//passport google auth setup
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  'origin': 'https://domopo.netlify.app',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
        done(null, user);
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALL_BACK_URL,
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    scope: ['profile', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
   
    User.findOrCreate({ googleId: profile.id, username:profile.displayName, picture: profile.picture /*todocount:0*/ }, function (err, user) {
      return cb(err, user);
    });
  }
));


//mongoose setup




app.use(bodyParser.json())
app.use(Auth);
// app.use(Todos);



app.listen(port,()=>{console.log("server started at: "+ port)})