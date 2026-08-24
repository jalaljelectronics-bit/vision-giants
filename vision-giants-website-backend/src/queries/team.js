const { query } = require('../db');
const getAll = () => query('SELECT * FROM team_members ORDER BY "order" ASC');
const create = ({ name, role, photo, order }) =>
  query('INSERT INTO team_members (name, role, photo, "order") VALUES ($1,$2,$3,$4) RETURNING *', [name, role, photo, order || 0]);
const update = (id, { name, role, photo, order }) =>
  query('UPDATE team_members SET name=$1, role=$2, photo=$3, "order"=$4, updated_at=NOW() WHERE id=$5 RETURNING *', [name, role, photo, order, id]);
const remove = (id) => query('DELETE FROM team_members WHERE id = $1', [id]);
module.exports = { getAll, create, update, remove };