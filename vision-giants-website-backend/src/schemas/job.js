const { z } = require('zod');

module.exports = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  department: z.string().optional(),
  location: z.string().optional(),
  type: z.string().max(50).optional(),
  experience_level: z.string().max(100).optional(),
  description: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(),
  is_active: z.boolean().optional(),
});