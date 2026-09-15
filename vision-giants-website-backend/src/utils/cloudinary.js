const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'r2fk1fws',
  api_key: process.env.CLOUDINARY_API_KEY || '261342954374627',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'EZ5rbv8r5J3iZUbwpZdgJHGQMu4',
});

/**
 * Generates a signed download URL for PDF/DOCX resumes stored in Cloudinary
 * to avoid 401 Unauthorized errors caused by Cloudinary restricted media types.
 */
function getSignedResumeUrl(url) {
  if (!url) return null;
  if (url.includes('api.cloudinary.com/v1_1/')) return url;

  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.([a-zA-Z0-9]+))?$/);
  if (!match) return url;

  const publicId = match[1];
  const format = match[2] || 'pdf';

  try {
    return cloudinary.utils.private_download_url(publicId, format, {
      resource_type: 'image',
      type: 'upload',
      expires_at: Math.floor(Date.now() / 1000) + 86400, // Valid for 24 hours
    });
  } catch (err) {
    console.error('Error signing resume URL:', err);
    return url;
  }
}

module.exports = {
  cloudinary,
  getSignedResumeUrl,
};

