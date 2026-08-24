const { z } = require('zod');
module.exports = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  client_name: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  technologies: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
});