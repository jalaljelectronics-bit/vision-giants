
const { query } = require('../db');

const getAll = () =>
  query(
    'SELECT * FROM contact_leads ORDER BY created_at DESC'
  );

const create = ({ name, email, phone, subject, message }) =>
  query(
    `INSERT INTO contact_leads
      (name, email, phone, subject, message)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, email, phone, subject, message]
  );

const updateStatus = (id, status) =>
  query(
    `UPDATE contact_leads
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );

const remove = (id) =>
  query(
    `DELETE FROM contact_leads
     WHERE id = $1
     RETURNING *`,
    [id]
  );

module.exports = {
  getAll,
  create,
  updateStatus,
  remove,
};

