import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={`/services/${service.slug}`} className="group block">
      <Card className="h-full">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-primary">
            {service.title}
          </h3>
          <ArrowRight
            size={18}
            className="shrink-0 text-primary opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
          />
        </div>
        <p className="mt-3 text-sm text-body/70">{service.summary}</p>
      </Card>
    </Link>
  );
}
