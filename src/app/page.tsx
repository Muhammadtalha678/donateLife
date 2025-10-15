
'use client';

import { Header } from '@/components/layout/header';
import { Hero } from '@/components/landing/hero';
import { StatsSection } from '@/components/landing/stats-section';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Heart, Target, Users, Mail, Phone, MapPin, ClipboardPenLine, BellRing, HeartPulse } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Home() {
  const { theme } = useTheme();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const aboutImg = PlaceHolderImages.find(p => p.id === 'about-section');
  const processImg = PlaceHolderImages.find(p => p.id === 'process-section');

  // Workaround for hydration mismatch
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  
  const processSteps = [
    {
        icon: <ClipboardPenLine className="h-10 w-10 text-primary" />,
        title: 'Register',
        description: "Create your donor profile in minutes. Your information is secure and private, shared only when a potential match is found.",
    },
    {
        icon: <BellRing className="h-10 w-10 text-primary" />,
        title: 'Get Notified',
        description: 'When a hospital or a patient in your area needs your blood type, you will receive a notification with the details of the request.',
    },
    {
        icon: <HeartPulse className="h-10 w-10 text-primary" />,
        title: 'Save a Life',
        description: "Proceed to the designated donation center to make your donation. Your single act of kindness can save up to three lives.",
    },
  ];

  const aboutPoints = [
    {
        icon: <Heart className="h-6 w-6 flex-none text-primary" />,
        title: 'Save Lives',
        description: 'Our platform directly contributes to saving lives by bridging the gap between donors and patients in critical need.',
    },
    {
        icon: <Users className="h-6 w-6 flex-none text-primary" />,
        title: 'Build Community',
        description: 'We foster a community of selfless donors and volunteers, united by the common goal of helping others.',
    },
    {
        icon: <Target className="h-6 w-6 flex-none text-primary" />,
        title: 'Our Mission',
        description: 'To ensure a steady and safe blood supply for everyone in need, powered by technology and community spirit.',
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <StatsSection />
        
        <section id="process" className="py-20 sm:py-32 bg-muted/50">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">The Donation Process</h2>
                    <p className="mt-4 text-lg leading-8 text-muted-foreground">
                        Three simple steps to make a profound difference.
                    </p>
                </div>
                <div className="relative mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                    {processSteps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-8 rounded-2xl bg-card shadow-lg transition-transform hover:scale-105">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                                    {step.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold leading-7 tracking-tight text-foreground">{step.title}</h3>
                            <p className="mt-4 text-base leading-7 text-muted-foreground">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section id="about" className="py-20 sm:py-32 bg-muted/40">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-x-8 gap-y-16 lg:grid-cols-2">
              <div className="relative z-10 rounded-2xl bg-card/80 p-8 shadow-2xl backdrop-blur-lg">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">About Donate Life</h2>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                  We are dedicated to connecting blood donors with recipients, making the process of donating and receiving blood seamless and efficient. Our mission is to save lives by ensuring a steady and safe blood supply for everyone in need.
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-muted-foreground lg:max-w-none">
                  {aboutPoints.map(point => (
                    <div key={point.title} className="relative pl-9">
                      <dt className="inline font-semibold text-foreground">
                          {point.icon}
                          <span className='ml-3'>{point.title}</span>
                      </dt>
                      <dd className="inline ml-1">{point.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              {aboutImg && (
                <div className="relative overflow-hidden rounded-2xl shadow-xl lg:-ml-16">
                  <Image
                    src={aboutImg.imageUrl}
                    alt={aboutImg.description}
                    width={600}
                    height={800}
                    className="object-cover w-full h-full"
                    data-ai-hint={aboutImg.imageHint}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-background py-20 sm:py-32">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                 <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Contact Us</h2>
                    <p className="mt-2 text-lg leading-8 text-muted-foreground">
                        Have questions or need support? Our team is here to help.
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 md:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    <div className="flex flex-col items-center rounded-2xl bg-card p-8 text-center shadow-lg">
                        <MapPin className="h-8 w-8 text-primary" />
                        <h3 className="mt-6 text-lg font-semibold leading-7 tracking-tight">Our Address</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        123 Life Saver Lane<br />San Francisco, CA 94105
                        </p>
                    </div>
                     <div className="flex flex-col items-center rounded-2xl bg-card p-8 text-center shadow-lg">
                        <Phone className="h-8 w-8 text-primary" />
                        <h3 className="mt-6 text-lg font-semibold leading-7 tracking-tight">Call Us</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        <a href="tel:+15551234567" className="hover:text-primary">(555) 123-4567</a><br />Mon-Fri, 9am-5pm PST
                        </p>
                    </div>
                     <div className="flex flex-col items-center rounded-2xl bg-card p-8 text-center shadow-lg md:col-span-2 lg:col-span-1">
                        <Mail className="h-8 w-8 text-primary" />
                        <h3 className="mt-6 text-lg font-semibold leading-7 tracking-tight">Email Us</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        <a href="mailto:support@donatelife.com" className="hover:text-primary">support@donatelife.com</a><br />We'll get back to you within 24 hours.
                        </p>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <footer className="border-t border-border/50 bg-background py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
            © {currentYear} Donate Life. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
