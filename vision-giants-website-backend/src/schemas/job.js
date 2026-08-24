const { z } = require('zod');
module.exports = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  department: z.string().optional(),
  location: z.string().optional(),
  type: z.string().max(50).optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),
  is_active: z.boolean().optional(),
});