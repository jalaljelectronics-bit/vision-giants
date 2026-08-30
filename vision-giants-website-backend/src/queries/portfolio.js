const { query } = require('../db');

const getAll = () => query('SELECT * FROM portfolio ORDER BY created_at DESC');
const getBySlug = (slug) => query('SELECT * FROM portfolio WHERE slug = $1', [slug]);

const create = ({
  title,
  slug,
  client_name,
  related_service_id,
  cover_image,
  technologies,
  challenge,
  solution,
  result,
  featured,
  is_new_arrival,
  is_draft,
}) =>
  query(
    `INSERT INTO portfolio
       (title, slug, client_name, related_service_id, cover_image, technologies, challenge, solution, result, featured, is_new_arrival, is_draft)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [
      title,
      slug,
      client_name,
      related_service_id || null,
      cover_image,
      JSON.stringify(technologies || []),
      challenge,
      solution,
      result,
      featured || false,
      is_new_arrival || false,
      is_draft || false,
    ]
  );

const update = (
  id,
  {
    title,
    client_name,
    related_service_id,
    cover_image,
    technologies,
    challenge,
    solution,
    result,
    featured,
    is_new_arrival,
    is_draft,
  }
) =>
  query(
    `UPDATE portfolio SET
       title=$1,
       client_name=$2,
       related_service_id=$3,
       cover_image=$4,
       technologies=$5,
       challenge=$6,
       solution=$7,
       result=$8,
       featured=$9,
       is_new_arrival=$10,
       is_draft=$11,
       updated_at=NOW()
     WHERE id=$12 RETURNING *`,
    [
      title,
      client_name,
      related_service_id || null,
      cover_image,
      JSON.stringify(technologies || []),
      challenge,
      solution,
      result,
      featured || false,
      is_new_arrival || false,
      is_draft || false,
      id,
    ]
  );

const remove = (id) => query('DELETE FROM portfolio WHERE id = $1', [id]);

module.exports = { getAll, getBySlug, create, update, remove };