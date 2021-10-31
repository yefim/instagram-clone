const db = require('../db');

async function main() {
  await db.sync({force: true});

  console.log('Done.');
}

main();
