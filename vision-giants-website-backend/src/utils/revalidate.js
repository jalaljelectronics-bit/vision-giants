async function revalidatePaths(paths) {
  const frontendUrl = process.env.FRONTEND_URL;
  const secret = process.env.REVALIDATE_SECRET;

  if (!frontendUrl || !secret) {
    console.warn('Skipping revalidation: FRONTEND_URL or REVALIDATE_SECRET not set');
    return;
  }

  try {
    const res = await fetch(`${frontendUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, paths }),
    });

    if (!res.ok) {
      console.error('Revalidation request failed:', res.status, await res.text());
    }
  } catch (err) {
    // Never let a revalidation failure break the actual save
    console.error('Revalidation request error:', err);
  }
}

module.exports = { revalidatePaths };