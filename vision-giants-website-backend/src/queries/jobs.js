const { query } = require('../db');
const getActive = () => query('SELECT * FROM job_postings WHERE is_active = true ORDER BY created_at DESC');
const getAllAdmin = () => query('SELECT * FROM job_postings ORDER BY created_at DESC');
const getBySlug = (slug) => query('SELECT * FROM job_postings WHERE slug = $1', [slug]);
const create = ({ title, slug, department, location, type, description, requirements, is_active }) =>
  query(`INSERT INTO job_postings (title, slug, department, location, type, description, requirements, is_active)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [title, slug, department, location, type, description, requirements, is_active ?? true]);
const update = (id, { title, department, location, type, description, requirements, is_active }) =>
  query(`UPDATE job_postings SET title=$1, department=$2, location=$3, type=$4, description=$5, requirements=$6, is_active=$7, updated_at=NOW()
    WHERE id=$8 RETURNING *`,
    [title, department, location, type, description, requirements, is_active, id]);
const remove = (id) => query('DELETE FROM job_postings WHERE id = $1', [id]);
module.exports = { getActive, getAllAdmin, getBySlug, create, update, remove };