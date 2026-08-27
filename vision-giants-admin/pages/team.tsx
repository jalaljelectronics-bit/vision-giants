// pages/team.tsx
import { useEffect, useState } from 'react';
import Head from 'next/head';
import type { TeamMember } from '@/types';
import { adminApi } from '@/lib/api';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import TeamFormModal from '@/components/admin/TeamFormModal';

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  function loadMembers() {
    setIsLoading(true);
    adminApi
      .get<TeamMember[]>('/admin/team')
      .then((res) => setMembers(res.data ?? []))
      .finally(() => setIsLoading(false));
  }

  function handleAddNew() {
    setEditingMember(null);
    setIsFormOpen(true);
  }

  function handleEdit(member: TeamMember) {
    setEditingMember(member);
    setIsFormOpen(true);
  }

  async function handleDeleteConfirmed() {
    if (!deletingMember) return;
    setIsDeleting(true);
    try {
      await adminApi.delete(`/admin/team/${deletingMember.id}`);
      setMembers((prev) => prev.filter((m) => m.id !== deletingMember.id));
      setDeletingMember(null);
    } finally {
      setIsDeleting(false);
    }
  }

  const columns: Column<TeamMember>[] = [
    { key: 'order', header: 'Order' },
    { key: 'name', header: 'Name' },
    { key: 'role', header: 'Role' },
  ];

  return (
    <>
      <Head>
        <title>Team — Vision Giants Admin</title>
      </Head>

      <div className="admin-page-header">
        <h1 className="admin-page-title">Team</h1>
        <button type="button" onClick={handleAddNew} className="admin-button-primary">
          + Add Team Member
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={members}
        isLoading={isLoading}
        emptyMessage="No team members yet — add your first one."
        onEdit={handleEdit}
        onDelete={setDeletingMember}
      />

      {isFormOpen && (
        <TeamFormModal
          member={editingMember}
          onClose={() => setIsFormOpen(false)}
          onSaved={(saved) => {
            setIsFormOpen(false);
            setMembers((prev) => {
              const exists = prev.some((m) => m.id === saved.id);
              return exists
                ? prev.map((m) => (m.id === saved.id ? saved : m))
                : [...prev, saved];
            });
          }}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deletingMember)}
        title="Remove team member?"
        message={`This will permanently remove "${deletingMember?.name}" from the team.`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeletingMember(null)}
        isConfirming={isDeleting}
      />
    </>
  );
}