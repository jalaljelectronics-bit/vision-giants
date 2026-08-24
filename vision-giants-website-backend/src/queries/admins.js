const { query } = require('../db');

const getByEmail = (email) => query('SELECT * FROM admins WHERE email = $1', [email]);
const create = async (email, hashedPassword, name) =>
  query(
    'INSERT INTO admins (email, password, name) VALUES ($1,$2,$3) RETURNING id, email, name, created_at',
    [email, hashedPassword, name]
  );

module.exports = { getByEmail, create };