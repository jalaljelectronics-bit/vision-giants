// pages/leads.tsx
import { useEffect, useState } from 'react';
import Head from 'next/head';
import type { ContactLead, LeadStatus } from '@/types';
import { adminApi } from '@/lib/api';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

const STATUS_OPTIONS: LeadStatus[] = ['new', 'contacted', 'closed'];

export default function LeadsPage() {
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingLead, setDeletingLead] = useState<ContactLead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');

  useEffect(() => {
    loadLeads();
  }, []);

  function loadLeads() {
    setIsLoading(true);
    adminApi
      .get<ContactLead[]>('/admin/leads')
      .then((res) => setLeads(res.data ?? []))
      .finally(() => setIsLoading(false));
  }

  async function handleStatusChange(lead: ContactLead, newStatus: LeadStatus) {
    setUpdatingId(lead.id);
    // Optimistic update — revert on failure
    const previousStatus = lead.status;
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, status: newStatus } : l))
    );

    try {
      await adminApi.patch(`/admin/leads/${lead.id}`, { status: newStatus });
    } catch {
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, status: previousStatus } : l))
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDeleteConfirmed() {
    if (!deletingLead) return;
    setIsDeleting(true);
    try {
      await adminApi.delete(`/admin/leads/${deletingLead.id}`);
      setLeads((prev) => prev.filter((l) => l.id !== deletingLead.id));
      setDeletingLead(null);
    } finally {
      setIsDeleting(false);
    }
  }

  const visibleLeads =
    statusFilter === 'all' ? leads : leads.filter((l) => l.status === statusFilter);

  const columns: Column<ContactLead>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'subject', header: 'Subject' },
    {
      key: 'message',
      header: 'Message',
      render: (l) => (l.message.length > 50 ? `${l.message.slice(0, 50)}…` : l.message),
    },
    {
      key: 'status',
      header: 'Status',
      render: (l) => (
        <select
          value={l.status}
          disabled={updatingId === l.id}
          onChange={(e) => handleStatusChange(l, e.target.value as LeadStatus)}
          className={`admin-status-select admin-status-${l.status}`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: 'created_at',
      header: 'Received',
      render: (l) => new Date(l.created_at).toLocaleDateString(),
    },
  ];

  return (
    <>
      <Head>
        <title>Leads — Vision Giants Admin</title>
      </Head>

      <div className="admin-page-header">
        <h1 className="admin-page-title">Leads</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
          className="admin-filter-select"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        rows={visibleLeads}
        isLoading={isLoading}
        emptyMessage="No leads yet."
        onDelete={setDeletingLead}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingLead)}
        title="Delete lead?"
        message={`This will permanently remove the message from "${deletingLead?.name}".`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeletingLead(null)}
        isConfirming={isDeleting}
      />
    </>
  );
}