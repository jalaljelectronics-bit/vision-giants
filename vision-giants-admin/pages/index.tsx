// pages/index.tsx
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { adminApi } from '@/lib/api';

interface DashboardStats {
  services: number;
  portfolio: number;
  blogPosts: number;
  activeJobs: number;
  newApplications: number;
  newLeads: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .get<DashboardStats>('/admin/dashboard-stats')
      .then((res) => setStats(res.data))
      .catch(() => setError('Could not load dashboard stats.'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard — Vision Giants Admin</title>
      </Head>

      <h1 className="admin-page-title">Dashboard</h1>

      {isLoading && <p>Loading stats…</p>}
      {error && <p className="admin-error-text">{error}</p>}

      {stats && (
        <div className="admin-stats-grid">
          <StatCard label="Services" value={stats.services} href="/services" />
          <StatCard label="Portfolio Items" value={stats.portfolio} href="/portfolio" />
          <StatCard label="Blog Posts" value={stats.blogPosts} href="/blog" />
          <StatCard label="Active Jobs" value={stats.activeJobs} href="/jobs" />
          <StatCard
            label="New Applications"
            value={stats.newApplications}
            href="/applications"
            highlight={stats.newApplications > 0}
          />
          <StatCard
            label="New Leads"
            value={stats.newLeads}
            href="/leads"
            highlight={stats.newLeads > 0}
          />
        </div>
      )}
    </>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  href: string;
  highlight?: boolean;
}

function StatCard({ label, value, href, highlight }: StatCardProps) {
  return (
    <a href={href} className={`admin-stat-card${highlight ? ' highlight' : ''}`}>
      <span className="admin-stat-value">{value}</span>
      <span className="admin-stat-label">{label}</span>
    </a>
  );
}