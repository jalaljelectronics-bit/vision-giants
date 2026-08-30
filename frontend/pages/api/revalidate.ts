// pages/api/revalidate.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { secret, paths } = req.body as {
    secret?: string;
    paths?: string[];
  };

  if (secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid secret' });
  }

  if (!Array.isArray(paths) || paths.length === 0) {
    return res.status(400).json({ message: 'paths must be a non-empty array' });
  }

  try {
    await Promise.all(paths.map((path) => res.revalidate(path)));
    return res.json({ revalidated: true, paths });
  } catch (err) {
    console.error('Revalidation error:', err);
    return res.status(500).json({ message: 'Error revalidating' });
  }
}