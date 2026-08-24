const { z } = require('zod');
module.exports = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().max(50).optional(),
  subject: z.string().max(255).optional(),
  message: z.string().min(1),
});