const { query } = require('../db');

const getAll = () => query('SELECT * FROM services ORDER BY "order" ASC');
const getBySlug = (slug) => query('SELECT * FROM services WHERE slug = $1', [slug]);
const create = ({ title, slug, short_description, description, image, order }) =>
  query(
    `INSERT INTO services (title, slug, short_description, description, image, "order")
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [title, slug, short_description, description, image, order || 0]
  );
const update = (id, { title, short_description, description, image, order }) =>
  query(
    `UPDATE services SET title=$1, short_description=$2, description=$3, image=$4, "order"=$5, updated_at=NOW()
     WHERE id=$6 RETURNING *`,
    [title, short_description, description, image, order, id]
  );
const remove = (id) => query('DELETE FROM services WHERE id = $1', [id]);

module.exports = { getAll, getBySlug, create, update, remove };