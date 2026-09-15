const { query } = require('../db');

const getAll = () => query(`
  SELECT ja.*, jp.title AS job_title, jp.department AS job_department
  FROM job_applications ja
  LEFT JOIN job_postings jp ON ja.job_id = jp.id
  ORDER BY ja.created_at DESC
`);

const getById = (id) => query(`
  SELECT ja.*, jp.title AS job_title, jp.department AS job_department
  FROM job_applications ja
  LEFT JOIN job_postings jp ON ja.job_id = jp.id
  WHERE ja.id = $1
`, [id]);

const create = ({
  job_id = null,
  name,
  first_name = null,
  last_name = null,
  gender = null,
  date_of_birth = null,
  phone = null,
  address = null,
  email,
  education = null,
  experience = null,
  remote_job = null,
  resume_url = null,
  cover_letter = null,
  status = 'new'
}) => {
  const fullName = name || [first_name, last_name].filter(Boolean).join(' ') || email;

  return query(
    `INSERT INTO job_applications (
      job_id, name, first_name, last_name, gender, date_of_birth,
      phone, address, email, education, experience, remote_job,
      resume_url, cover_letter, status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
    RETURNING *`,
    [
      job_id || null,
      fullName,
      first_name,
      last_name,
      gender,
      date_of_birth,
      phone,
      address,
      email,
      education,
      experience,
      remote_job,
      resume_url,
      cover_letter,
      status || 'new'
    ]
  );
};

const updateStatus = (id, status) =>
  query('UPDATE job_applications SET status = $1 WHERE id = $2 RETURNING *', [status, id]);

const remove = (id) => query('DELETE FROM job_applications WHERE id = $1', [id]);

module.exports = { getAll, getById, create, updateStatus, remove };