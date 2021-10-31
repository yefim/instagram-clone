const express = require('express');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const multer = require('multer');

const db = require('./db');

const upload = multer({dest: 'uploads/'});
const app = express();

app.use(express.urlencoded({extended: true}));
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

app.get('/', async (req, res) => {
  // await db.models.user.create({username: 'test123'});

  // res.send('hello test');
  const posts = await db.models.post.findAll();

  res.render('index', {posts});
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

async function main() {
  await db.authenticate();

  app.listen(process.env.PORT || 3000, () => {
    console.log('listening....');
  });
}

main();
