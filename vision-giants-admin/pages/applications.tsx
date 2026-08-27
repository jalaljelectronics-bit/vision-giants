// pages/applications.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import type { JobApplication, JobPosting } from '@/types';
import { adminApi } from '@/lib/api';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

export default function ApplicationsPage() {
  const router = useRouter();
  const jobFilter = router.query.job ? Number(router.query.job) : null;

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingApplication, setDeletingApplication] = useState<JobApplication | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setIsLoading(true);
    Promise.all([
      adminApi.get<JobApplication[]>('/admin/applications'),
      adminApi.get<JobPosting[]>('/admin/jobs'),
    ])
      .then(([appsRes, jobsRes]) => {
        setApplications(appsRes.data ?? []);
        setJobs(jobsRes.data ?? []);
      })
      .finally(() => setIsLoading(false));
  }

  async function handleDeleteConfirmed() {
    if (!deletingApplication) return;
    setIsDeleting(true);
    try {
      await adminApi.delete(`/admin/applications/${deletingApplication.id}`);
      setApplications((prev) => prev.filter((a) => a.id !== deletingApplication.id));
      setDeletingApplication(null);
    } finally {
      setIsDeleting(false);
    }
  }

  function jobTitleFor(jobId: number): string {
    return jobs.find((j) => j.id === jobId)?.title ?? `Job #${jobId}`;
  }

  function clearFilter() {
    router.push('/applications');
  }

  const visibleApplications = jobFilter
    ? applications.filter((a) => a.job_id === jobFilter)
    : applications;

  const columns: Column<JobApplication>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'job_id',
      header: 'Applied For',
      render: (a) => jobTitleFor(a.job_id),
    },
    {
      key: 'resume_url',
      header: 'Resume',
      render: (a) =>
        a.resume_url ? (
          <a href={a.resume_url} target="_blank" rel="noopener noreferrer" className="admin-table-link">
            View PDF
          </a>
        ) : (
          '—'
        ),
    },
    {
      key: 'created_at',
      header: 'Applied On',
      render: (a) => new Date(a.created_at).toLocaleDateString(),
    },
  ];

  return (
    <>
      <Head>
        <title>Applications — Vision Giants Admin</title>
      </Head>

      <div className="admin-page-header">
        <h1 className="admin-page-title">Applications</h1>
        {jobFilter && (
          <button type="button" onClick={clearFilter} className="admin-button-secondary">
            Clear filter: {jobTitleFor(jobFilter)} ✕
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        rows={visibleApplications}
        isLoading={isLoading}
        emptyMessage={
          jobFilter ? 'No applications for this job yet.' : 'No applications yet.'
        }
        onDelete={setDeletingApplication}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingApplication)}
        title="Delete application?"
        message={`This will permanently remove ${deletingApplication?.name}'s application.`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeletingApplication(null)}
        isConfirming={isDeleting}
      />
    </>
  );
}