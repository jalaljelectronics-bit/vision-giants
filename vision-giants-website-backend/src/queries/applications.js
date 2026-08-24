const { query } = require('../db');
const getAll = () => query(`
  SELECT ja.*, jp.title as job_title FROM job_applications ja
  LEFT JOIN job_postings jp ON ja.job_id = jp.id ORDER BY ja.created_at DESC`);
const create = ({ job_id, name, email, phone, resume_url, cover_letter }) =>
  query('INSERT INTO job_applications (job_id, name, email, phone, resume_url, cover_letter) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [job_id, name, email, phone, resume_url, cover_letter]);
const remove = (id) => query('DELETE FROM job_applications WHERE id = $1', [id]);
module.exports = { getAll, create, remove };