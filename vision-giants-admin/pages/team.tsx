
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
  const [editingMember, setEditingMember] =
    useState<TeamMember | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingMember, setDeletingMember] =
    useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    setIsLoading(true);

    try {
      const res =
        await adminApi.get<TeamMember[]>('/team');

      setMembers(res.data ?? []);
    } catch (error) {
      console.error(
        'Failed to load team members:',
        error
      );
    } finally {
      setIsLoading(false);
    }
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
      await adminApi.delete(
        `/team/${deletingMember.id}`
      );

      setMembers((prev) =>
        prev.filter(
          (member) =>
            member.id !== deletingMember.id
        )
      );

      setDeletingMember(null);
    } catch (error) {
      console.error(
        'Failed to delete team member:',
        error
      );
    } finally {
      setIsDeleting(false);
    }
  }

  const columns: Column<TeamMember>[] = [
    {
      key: 'order',
      header: 'Order',
    },
    {
      key: 'name',
      header: 'Name',
    },
    {
      key: 'role',
      header: 'Role',
    },
  ];

  return (
    <>
      <Head>
        <title>
          Team — Vision Giants Admin
        </title>
      </Head>

      <div className="admin-page-header">
        <h1 className="admin-page-title">
          Team
        </h1>

        <button
          type="button"
          onClick={handleAddNew}
          className="admin-button-primary"
        >
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
              const exists = prev.some(
                (member) =>
                  member.id === saved.id
              );

              return exists
                ? prev.map((member) =>
                    member.id === saved.id
                      ? saved
                      : member
                  )
                : [...prev, saved];
            });
          }}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deletingMember)}
        title="Remove team member?"
        message={`This will permanently remove "${
          deletingMember?.name ??
          'this team member'
        }" from the team.`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() =>
          setDeletingMember(null)
        }
        isConfirming={isDeleting}
      />
    </>
  );
}

