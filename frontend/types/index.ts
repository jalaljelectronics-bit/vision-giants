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
  client_name: string;
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
  published_at: string;
  created_at: string;
}

export interface JobPosting {
  id: number;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  is_active: boolean;
  created_at: string;
}

export interface JobApplicationPayload {
  job_id: number;
  name: string;
  email: string;
  phone: string;
  resume_url: string;
  cover_letter: string;
}

export interface ContactLeadPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error: string | null;
}