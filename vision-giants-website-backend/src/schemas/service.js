const { z } = require('zod');

const subServiceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

module.exports = z.object({
  title: z.string().min(1).max(255),
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only'),
  short_description: z.string().optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  sub_services: z.array(subServiceSchema).optional(),
  order: z.number().int().optional(),
});