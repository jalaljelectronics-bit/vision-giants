
import { useEffect, useState } from 'react';
import Head from 'next/head';
import type { ContactLead, LeadStatus } from '@/types';
import { adminApi } from '@/lib/api';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

const STATUS_OPTIONS: LeadStatus[] = [
  'new',
  'contacted',
  'closed',
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingLead, setDeletingLead] =
    useState<ContactLead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingId, setUpdatingId] =
    useState<number | null>(null);
  const [statusFilter, setStatusFilter] =
    useState<LeadStatus | 'all'>('all');

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    setIsLoading(true);

    try {
      const res = await adminApi.get<ContactLead[]>('/leads');
      setLeads(res.data ?? []);
    } catch {
      setLeads([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(
    lead: ContactLead,
    newStatus: LeadStatus
  ) {
    if (newStatus === lead.status) {
      return;
    }

    setUpdatingId(lead.id);

    const previousStatus = lead.status;

    setLeads((prev) =>
      prev.map((l) =>
        l.id === lead.id
          ? { ...l, status: newStatus }
          : l
      )
    );

    try {
      await adminApi.patch(
        `/leads/${lead.id}/status`,
        {
          status: newStatus,
        }
      );
    } catch {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === lead.id
            ? { ...l, status: previousStatus }
            : l
        )
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDeleteConfirmed() {
    if (!deletingLead) {
      return;
    }

    setIsDeleting(true);

    try {
      await adminApi.delete(
        `/leads/${deletingLead.id}`
      );

      setLeads((prev) =>
        prev.filter(
          (l) => l.id !== deletingLead.id
        )
      );

      setDeletingLead(null);
    } catch {
      // Keep the lead in the table if deletion fails.
    } finally {
      setIsDeleting(false);
    }
  }

  const visibleLeads =
    statusFilter === 'all'
      ? leads
      : leads.filter(
          (lead) => lead.status === statusFilter
        );

  const columns: Column<ContactLead>[] = [
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
      key: 'subject',
      header: 'Subject',
    },
    {
      key: 'message',
      header: 'Message',
      render: (lead) =>
        lead.message.length > 50
          ? `${lead.message.slice(0, 50)}…`
          : lead.message,
    },
    {
      key: 'status',
      header: 'Status',
      render: (lead) => (
        <select
          value={lead.status}
          disabled={updatingId === lead.id}
          onChange={(e) =>
            handleStatusChange(
              lead,
              e.target.value as LeadStatus
            )
          }
          className={`admin-status-select admin-status-${lead.status}`}
        >
          {STATUS_OPTIONS.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status.charAt(0).toUpperCase() +
                status.slice(1)}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: 'created_at',
      header: 'Received',
      render: (lead) =>
        new Date(
          lead.created_at
        ).toLocaleDateString(),
    },
  ];

  return (
    <>
      <Head>
        <title>Leads — Vision Giants Admin</title>
      </Head>

      <div className="admin-page-header">
        <h1 className="admin-page-title">
          Leads
        </h1>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value as
                | LeadStatus
                | 'all'
            )
          }
          className="admin-filter-select"
        >
          <option value="all">
            All statuses
          </option>

          {STATUS_OPTIONS.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status.charAt(0).toUpperCase() +
                status.slice(1)}
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

