
// pages/jobs.tsx

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { JobPosting } from '@/types';
import { adminApi } from '@/lib/api';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import JobFormModal from '@/components/admin/JobFormModal';

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingJob, setDeletingJob] = useState<JobPosting | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setIsLoading(true);

    try {
      const res = await adminApi.get<JobPosting[]>('/jobs/admin/all');
      setJobs(res.data ?? []);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddNew() {
    setEditingJob(null);
    setIsFormOpen(true);
  }

  function handleEdit(job: JobPosting) {
    setEditingJob(job);
    setIsFormOpen(true);
  }

  async function handleDeleteConfirmed() {
    if (!deletingJob) return;

    setIsDeleting(true);

    try {
      await adminApi.delete(`/jobs/${deletingJob.id}`);

      setJobs((prev) =>
        prev.filter((job) => job.id !== deletingJob.id)
      );

      setDeletingJob(null);
    } catch (error) {
      console.error('Failed to delete job:', error);
    } finally {
      setIsDeleting(false);
    }
  }

  const columns: Column<JobPosting>[] = [
    {
      key: 'title',
      header: 'Title',
    },
    {
      key: 'department',
      header: 'Department',
    },
    {
      key: 'location',
      header: 'Location',
    },
    {
      key: 'type',
      header: 'Type',
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (job) => (
        <span
          className={
            job.is_active
              ? 'admin-badge-success'
              : 'admin-badge-pending'
          }
        >
          {job.is_active ? 'Active' : 'Closed'}
        </span>
      ),
    },
    {
      key: 'applications',
      header: 'Applications',
      render: (job) => (
        <Link
          href={`/applications?job=${job.id}`}
          className="admin-table-link"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Jobs — Vision Giants Admin</title>
      </Head>

      <div className="admin-page-header">
        <h1 className="admin-page-title">
          Job Postings
        </h1>

        <button
          type="button"
          onClick={handleAddNew}
          className="admin-button-primary"
        >
          + New Job Posting
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={jobs}
        isLoading={isLoading}
        emptyMessage="No job postings yet — add your first opening."
        onEdit={handleEdit}
        onDelete={setDeletingJob}
      />

      {isFormOpen && (
        <JobFormModal
          job={editingJob}
          onClose={() => setIsFormOpen(false)}
          onSaved={(saved) => {
            setIsFormOpen(false);

            setJobs((prev) => {
              const exists = prev.some(
                (job) => job.id === saved.id
              );

              return exists
                ? prev.map((job) =>
                    job.id === saved.id ? saved : job
                  )
                : [...prev, saved];
            });
          }}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deletingJob)}
        title="Delete job posting?"
        message={`This will permanently remove "${
          deletingJob?.title ?? 'this job'
        }". Existing applications for this job will remain in the Applications tab.`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeletingJob(null)}
        isConfirming={isDeleting}
      />
    </>
  );
}

