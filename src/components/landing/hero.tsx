'use client';
import { Droplet, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DonateBloodForm } from '../forms/donate-blood-form';
import { RequestBloodForm } from '../forms/request-blood-form';

export function Hero() {
  return (
    <section className="relative w-full bg-background">
      <div className="absolute inset-0 -z-10 h-full w-full bg-transparent dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(var(--primary-rgb),0.1),rgba(255,255,255,0))]"></div>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-4rem)] py-20 md:py-0">
          <h1 className="text-4xl font-extrabold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up [animation-delay:0.2s]">
            Give the Gift of Life,
            <span className="block text-primary">Donate Blood.</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl animate-fade-in-up [animation-delay:0.4s]">
            Your donation can save up to three lives. Join a community of heroes today. The process is simple, safe, and profoundly impactful.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up [animation-delay:0.6s]">
            <DonateBloodForm>
              <Button size="lg">
                <Droplet className="mr-2" />
                Become a Donor
              </Button>
            </DonateBloodForm>
            <RequestBloodForm>
              <Button size="lg" variant="secondary">
                <HeartHandshake className="mr-2" />
                Request Blood
              </Button>
            </RequestBloodForm>
          </div>
        </div>
      </div>
    </section>
  );
}
