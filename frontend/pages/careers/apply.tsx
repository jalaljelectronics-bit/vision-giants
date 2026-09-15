import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { Seo } from '@/components/seo/Seo';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { api } from '@/lib/api';
import { siteConfig } from '@/lib/utils';
import type { JobPosting } from '@/types';
import {
  ArrowLeft,
  UploadCloud,
  CheckCircle2,
  FileText,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface Props {
  jobs: JobPosting[];
}

export default function CareerApplyPage({ jobs }: Props) {
  const router = useRouter();
  const { role } = router.query;

  const [availableJobs, setAvailableJobs] = useState<JobPosting[]>(jobs || []);
  const [selectedJobId, setSelectedJobId] = useState<string>('');

  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    gender: 'Male',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
    email: '',
    education: '',
    experience: '',
    remoteJob: '',
    aboutYourself: '',
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // If jobs weren't populated via static props, load client-side
  useEffect(() => {
    if (availableJobs.length === 0) {
      api.getJobs().then((data) => setAvailableJobs(data.filter((j) => j.is_active))).catch(() => {});
    }
  }, [availableJobs.length]);

  // Preselect job role based on query string
  useEffect(() => {
    if (role && availableJobs.length > 0) {
      const match = availableJobs.find((j) => j.slug === role || j.id === Number(role));
      if (match) {
        setSelectedJobId(String(match.id));
      }
    }
  }, [role, availableJobs]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setResumeError('File size exceeds 5MB limit. Please choose a smaller file.');
      return;
    }

    // Validate type
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const hasValidExt = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );
    if (!hasValidExt) {
      setResumeError('Please upload a valid PDF or DOCX document.');
      return;
    }

    setResumeError(null);
    setResumeFile(file);

    // Upload immediately to Cloudinary
    setIsUploadingResume(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', 'vision_giants');
      uploadData.append('folder', 'resumes');

      const res = await fetch('https://api.cloudinary.com/v1_1/r2fk1fws/auto/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const json = await res.json();
      if (json.secure_url) {
        setResumeUrl(json.secure_url);
      } else {
        throw new Error('No URL returned');
      }
    } catch (err) {
      console.error('Resume upload error:', err);
      setResumeError('Failed to upload resume to server. Please try again.');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    setResumeUrl('');
    setResumeError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formData.firstName.trim()) {
      setSubmitError('Please enter your first name.');
      return;
    }

    if (!formData.email.trim()) {
      setSubmitError('Please enter your email address.');
      return;
    }

    if (isUploadingResume) {
      setSubmitError('Please wait until your resume finishes uploading.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        job_id: selectedJobId ? Number(selectedJobId) : null,
        first_name: formData.firstName.trim(),
        last_name: formData.secondName.trim(),
        name: `${formData.firstName.trim()} ${formData.secondName.trim()}`.trim(),
        gender: formData.gender,
        date_of_birth: formData.dateOfBirth,
        phone: formData.phoneNumber.trim(),
        address: formData.address.trim(),
        email: formData.email.trim(),
        education: formData.education.trim(),
        experience: formData.experience.trim(),
        remote_job: formData.remoteJob,
        cover_letter: formData.aboutYourself.trim(),
        resume_url: resumeUrl || undefined,
      };

      await api.applyToJob(payload);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Failed to submit application:', err);
      setSubmitError(err.message || 'Failed to submit application. Please check your information and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    if (role) {
      router.push(`/careers/${role}`);
    } else {
      router.push('/careers');
    }
  };

  return (
    <>
      <Seo
        title="Application Form"
        description="Apply for a career at Vision Giants. Join our engineering and design team."
        path="/careers/apply"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Careers', url: `${siteConfig.url}/careers` },
          { name: 'Application Form', url: `${siteConfig.url}/careers/apply` },
        ]}
      />

      <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6 md:pt-36">
        <div className="rounded-2xl border border-tertiary/40 bg-surface p-6 shadow-sm sm:p-10">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between border-b border-tertiary/30 pb-5">
            <h1 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              Application Form
            </h1>
            <button
              type="button"
              onClick={handleGoBack}
              className="flex items-center gap-1.5 text-sm font-medium text-body/70 transition-colors hover:text-primary"
            >
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          {isSuccess ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00D09C]/10 text-[#00D09C]">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="mt-5 font-display text-2xl font-semibold text-primary">
                Application Submitted!
              </h2>
              <p className="mt-3 max-w-md text-sm text-body/70 leading-relaxed">
                Thank you for applying to Vision Giants. We have received your details and resume.
                Our hiring team will review your application and get in touch with you soon.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/careers"
                  className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Explore more roles
                </Link>
                <Link
                  href="/"
                  className="rounded-lg border border-tertiary/40 px-6 py-2.5 text-sm font-medium text-body transition-colors hover:bg-primary-container/30"
                >
                  Return Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Row 1: First name & Second name */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-primary">
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Jordan"
                    className="w-full rounded-lg border border-tertiary/40 bg-background px-3.5 py-2.5 text-sm text-body outline-none transition-all placeholder:text-body/40 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="secondName" className="mb-1.5 block text-sm font-medium text-primary">
                    Second name
                  </label>
                  <input
                    type="text"
                    id="secondName"
                    name="secondName"
                    value={formData.secondName}
                    onChange={handleInputChange}
                    placeholder="Malik"
                    className="w-full rounded-lg border border-tertiary/40 bg-background px-3.5 py-2.5 text-sm text-body outline-none transition-all placeholder:text-body/40 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Row 2: Gender */}
              <div>
                <label className="mb-2 block text-sm font-medium text-primary">Gender</label>
                <div className="flex items-center gap-6 pt-1">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-body">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === 'Male'}
                      onChange={handleInputChange}
                      className="h-4 w-4 accent-primary"
                    />
                    Male
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-body">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === 'Female'}
                      onChange={handleInputChange}
                      className="h-4 w-4 accent-primary"
                    />
                    Female
                  </label>
                </div>
              </div>

              {/* Row 3: Date of birth & Phone number */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="dateOfBirth" className="mb-1.5 block text-sm font-medium text-primary">
                    Date of birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-tertiary/40 bg-background px-3.5 py-2.5 text-sm text-body outline-none transition-all placeholder:text-body/40 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="mb-1.5 block text-sm font-medium text-primary">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+92 3xx xxxxxxx"
                    className="w-full rounded-lg border border-tertiary/40 bg-background px-3.5 py-2.5 text-sm text-body outline-none transition-all placeholder:text-body/40 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Row 4: Address */}
              <div>
                <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-primary">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street, city"
                  className="w-full rounded-lg border border-tertiary/40 bg-background px-3.5 py-2.5 text-sm text-body outline-none transition-all placeholder:text-body/40 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Row 5: Email */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-primary">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@email.com"
                  className="w-full rounded-lg border border-tertiary/40 bg-background px-3.5 py-2.5 text-sm text-body outline-none transition-all placeholder:text-body/40 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Row 6: Education */}
              <div>
                <label htmlFor="education" className="mb-1.5 block text-sm font-medium text-primary">
                  Education
                </label>
                <input
                  type="text"
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  placeholder="e.g. BS Computer Science"
                  className="w-full rounded-lg border border-tertiary/40 bg-background px-3.5 py-2.5 text-sm text-body outline-none transition-all placeholder:text-body/40 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Row 7: Apply for & Experience */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="applyFor" className="mb-1.5 block text-sm font-medium text-primary">
                    Apply for
                  </label>
                  <select
                    id="applyFor"
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="w-full rounded-lg border border-tertiary/40 bg-background px-3.5 py-2.5 text-sm text-body outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select a role...</option>
                    {availableJobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} ({job.department})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="experience" className="mb-1.5 block text-sm font-medium text-primary">
                    Experience
                  </label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="e.g. 2 years"
                    className="w-full rounded-lg border border-tertiary/40 bg-background px-3.5 py-2.5 text-sm text-body outline-none transition-all placeholder:text-body/40 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Row 8: Apply for remote job? */}
              <div>
                <label htmlFor="remoteJob" className="mb-1.5 block text-sm font-medium text-primary">
                  Apply for remote job?
                </label>
                <select
                  id="remoteJob"
                  name="remoteJob"
                  value={formData.remoteJob}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-tertiary/40 bg-background px-3.5 py-2.5 text-sm text-body outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select an option...</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {/* Row 9: Tell about yourself */}
              <div>
                <label htmlFor="aboutYourself" className="mb-1.5 block text-sm font-medium text-primary">
                  Tell about yourself
                </label>
                <textarea
                  id="aboutYourself"
                  name="aboutYourself"
                  rows={4}
                  value={formData.aboutYourself}
                  onChange={handleInputChange}
                  placeholder="A few lines about you and your work..."
                  className="w-full resize-none rounded-lg border border-tertiary/40 bg-background px-3.5 py-2.5 text-sm text-body outline-none transition-all placeholder:text-body/40 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Row 10: Resume Upload */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-primary">Resume</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  id="resumeUploadInput"
                />

                {!resumeFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-tertiary/60 bg-background/60 py-6 px-4 text-center transition-colors hover:border-primary/50 hover:bg-background"
                  >
                    <div className="flex items-center gap-2 text-sm text-body/80">
                      <UploadCloud size={20} className="text-primary" />
                      <span className="font-medium">PDF or DOCX, up to 5MB</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-xl border border-tertiary/40 bg-background px-4 py-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText size={22} className="shrink-0 text-primary" />
                      <div className="truncate">
                        <p className="truncate text-sm font-medium text-primary">{resumeFile.name}</p>
                        <p className="text-xs text-body/60">
                          {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                          {isUploadingResume && ' • Uploading...'}
                          {resumeUrl && ' • Ready'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isUploadingResume ? (
                        <Loader2 size={18} className="animate-spin text-primary" />
                      ) : (
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="rounded-full p-1 text-body/60 transition-colors hover:bg-tertiary/30 hover:text-red-600"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {resumeError && (
                  <p className="mt-1.5 text-xs text-red-600">{resumeError}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isUploadingResume}
                className="w-full rounded-lg bg-[#00D09C] py-3.5 text-center text-sm font-bold text-[#111827] shadow-sm transition-all hover:bg-[#00B789] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" /> Submitting Application...
                  </span>
                ) : (
                  'Submit'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const jobs = await api.getJobs();
    return {
      props: { jobs: jobs.filter((j) => j.is_active) },
      revalidate: 60,
    };
  } catch {
    return { props: { jobs: [] }, revalidate: 60 };
  }
};

