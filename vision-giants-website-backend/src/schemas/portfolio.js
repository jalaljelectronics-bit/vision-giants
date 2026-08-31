const { z } = require('zod');

module.exports = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  project_url: z.string().url(),
  related_service_id: z.number().int().nullable().optional(),
  cover_image: z.string().url(),
  technologies: z.array(z.string()).optional(),
  challenge: z.string().min(1),
  solution: z.string().min(1),
  result: z.string().min(1),
  featured: z.boolean().optional(),
  is_new_arrival: z.boolean().optional(),
  is_draft: z.boolean().optional(),
});