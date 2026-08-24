const { z } = require('zod');
module.exports = z.object({
  client_name: z.string().min(1).max(255),
  client_company: z.string().optional(),
  content: z.string().min(1),
  rating: z.number().int().min(1).max(5).optional(),
  photo: z.string().url().optional(),
});