const { z } = require('zod');
module.exports = z.object({
  job_id: z.number().int(),
  name: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().max(50).optional(),
  resume_url: z.string().url().optional(),
  cover_letter: z.string().optional(),
});