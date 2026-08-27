import { GetStaticProps } from 'next';
import { useState, FormEvent } from 'react';
import { Seo } from '@/components/seo/Seo';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { siteConfig } from '@/lib/utils';
import { Mail, MapPin, Loader2, CheckCircle2 } from 'lucide-react';

// siteConfig doesn't carry contact details yet — hardcoded here for now.
// Consider adding `email` / `location` to siteConfig in lib/utils.ts so
// this page (and the footer, if it needs it) can share one source of truth.
const CONTACT_EMAIL = 'hello@visiongiants.com';
const CONTACT_LOCATION = 'Remote-first, worldwide';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactPage() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      await api.submitContactLead({
        name: data.get('name') as string,
        email: data.get('email') as string,
        phone: data.get('phone') as string,
        subject: data.get('subject') as string,
        message: data.get('message') as string,
      });
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
      setError('Something went wrong sending your message — try again, or email us directly.');
    }
  };

  return (
    <>
      <Seo
        title="Contact"
        description="Start a project with Vision Giants — tell us about your idea and we'll get back to you within a business day."
        path="/contact"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Contact', url: `${siteConfig.url}/contact` },
        ]}
      />

      <section className="mx-auto max-w-container px-6 py-20">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-body/50">
              Get in Touch
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-primary md:text-5xl">
              Let's build something
            </h1>
            <p className="mt-6 max-w-md text-body/70">
              Tell us a bit about your project. We read every message and typically reply
              within one business day.
            </p>

            <div className="chrome-rule my-10 max-w-xs" />

            <div className="space-y-4 text-sm">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-3 text-body/80 hover:text-primary"
              >
                <Mail size={18} /> {CONTACT_EMAIL}
              </a>
              <p className="flex items-center gap-3 text-body/80">
                <MapPin size={18} /> {CONTACT_LOCATION}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-tertiary/40 bg-surface p-8">
            {status === 'success' ? (
              <div className="flex flex-col items-center py-12 text-center">
                <CheckCircle2 size={40} className="text-primary" />
                <h2 className="mt-4 font-display text-xl font-semibold text-primary">
                  Message sent
                </h2>
                <p className="mt-2 max-w-xs text-sm text-body/70">
                  Thanks for reaching out — we'll be in touch soon.
                </p>
                <Button variant="secondary" className="mt-6" onClick={() => setStatus('idle')}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name" name="name" required />
                  <Field label="Email" name="email" type="email" required />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Phone" name="phone" type="tel" />
                  <Field label="Subject" name="subject" required />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-xs font-medium text-body/70"
                  >
                    Project details <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full resize-none rounded-lg border border-tertiary/40 bg-background px-3 py-2.5 text-sm text-body outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="What are you looking to build?"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-sm text-red-500" role="alert">
                    {error}
                  </p>
                )}

                <Button type="submit" size="lg" disabled={status === 'submitting'} className="w-full">
                  {status === 'submitting' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-xs font-medium text-body/70">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-tertiary/40 bg-background px-3 py-2.5 text-sm text-body outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: {}, revalidate: false };
};