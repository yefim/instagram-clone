const express = require('express');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const multer = require('multer');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const path = require('path');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const db = require('./db');

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "https://55e5-2a00-79e1-abc-1a12-c8cc-3ebf-30bb-906d.ngrok.io/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    console.log(profile.id);

    done(null, profile);
    /*
    User.findOrCreate(..., function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
    */
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

const upload = multer({dest: 'uploads/'});
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

async function uploadPhoto(path) {
  const data = new FormData();

  const file = fs.readFileSync(path);
  data.append('image', file);

  const config = {
    method: 'post',
    url: 'https://api.imgur.com/3/image',
    headers: {
      'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
      ...data.getHeaders(),
    },
    data,
  };

  const {
    data: {
      data: {
        link,
      },
    },
  } = await axios(config);

  return link;
}

app.get('/', /* ensureLoggedIn(), */ async (req, res) => {
  // await db.models.user.create({username: 'test123'});

  // res.send('hello test');
  const posts = await db.models.post.findAll();

  res.render('index', {posts});
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/users', async (req, res) => {
  const users = await db.models.user.findAll();
  res.status(200).json(users);
});

app.get('/posts', async (req, res) => {
  const posts = await db.models.post.findAll();
  res.status(200).json(posts);
});

app.post('/post', upload.single('photo'), async (req, res) => {
  const caption = req.body.caption;
  const photoUrl = await uploadPhoto(req.file.path);

  await db.models.post.create({photoUrl, caption});

  res.redirect('/');
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));

async function main() {
  await db.authenticate();

  app.listen(process.env.PORT || 3000, () => {
    console.log('listening....');
  });
}

main();
