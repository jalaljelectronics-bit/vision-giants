const { z } = require('zod');

module.exports = z.object({
  job_id: z.coerce.number().int().optional().nullable(),
  first_name: z.string().min(1).max(255).optional(),
  last_name: z.string().max(255).optional().nullable(),
  name: z.string().max(255).optional().nullable(),
  gender: z.string().max(50).optional().nullable(),
  date_of_birth: z.string().max(100).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  email: z.string().email(),
  education: z.string().max(255).optional().nullable(),
  experience: z.string().max(255).optional().nullable(),
  remote_job: z.string().max(50).optional().nullable(),
  cover_letter: z.string().optional().nullable(),
  resume_url: z.string().url().or(z.string().min(1)).optional().nullable(),
  status: z.enum(['new', 'reviewed', 'shortlisted', 'rejected', 'hired']).optional(),
});