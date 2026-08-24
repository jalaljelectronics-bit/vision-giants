require('dotenv').config();
const { pool } = require('./index');
const { hash } = require('../utils/hashPassword');

async function seed() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || 'Admin';

  if (!email || !password) {
    console.log('Usage: node src/db/seedAdmin.js <email> <password> [name]');
    process.exit(1);
  }

  const hashed = await hash(password);
  await pool.query(
    'INSERT INTO admins (email, password, name) VALUES ($1,$2,$3) ON CONFLICT (email) DO NOTHING',
    [email, hashed, name]
  );

  console.log(`Admin seeded: ${email}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});