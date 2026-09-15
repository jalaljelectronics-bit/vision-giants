// pages/applications.tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import type { JobApplication, JobPosting, ApplicationStatus } from '@/types';
import { adminApi } from '@/lib/api';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ApplicationDetailModal from '@/components/admin/ApplicationDetailModal';

const STATUS_OPTIONS: ApplicationStatus[] = [
  'new',
  'reviewed',
  'shortlisted',
  'rejected',
  'hired',
];

export default function ApplicationsPage() {
  const router = useRouter();

  const jobFilter = router.query.job
    ? Number(router.query.job)
    : null;

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');

  const [viewingApplication, setViewingApplication] = useState<JobApplication | null>(null);
  const [deletingApplication, setDeletingApplication] = useState<JobApplication | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);

    try {
      const [appsRes, jobsRes] = await Promise.all([
        adminApi.get<JobApplication[]>('/applications'),
        adminApi.get<JobPosting[]>('/jobs/admin/all'),
      ]);

      setApplications(appsRes.data ?? []);
      setJobs(jobsRes.data ?? []);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteConfirmed() {
    if (!deletingApplication) return;

    setIsDeleting(true);

    try {
      await adminApi.delete(`/applications/${deletingApplication.id}`);

      setApplications((prev) =>
        prev.filter((app) => app.id !== deletingApplication.id)
      );

      if (viewingApplication?.id === deletingApplication.id) {
        setViewingApplication(null);
      }

      setDeletingApplication(null);
    } catch (error) {
      console.error('Failed to delete application:', error);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleStatusChange(id: number, newStatus: ApplicationStatus) {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
    if (viewingApplication && viewingApplication.id === id) {
      setViewingApplication((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  }

  function jobTitleFor(jobId: number | null, fallbackTitle?: string): string {
    if (fallbackTitle) return fallbackTitle;
    if (!jobId) return 'General Application';
    return (
      jobs.find((job) => job.id === jobId)?.title ?? `Job #${jobId}`
    );
  }

  function clearFilter() {
    router.push('/applications');
  }

  const visibleApplications = applications.filter((app) => {
    if (jobFilter && app.job_id !== jobFilter) return false;
    if (statusFilter !== 'all' && (app.status || 'new') !== statusFilter) return false;
    return true;
  });

  const columns: Column<JobApplication>[] = [
    {
      key: 'name',
      header: 'Applicant',
      render: (application) => (
        <div>
          <strong style={{ color: 'var(--color-primary)', display: 'block' }}>
            {application.name ||
              [application.first_name, application.last_name].filter(Boolean).join(' ') ||
              'Applicant'}
          </strong>
          {application.education && (
            <span style={{ fontSize: 12, color: 'var(--color-secondary)' }}>
              {application.education}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (app) => (
        <a href={`mailto:${app.email}`} className="admin-table-link">
          {app.email}
        </a>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (app) => app.phone || '—',
    },
    {
      key: 'job_id',
      header: 'Applied For',
      render: (app) => jobTitleFor(app.job_id, app.job_title),
    },
    {
      key: 'status',
      header: 'Status',
      render: (app) => {
        const st = app.status || 'new';
        let badgeClass = 'admin-badge-pending';
        if (st === 'shortlisted' || st === 'hired') badgeClass = 'admin-badge-success';
        if (st === 'rejected') badgeClass = 'admin-badge-pending';
        return (
          <span
            className={badgeClass}
            style={{
              textTransform: 'capitalize',
              display: 'inline-block',
            }}
          >
            {st}
          </span>
        );
      },
    },
    {
      key: 'resume_url',
      header: 'Resume',
      render: (application) =>
        application.resume_url ? (
          <a
            href={application.resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-table-link"
            style={{ fontWeight: 600 }}
          >
            📄 View CV
          </a>
        ) : (
          <span style={{ color: 'var(--color-secondary)' }}>—</span>
        ),
    },
    {
      key: 'created_at',
      header: 'Applied On',
      render: (application) =>
        new Date(application.created_at).toLocaleDateString(),
    },
  ];

  return (
    <>
      <Head>
        <title>Applications — Vision Giants Admin</title>
      </Head>

      <div className="admin-page-header">
        <h1 className="admin-page-title">
          Applications ({visibleApplications.length})
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {jobFilter && (
            <button
              type="button"
              onClick={clearFilter}
              className="admin-button-secondary"
            >
              Role: {jobTitleFor(jobFilter)} ✕
            </button>
          )}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'all')}
            className="admin-filter-select"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={visibleApplications}
        isLoading={isLoading}
        emptyMessage={
          jobFilter || statusFilter !== 'all'
            ? 'No applications match your filter.'
            : 'No applications received yet.'
        }
        onView={(app) => setViewingApplication(app)}
        onDelete={setDeletingApplication}
      />

      {/* View Applicant Details Modal */}
      {viewingApplication && (
        <ApplicationDetailModal
          application={viewingApplication}
          onClose={() => setViewingApplication(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Delete Application Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingApplication)}
        title="Delete application?"
        message={`This will permanently remove ${
          deletingApplication?.name ?? 'this applicant'
        }'s application.`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeletingApplication(null)}
        isConfirming={isDeleting}
      />
    </>
  );
}
