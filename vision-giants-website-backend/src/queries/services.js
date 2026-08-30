const { query } = require('../db');

const getAll = () => query('SELECT * FROM services ORDER BY "order" ASC');
const getBySlug = (slug) => query('SELECT * FROM services WHERE slug = $1', [slug]);

const create = ({
  title,
  slug,
  short_description,
  description,
  image,
  sub_services,
  order,
}) =>
  query(
    `INSERT INTO services
       (title, slug, short_description, description, image, sub_services, "order")
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [
      title,
      slug,
      short_description,
      description,
      image,
      JSON.stringify(sub_services || []),
      order || 0,
    ]
  );

const update = (
  id,
  { title, short_description, description, image, sub_services, order }
) =>
  query(
    `UPDATE services SET
       title=$1,
       short_description=$2,
       description=$3,
       image=$4,
       sub_services=$5,
       "order"=$6,
       updated_at=NOW()
     WHERE id=$7 RETURNING *`,
    [
      title,
      short_description,
      description,
      image,
      JSON.stringify(sub_services || []),
      order,
      id,
    ]
  );

const remove = (id) => query('DELETE FROM services WHERE id = $1', [id]);

module.exports = { getAll, getBySlug, create, update, remove };