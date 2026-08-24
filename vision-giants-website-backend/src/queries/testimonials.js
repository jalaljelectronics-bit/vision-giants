const { query } = require('../db');
const getAll = () => query('SELECT * FROM testimonials ORDER BY id DESC');
const create = ({ client_name, client_company, content, rating, photo }) =>
  query('INSERT INTO testimonials (client_name, client_company, content, rating, photo) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [client_name, client_company, content, rating || 5, photo]);
const update = (id, { client_name, client_company, content, rating, photo }) =>
  query('UPDATE testimonials SET client_name=$1, client_company=$2, content=$3, rating=$4, photo=$5, updated_at=NOW() WHERE id=$6 RETURNING *',
    [client_name, client_company, content, rating, photo, id]);
const remove = (id) => query('DELETE FROM testimonials WHERE id = $1', [id]);
module.exports = { getAll, create, update, remove };