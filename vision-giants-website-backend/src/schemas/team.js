const { z } = require('zod');
module.exports = z.object({
  name: z.string().min(1).max(255),
  role: z.string().min(1).max(255),
  photo: z.string().url().optional(),
  order: z.number().int().optional(),
});