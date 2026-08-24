const { query } = require('../db');

// Public listing only shows published posts
const getPublished = () =>
  query('SELECT * FROM blog_posts WHERE published = true ORDER BY published_at DESC');

// Admin listing shows everything, drafts included
const getAllAdmin = () => query('SELECT * FROM blog_posts ORDER BY created_at DESC');

const getBySlug = (slug) => query('SELECT * FROM blog_posts WHERE slug = $1', [slug]);

const create = ({ title, slug, content, cover_image, meta_title, meta_description, published }) => {
  const publishedAt = published ? new Date() : null;
  return query(
    `INSERT INTO blog_posts (title, slug, content, cover_image, meta_title, meta_description, published, published_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [title, slug, content, cover_image, meta_title, meta_description, published || false, publishedAt]
  );
};

const update = (id, { title, content, cover_image, meta_title, meta_description, published }, wasPublished) => {
  // Only set published_at the first time a post transitions to published
  const publishedAt = published && !wasPublished ? new Date() : undefined;
  return query(
    `UPDATE blog_posts SET title=$1, content=$2, cover_image=$3, meta_title=$4, meta_description=$5,
     published=$6, published_at=COALESCE($7, published_at), updated_at=NOW()
     WHERE id=$8 RETURNING *`,
    [title, content, cover_image, meta_title, meta_description, published || false, publishedAt, id]
  );
};

const remove = (id) => query('DELETE FROM blog_posts WHERE id = $1', [id]);

module.exports = { getPublished, getAllAdmin, getBySlug, create, update, remove };