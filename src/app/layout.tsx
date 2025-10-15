import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { ThemeProvider } from '@/components/layout/theme-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    template: '%s | Donate Life',
    default: 'Donate Life - Blood Donation',
  },
  description: 'Connecting blood donors with recipients to save lives. Find donors or request blood in your community.',
  keywords: ['blood donation', 'donate life', 'save lives', 'find blood donors', 'request blood', 'blood bank', 'community health'],
  openGraph: {
    title: 'Donate Life - Blood Donation',
    description: 'Connecting blood donors with recipients to save lives. Find donors or request blood in your community.',
    url: 'https://lifeline-demo.web.app', // Replace with your actual domain
    siteName: 'Donate Life',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1615461065624-21b562ee5566?w=1200', // A relevant OG image
        width: 1200,
        height: 630,
        alt: 'A person donating blood with a heart-shaped sticker on their arm.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Donate Life - Blood Donation',
    description: 'Connecting blood donors with recipients to save lives. Join our community to make a difference.',
    images: ['https://images.unsplash.com/photo-1615461065624-21b562ee5566?w=1200'], // A relevant Twitter card image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            {children}
          </FirebaseClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
