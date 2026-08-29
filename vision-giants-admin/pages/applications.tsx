
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

  const jobFilter = router.query.job
    ? Number(router.query.job)
    : null;

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingApplication, setDeletingApplication] =
    useState<JobApplication | null>(null);
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
      await adminApi.delete(
        `/applications/${deletingApplication.id}`
      );

      setApplications((prev) =>
        prev.filter(
          (application) =>
            application.id !== deletingApplication.id
        )
      );

      setDeletingApplication(null);
    } catch (error) {
      console.error('Failed to delete application:', error);
    } finally {
      setIsDeleting(false);
    }
  }

  function jobTitleFor(jobId: number): string {
    return (
      jobs.find((job) => job.id === jobId)?.title ??
      `Job #${jobId}`
    );
  }

  function clearFilter() {
    router.push('/applications');
  }

  const visibleApplications = jobFilter
    ? applications.filter(
        (application) => application.job_id === jobFilter
      )
    : applications;

  const columns: Column<JobApplication>[] = [
    {
      key: 'name',
      header: 'Name',
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'phone',
      header: 'Phone',
    },
    {
      key: 'job_id',
      header: 'Applied For',
      render: (application) =>
        jobTitleFor(application.job_id),
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
          >
            View PDF
          </a>
        ) : (
          '—'
        ),
    },
    {
      key: 'created_at',
      header: 'Applied On',
      render: (application) =>
        new Date(
          application.created_at
        ).toLocaleDateString(),
    },
  ];

  return (
    <>
      <Head>
        <title>Applications — Vision Giants Admin</title>
      </Head>

      <div className="admin-page-header">
        <h1 className="admin-page-title">
          Applications
        </h1>

        {jobFilter && (
          <button
            type="button"
            onClick={clearFilter}
            className="admin-button-secondary"
          >
            Clear filter: {jobTitleFor(jobFilter)} ✕
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        rows={visibleApplications}
        isLoading={isLoading}
        emptyMessage={
          jobFilter
            ? 'No applications for this job yet.'
            : 'No applications yet.'
        }
        onDelete={setDeletingApplication}
      />

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

