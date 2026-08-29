const { query } = require('../db');

const getStats = async () => {
  const result = await query(`
    SELECT
      (SELECT COUNT(*)::int FROM services) AS services,
      (SELECT COUNT(*)::int FROM portfolio) AS portfolio,
      (SELECT COUNT(*)::int FROM blog_posts) AS "blogPosts",
      (SELECT COUNT(*)::int
       FROM job_postings
       WHERE is_active = true) AS "activeJobs",
      (SELECT COUNT(*)::int
       FROM job_applications) AS "newApplications",
      (SELECT COUNT(*)::int
       FROM contact_leads) AS "newLeads"
  `);

  return result.rows[0];
};

module.exports = {
  getStats,
};