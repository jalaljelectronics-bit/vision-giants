const { query } = require('../db');

const getAll = () => query('SELECT * FROM portfolio ORDER BY created_at DESC');
const getBySlug = (slug) => query('SELECT * FROM portfolio WHERE slug = $1', [slug]);
const create = ({ title, slug, client_name, description, images, technologies, featured }) =>
  query(
    `INSERT INTO portfolio (title, slug, client_name, description, images, technologies, featured)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [title, slug, client_name, description, JSON.stringify(images || []), JSON.stringify(technologies || []), featured || false]
  );
const update = (id, { title, client_name, description, images, technologies, featured }) =>
  query(
    `UPDATE portfolio SET title=$1, client_name=$2, description=$3, images=$4, technologies=$5, featured=$6, updated_at=NOW()
     WHERE id=$7 RETURNING *`,
    [title, client_name, description, JSON.stringify(images || []), JSON.stringify(technologies || []), featured || false, id]
  );
const remove = (id) => query('DELETE FROM portfolio WHERE id = $1', [id]);

module.exports = { getAll, getBySlug, create, update, remove };