const { z } = require('zod');
module.exports = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  content: z.string().optional(),
  cover_image: z.string().url().optional(),
  meta_title: z.string().max(255).optional(),
  meta_description: z.string().max(500).optional(),
  published: z.boolean().optional(),
});