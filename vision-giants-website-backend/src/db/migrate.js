const fs = require('fs');
const path = require('path');
const { pool } = require('./index');

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  const dir = path.join(__dirname, '../migrations');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    const { rows } = await pool.query('SELECT 1 FROM migrations WHERE name = $1', [file]);
    if (rows.length) {
      console.log(`skip: ${file} already applied`);
      continue;
    }
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    console.log(`applying: ${file}`);
    await pool.query(sql);
    await pool.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
  }

  console.log('migrations complete');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});