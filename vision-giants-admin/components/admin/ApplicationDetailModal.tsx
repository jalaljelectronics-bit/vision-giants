import { useState } from 'react';
import type { JobApplication, ApplicationStatus } from '@/types';
import { adminApi } from '@/lib/api';

interface ApplicationDetailModalProps {
  application: JobApplication | null;
  onClose: () => void;
  onStatusChange: (id: number, newStatus: ApplicationStatus) => void;
}

const STATUS_OPTIONS: ApplicationStatus[] = [
  'new',
  'reviewed',
  'shortlisted',
  'rejected',
  'hired',
];

export default function ApplicationDetailModal({
  application,
  onClose,
  onStatusChange,
}: ApplicationDetailModalProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  if (!application) return null;

  async function handleStatusSelect(newStatus: ApplicationStatus) {
    if (!application || newStatus === application.status) return;

    setIsUpdatingStatus(true);
    try {
      await adminApi.patch(`/applications/${application.id}/status`, {
        status: newStatus,
      });
      onStatusChange(application.id, newStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  const applicantName =
    application.name ||
    [application.first_name, application.last_name].filter(Boolean).join(' ') ||
    'Applicant';

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal admin-modal-form-large"
        style={{ maxWidth: 680 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid var(--color-tertiary-accent)',
            paddingBottom: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 20, color: 'var(--color-primary)' }}>
              {applicantName}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-secondary)' }}>
              Applied for: <strong>{application.job_title || `Job #${application.job_id || 'General'}`}</strong>
              {application.created_at && (
                <span> • {new Date(application.created_at).toLocaleDateString()}</span>
              )}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ margin: 0, fontSize: 12, color: 'var(--color-secondary)' }}>
              Status:
            </label>
            <select
              value={application.status || 'new'}
              disabled={isUpdatingStatus}
              onChange={(e) => handleStatusSelect(e.target.value as ApplicationStatus)}
              className="admin-status-select"
              style={{ fontWeight: 600 }}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Section: Contact & Personal Details */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12,
              background: 'var(--color-background)',
              padding: 16,
              borderRadius: 8,
              border: '1px solid var(--color-tertiary-accent)',
            }}
          >
            <div>
              <span style={{ fontSize: 11, color: 'var(--color-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Email Address
              </span>
              <a
                href={`mailto:${application.email}`}
                style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-primary)' }}
              >
                {application.email || '—'}
              </a>
            </div>

            <div>
              <span style={{ fontSize: 11, color: 'var(--color-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Phone Number
              </span>
              {application.phone ? (
                <a
                  href={`tel:${application.phone}`}
                  style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-primary)' }}
                >
                  {application.phone}
                </a>
              ) : (
                <span style={{ fontSize: 14, color: 'var(--color-body-text)' }}>—</span>
              )}
            </div>

            <div>
              <span style={{ fontSize: 11, color: 'var(--color-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Gender
              </span>
              <span style={{ fontSize: 14, color: 'var(--color-body-text)' }}>
                {application.gender || '—'}
              </span>
            </div>

            <div>
              <span style={{ fontSize: 11, color: 'var(--color-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Date of Birth
              </span>
              <span style={{ fontSize: 14, color: 'var(--color-body-text)' }}>
                {application.date_of_birth || '—'}
              </span>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <span style={{ fontSize: 11, color: 'var(--color-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Address / Location
              </span>
              <span style={{ fontSize: 14, color: 'var(--color-body-text)' }}>
                {application.address || '—'}
              </span>
            </div>
          </div>

          {/* Section: Academic & Experience */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 12,
              background: 'var(--color-background)',
              padding: 16,
              borderRadius: 8,
              border: '1px solid var(--color-tertiary-accent)',
            }}
          >
            <div>
              <span style={{ fontSize: 11, color: 'var(--color-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Education
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-body-text)' }}>
                {application.education || '—'}
              </span>
            </div>

            <div>
              <span style={{ fontSize: 11, color: 'var(--color-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Experience
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-body-text)' }}>
                {application.experience || '—'}
              </span>
            </div>

            <div>
              <span style={{ fontSize: 11, color: 'var(--color-secondary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Remote Job Preference
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-body-text)' }}>
                {application.remote_job || '—'}
              </span>
            </div>
          </div>

          {/* Section: Tell about yourself / Cover Letter */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-secondary)', display: 'block', marginBottom: 6 }}>
              Tell about yourself / Statement
            </label>
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 6,
                border: '1px solid var(--color-tertiary-accent)',
                background: 'var(--color-background)',
                fontSize: 14,
                lineHeight: 1.5,
                color: 'var(--color-body-text)',
                whiteSpace: 'pre-wrap',
                minHeight: 80,
              }}
            >
              {application.cover_letter ? application.cover_letter : <em>No statement provided.</em>}
            </div>
          </div>

          {/* Section: Resume View */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-secondary)', display: 'block', marginBottom: 6 }}>
              Applicant Resume
            </label>
            {application.resume_url ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid #00D09C',
                  background: 'rgba(0, 208, 156, 0.08)',
                }}
              >
                <div>
                  <strong style={{ fontSize: 14, color: 'var(--color-primary)' }}>
                    📄 Resume Document Attached
                  </strong>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-secondary)' }}>
                    Uploaded PDF/DOCX file
                  </p>
                </div>
                <a
                  href={application.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-button-primary"
                  style={{
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: 'var(--color-primary)',
                  }}
                >
                  View & Download Resume ↗
                </a>
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: 'var(--color-secondary)' }}>
                No resume was uploaded for this application.
              </p>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="admin-modal-actions" style={{ marginTop: 24 }}>
          <button type="button" onClick={onClose} className="admin-button-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

