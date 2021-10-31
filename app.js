const express = require('express');
const db = require('./db');

const app = express();

app.get('/', (req, res) => {
  res.send('hello test');
});

async function main() {
  await db.authenticate();

  app.listen(process.env.PORT || 3000, () => {
    console.log('listening....');
  });
}

main();
