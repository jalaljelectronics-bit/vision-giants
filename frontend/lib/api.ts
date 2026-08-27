import type { ApiEnvelope } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

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
  getServices: () => request<import('@/types').Service[]>('/services'),
  getService: (slug: string) => request<import('@/types').Service>(`/services/${slug}`),

  getPortfolio: () => request<import('@/types').PortfolioItem[]>('/portfolio'),
  getPortfolioItem: (slug: string) => request<import('@/types').PortfolioItem>(`/portfolio/${slug}`),

  getTeam: () => request<import('@/types').TeamMember[]>('/team'),
  getTestimonials: () => request<import('@/types').Testimonial[]>('/testimonials'),

  getBlogPosts: () => request<import('@/types').BlogPost[]>('/blog'),
  getBlogPost: (slug: string) => request<import('@/types').BlogPost>(`/blog/${slug}`),

  getJobs: () => request<import('@/types').JobPosting[]>('/careers'),
  getJob: (slug: string) => request<import('@/types').JobPosting>(`/careers/${slug}`),
  applyToJob: (payload: import('@/types').JobApplicationPayload) =>
    request<{ id: number }>('/careers/apply', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  submitContactLead: (payload: import('@/types').ContactLeadPayload) =>
    request<{ id: number }>('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};