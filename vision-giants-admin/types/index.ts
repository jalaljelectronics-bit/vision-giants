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
  order: number;
  created_at: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  slug: string;
  client_name: string;
  description: string;
  images: string[];
  technologies: string[];
  featured: boolean;
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

export interface JobApplication {
  id: number;
  job_id: number;
  name: string;
  email: string;
  phone: string;
  resume_url: string;
  cover_letter: string;
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