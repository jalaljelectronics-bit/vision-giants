// types/index.ts

export interface Admin {
  id: number;
  email: string;
  name: string;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  image: string;
  sub_services: { title: string; description: string }[];
  order: number;
  created_at: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  slug: string;
  project_url: string;
  related_service_id: number | null;
  cover_image: string;
  challenge: string;
  solution: string;
  result: string;
  technologies: string[];
  featured: boolean;
  is_new_arrival: boolean;
  is_draft: boolean;
  created_at: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  photo: string;
  order: number;
}

export interface Testimonial {
  id: number;
  client_name: string;
  client_company: string;
  content: string;
  rating: number;
  photo: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  meta_title: string;
  meta_description: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface JobPosting {
  id: number;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string; // e.g. "Full-time", "Contract"
  experience_level: string; // e.g. "Mid", "Senior"
  description: string;
  requirements: string[];
  responsibilities: string[];
  is_active: boolean;
  created_at: string;
}

export type ApplicationStatus = 'new' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';

export interface JobApplication {
  id: number;
  job_id: number | null;
  job_title?: string;
  job_department?: string;
  name: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  date_of_birth?: string;
  email: string;
  phone?: string;
  address?: string;
  education?: string;
  experience?: string;
  remote_job?: string;
  resume_url?: string;
  cover_letter?: string;
  status?: ApplicationStatus;
  created_at: string;
}

export type LeadStatus = 'new' | 'contacted' | 'closed';

export interface ContactLead {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: LeadStatus;
  created_at: string;
}

// Consistent API envelope used across every backend endpoint
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}