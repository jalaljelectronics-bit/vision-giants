// Placeholder content so every page renders a realistic layout without a
// live backend. Each page's getStaticProps falls back to this data if the
// API call fails (e.g. no backend running locally) — swap for real content
// once your API is live; nothing else needs to change.
import type {
  Service,
  PortfolioItem,
  TeamMember,
  Testimonial,
  BlogPost,
  JobPosting,
} from '@/types';

export const mockServices: Service[] = [
  {
    id: 1,
    title: 'Web Development',
    slug: 'web-development',
    short_description:
      'Fast, accessible, SEO-first web apps built on modern frameworks — from marketing sites to full product platforms.',
    description:
      '<p>We build production-grade web applications using Next.js, React, and TypeScript — architected for speed, SEO, and long-term maintainability.</p><ul><li>Server-rendered and statically generated sites</li><li>Design systems and component libraries</li><li>Headless CMS integration</li><li>Performance and Core Web Vitals tuning</li></ul>',
    image: '/videos/hero-bg-poster.jpg',
    order: 1,
    created_at: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'Mobile App Development',
    slug: 'mobile-apps',
    short_description:
      'Native-feel iOS and Android apps from a single React Native codebase, shipped to both stores.',
    description:
      '<p>One codebase, two native apps. We handle everything from architecture to App Store / Play Store submission.</p><ul><li>React Native + TypeScript</li><li>Offline-first data sync</li><li>Push notifications and deep linking</li><li>App store release management</li></ul>',
    image: '/videos/hero-bg-poster.jpg',
    order: 2,
    created_at: '2026-01-20T00:00:00.000Z',
  },
  {
    id: 3,
    title: 'Custom Software',
    slug: 'custom-software',
    short_description:
      'Bespoke internal tools, dashboards, and platforms tailored to how your team actually works.',
    description:
      '<p>Off-the-shelf software forces your process to bend around it. We build tools shaped around your actual workflow instead.</p><ul><li>Internal admin tools and dashboards</li><li>Workflow automation</li><li>Third-party API integrations</li><li>Legacy system modernization</li></ul>',
    image: '/videos/hero-bg-poster.jpg',
    order: 3,
    created_at: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 4,
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    short_description:
      'Interfaces designed around real user research, not just visual trend-chasing.',
    description:
      '<p>Good design is a business decision, not decoration. We design interfaces backed by research and validated with real users.</p><ul><li>User research and journey mapping</li><li>Wireframing and prototyping</li><li>Design systems</li><li>Usability testing</li></ul>',
    image: '/videos/hero-bg-poster.jpg',
    order: 4,
    created_at: '2026-02-10T00:00:00.000Z',
  },
];

export const mockPortfolio: PortfolioItem[] = [
  {
    id: 1,
    title: 'Ledgerly — Finance Dashboard',
    slug: 'ledgerly-finance-dashboard',
    client_name: 'Ledgerly Inc.',
    description:
      'A real-time financial reporting dashboard for SMB accounting teams, replacing a stack of disconnected spreadsheets with one live source of truth.',
    images: ['/videos/hero-bg-poster.jpg'],
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
    featured: true,
    created_at: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'Roamly — Travel Booking App',
    slug: 'roamly-travel-app',
    client_name: 'Roamly',
    description:
      'A cross-platform booking app for boutique travel agencies, with offline itinerary access and real-time price alerts.',
    images: ['/videos/hero-bg-poster.jpg'],
    technologies: ['React Native', 'Node.js', 'Redis'],
    featured: true,
    created_at: '2026-03-15T00:00:00.000Z',
  },
  {
    id: 3,
    title: 'Fieldwork — Ops Platform',
    slug: 'fieldwork-ops-platform',
    client_name: 'Fieldwork Logistics',
    description:
      'An internal dispatch and scheduling tool that cut manual routing time for a 40-vehicle delivery fleet by more than half.',
    images: ['/videos/hero-bg-poster.jpg'],
    technologies: ['React', 'Express', 'MySQL'],
    featured: false,
    created_at: '2026-04-02T00:00:00.000Z',
  },
  {
    id: 4,
    title: 'Northlight — E-commerce Rebuild',
    slug: 'northlight-ecommerce',
    client_name: 'Northlight Goods',
    description:
      'A full storefront rebuild focused on checkout conversion, cutting page load time by 60% and lifting mobile conversion 22%.',
    images: ['/videos/hero-bg-poster.jpg'],
    technologies: ['Next.js', 'Stripe', 'Sanity CMS'],
    featured: false,
    created_at: '2026-04-20T00:00:00.000Z',
  },
];

export const mockTeam: TeamMember[] = [
  { id: 1, name: 'Amama Aziz', role: 'Frontend Engineer', photo: '/videos/hero-bg-poster.jpg', order: 1 },
  { id: 2, name: 'Aamash Raza', role: 'Backend Engineer', photo: '/videos/hero-bg-poster.jpg', order: 2 },
  { id: 3, name: 'Maryam Khan', role: 'Product Designer', photo: '/videos/hero-bg-poster.jpg', order: 3 },
  { id: 4, name: 'Hassan Ishtiaq', role: 'Founder & CEO', photo: '/videos/hero-bg-poster.jpg', order: 4 },
];

export const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    client_name: 'Ali Hassan',
    client_company: 'Prime Digital Agency',
    content:
      'Their professionalism, communication, and technical expertise exceeded our expectations. The final product was fast, responsive, and easy to manage.',
    rating: 5,
    photo: '/videos/hero-bg-poster.jpg',
  },
  {
    id: 2,
    client_name: 'Sarah Ahmed',
    client_company: 'TechNova Solutions',
    content:
      'They redesigned our website and built a custom admin dashboard that streamlined our daily operations. Deadlines were met, communication stayed clear throughout.',
    rating: 5,
    photo: '/videos/hero-bg-poster.jpg',
  },
  {
    id: 3,
    client_name: 'Imran Abbas',
    client_company: 'Ledgerly Inc.',
    content:
      'Vision Giants understood our business, not just our spec sheet. Ledgerly runs on what they built for us every single day now.',
    rating: 5,
    photo: '/videos/hero-bg-poster.jpg',
  },
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'SaaS Providers vs SaaS Development Companies: What Does Your Business Need?',
    slug: 'saas-providers-vs-saas-development',
    content:
      '<p>SaaS providers sell you finished software. SaaS development companies build it for you. A practical guide to choosing between them.</p>',
    cover_image: '/videos/hero-bg-poster.jpg',
    meta_title: 'SaaS Providers vs SaaS Development Companies',
    meta_description: 'SaaS providers sell you finished software. SaaS development companies build it for you — here is how to choose.',
    published: true,
    published_at: '2026-08-17T00:00:00.000Z',
    created_at: '2026-08-17T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'SaaS MVP Development: What to Look for Before Hiring',
    slug: 'saas-mvp-development-what-to-look-for',
    content:
      '<p>Hiring an MVP team — how MVP hiring differs from a normal build, and what to check before signing a contract.</p>',
    cover_image: '/videos/hero-bg-poster.jpg',
    meta_title: 'SaaS MVP Development: A Hiring Guide',
    meta_description: 'How MVP hiring differs from a normal build, and what to check before you sign.',
    published: true,
    published_at: '2026-08-10T00:00:00.000Z',
    created_at: '2026-08-10T00:00:00.000Z',
  },
  {
    id: 3,
    title: 'How to Choose the Right Custom Software Partner',
    slug: 'choosing-a-custom-software-partner',
    content:
      '<p>Learn how to evaluate a custom software partner: process, ownership of code, communication cadence, and what red flags to watch for.</p>',
    cover_image: '/videos/hero-bg-poster.jpg',
    meta_title: 'Choosing a Custom Software Partner',
    meta_description: 'How to evaluate a custom software partner and what red flags to watch for.',
    published: true,
    published_at: '2026-07-28T00:00:00.000Z',
    created_at: '2026-07-28T00:00:00.000Z',
  },
];

export const mockJobs: JobPosting[] = [
  {
    id: 1,
    title: 'Senior Frontend Engineer (React)',
    slug: 'senior-frontend-engineer-react',
    department: 'Engineering',
    location: 'Remote — worldwide',
    type: 'Full-time',
    description:
      '<p>Build reusable, well-tested UI components, collaborate with design on pixel-perfect implementations, and help set frontend architecture as we scale.</p>',
    requirements:
      '<ul><li>5+ years of professional frontend experience</li><li>Deep React + TypeScript experience</li><li>Comfortable owning architecture decisions</li></ul>',
    is_active: true,
    created_at: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'Backend Engineer (Node.js)',
    slug: 'backend-engineer-nodejs',
    department: 'Engineering',
    location: 'Remote — worldwide',
    type: 'Full-time',
    description: '<p>Design and ship APIs that power client-facing products across web and mobile.</p>',
    requirements: '<ul><li>3+ years with Node.js / Express</li><li>Strong SQL fundamentals</li></ul>',
    is_active: true,
    created_at: '2026-08-05T00:00:00.000Z',
  },
  {
    id: 3,
    title: 'Product Designer',
    slug: 'product-designer',
    department: 'Design',
    location: 'Remote — worldwide',
    type: 'Contract',
    description: '<p>Own end-to-end design for client projects, from research to hi-fi prototypes.</p>',
    requirements: '<ul><li>Portfolio showing shipped product work</li><li>Figma fluency</li></ul>',
    is_active: true,
    created_at: '2026-08-12T00:00:00.000Z',
  },
];