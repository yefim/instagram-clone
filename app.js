const express = require('express');
const db = require('./db');

const app = express();

app.get('/', async (req, res) => {
  // await db.models.user.create({username: 'test123'});

  res.send('hello test');
});

app.get('/users', async (req, res) => {
  const users = await db.models.user.findAll();
  res.status(200).json(users);
});

async function main() {
  await db.authenticate();

  app.listen(process.env.PORT || 3000, () => {
    console.log('listening....');
  });
}

main();
