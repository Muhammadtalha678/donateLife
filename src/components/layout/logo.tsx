import type { FC } from 'react';
import { Droplet } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

export const Logo: FC<LogoProps> = ({ className }) => {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 text-xl font-bold transition-colors text-foreground hover:text-foreground/80',
        className
      )}
    >
      <Droplet className="h-6 w-6 text-primary" />
      <span className="font-bold">Donate Life</span>
    </Link>
  );
};
