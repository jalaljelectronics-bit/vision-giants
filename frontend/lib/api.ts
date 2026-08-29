
import type { ApiEnvelope } from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  const json: ApiEnvelope<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || `Request to ${path} failed`);
  }

  return json.data;
}

export const api = {
  // Services
  getServices: () =>
    request<import('@/types').Service[]>('/services'),

  getService: (slug: string) =>
    request<import('@/types').Service>(`/services/${slug}`),

  // Portfolio
  getPortfolio: () =>
    request<import('@/types').PortfolioItem[]>('/portfolio'),

  getPortfolioItem: (slug: string) =>
    request<import('@/types').PortfolioItem>(`/portfolio/${slug}`),

  // Team
  getTeam: () =>
    request<import('@/types').TeamMember[]>('/team'),

  // Testimonials
  getTestimonials: () =>
    request<import('@/types').Testimonial[]>('/testimonials'),

  // Blog
  getBlogPosts: () =>
    request<import('@/types').BlogPost[]>('/blog'),

  getBlogPost: (slug: string) =>
    request<import('@/types').BlogPost>(`/blog/${slug}`),

  // Jobs / Careers
  getJobs: () =>
    request<import('@/types').JobPosting[]>('/jobs'),

  getJob: (slug: string) =>
    request<import('@/types').JobPosting>(`/jobs/${slug}`),

  applyToJob: (payload: import('@/types').JobApplicationPayload) =>
    request<{ id: number }>('/applications', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Contact / Leads
  submitContactLead: (payload: import('@/types').ContactLeadPayload) =>
    request<{ id: number }>('/leads', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
