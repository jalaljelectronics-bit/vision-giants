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

  function loadJobs() {
    setIsLoading(true);
    adminApi
      .get<JobPosting[]>('/admin/jobs')
      .then((res) => setJobs(res.data ?? []))
      .finally(() => setIsLoading(false));
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
      await adminApi.delete(`/admin/jobs/${deletingJob.id}`);
      setJobs((prev) => prev.filter((j) => j.id !== deletingJob.id));
      setDeletingJob(null);
    } finally {
      setIsDeleting(false);
    }
  }

  const columns: Column<JobPosting>[] = [
    { key: 'title', header: 'Title' },
    { key: 'department', header: 'Department' },
    { key: 'location', header: 'Location' },
    { key: 'type', header: 'Type' },
    {
      key: 'is_active',
      header: 'Status',
      render: (j) => (
        <span className={j.is_active ? 'admin-badge-success' : 'admin-badge-pending'}>
          {j.is_active ? 'Active' : 'Closed'}
        </span>
      ),
    },
    {
      key: 'applications',
      header: 'Applications',
      render: (j) => (
        <Link href={`/applications?job=${j.id}`} className="admin-table-link">
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
        <h1 className="admin-page-title">Job Postings</h1>
        <button type="button" onClick={handleAddNew} className="admin-button-primary">
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
              const exists = prev.some((j) => j.id === saved.id);
              return exists ? prev.map((j) => (j.id === saved.id ? saved : j)) : [...prev, saved];
            });
          }}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deletingJob)}
        title="Delete job posting?"
        message={`This will permanently remove "${deletingJob?.title}". Existing applications for this job will remain in the Applications tab.`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeletingJob(null)}
        isConfirming={isDeleting}
      />
    </>
  );
}