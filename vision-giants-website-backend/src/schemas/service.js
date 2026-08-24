const { z } = require('zod');
module.exports = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  short_description: z.string().optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  order: z.number().int().optional(),
});