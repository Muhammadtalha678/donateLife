
'use client';

import { Header } from '@/components/layout/header';
import { useEffect, useState } from 'react';

export default function TermsPage() {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // Workaround for hydration mismatch
    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 py-12 md:py-20">
                <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="prose dark:prose-invert lg:prose-xl mx-auto">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">Terms of Service</h1>
                        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        
                        <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Donate Life website (the "Service") operated by us.</p>
                        
                        <h2>1. Introduction</h2>
                        <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.</p>
                        <p>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>

                        <h2>2. Accounts</h2>
                        <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
                        <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>

                        <h2>3. User Conduct</h2>
                        <p>You agree not to use the Service to:</p>
                        <ul>
                            <li>Post or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.</li>
                            <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
                            <li>Post or transmit any unsolicited or unauthorized advertising, promotional materials, "junk mail," "spam," or any other form of solicitation.</li>
                        </ul>

                        <h2>4. Disclaimers</h2>
                        <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.</p>
                        <p>We do not warrant that a) the Service will function uninterrupted, secure, or available at any particular time or location; b) any errors or defects will be corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the Service will meet your requirements.</p>

                        <h2>5. Limitation of Liability</h2>
                        <p>In no event shall our team, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

                        <h2>6. Changes</h2>
                        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
                        
                        <h2>7. Contact Us</h2>
                        <p>If you have any questions about these Terms, please contact us at support@donatelife.com.</p>
                    </div>
                </div>
            </main>
            <footer className="border-t border-border/50 bg-background py-6">
                <div className="container mx-auto text-center text-sm text-muted-foreground">
                    © {currentYear} Donate Life. All Rights Reserved.
                </div>
            </footer>
        </div>
    );
}
