const { z } = require('zod');

module.exports = z.object({
  client_name: z.string().max(255).optional().nullable(),
  client_company: z.string().max(255).optional().nullable(),
  content: z.string().min(1, 'Testimonial content is required'),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  photo: z.string().optional().nullable(),
});