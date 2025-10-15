
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HeartHandshake, Droplet, Menu } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/layout/logo';
import { DonateBloodForm } from '../forms/donate-blood-form';
import { RequestBloodForm } from '../forms/request-blood-form';
import { useUser } from '@/firebase';
import { UserNav } from './user-nav';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from './theme-toggle';

const publicNavLinks = [
    { href: '/#process', label: 'How It Works' },
    { href: '/#about', label: 'About' },
    { href: '/#contact', label: 'Contact' },
];

const privateNavLinks = [
    { href: '/dashboard', label: 'Dashboard' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
        e.preventDefault();
        const targetId = href.substring(2);
        
        if (window.location.pathname === '/') {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            router.push('/#' + targetId);
        }
    }
    setIsMobileMenuOpen(false);
  }

  const mainNav = (
    <nav className="hidden items-center gap-6 lg:flex">
      {publicNavLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          onClick={(e) => handleScrollTo(e, link.href)}
          className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
        >
          {link.label}
        </Link>
      ))}
      {user && privateNavLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          onClick={(e) => handleScrollTo(e, link.href)}
          className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );

  const authButtons = (
    <div className="hidden items-center gap-2 lg:flex">
        {!isUserLoading && (
          user ? (
            <>
              <RequestBloodForm>
                  <Button variant="secondary">
                      <HeartHandshake className="mr-2" />
                      Request Blood
                  </Button>
              </RequestBloodForm>
              <DonateBloodForm>
                  <Button>
                      <Droplet className="mr-2" />
                      Donate Blood
                  </Button>
              </DonateBloodForm>
              <UserNav />
            </>
          ) : (
            <>
              <ThemeToggle />
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>Sign Up</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/login?role=donor">As a Donor</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/login?role=receiver">As a Receiver</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )
        )}
    </div>
  );

  const mobileMenu = (
    <div className="flex items-center gap-2 lg:hidden">
      <ThemeToggle />
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
              <Logo />
            </div>
            <nav className="flex flex-col gap-4">
              {publicNavLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              {user && privateNavLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-4">
              {!isUserLoading && (
                user ? (
                  <>
                    <UserNav />
                    <RequestBloodForm>
                        <Button variant="secondary" className="w-full justify-center">
                            <HeartHandshake className="mr-2" />
                            Request Blood
                        </Button>
                    </RequestBloodForm>
                    <DonateBloodForm>
                        <Button className="w-full justify-center">
                            <Droplet className="mr-2" />
                            Donate Blood
                        </Button>
                    </DonateBloodForm>
                  </>
                ) : (
                   <>
                    <Button variant="outline" asChild>
                      <Link href="/login" className="w-full justify-center">Login</Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="w-full justify-center">Sign Up</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem asChild>
                          <Link href="/login?role=donor">As a Donor</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link href="/login?role=receiver">As a Receiver</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-colors',
        isScrolled ? 'border-border bg-background/80 backdrop-blur-sm' : 'border-transparent bg-background'
      )}
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
            <Logo />
            {mainNav}
        </div>
        <div className="flex items-center gap-2">
            {authButtons}
            {mobileMenu}
        </div>
      </div>
    </header>
  );
}
