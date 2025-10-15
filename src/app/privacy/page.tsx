
'use client';

import { Header } from '@/components/layout/header';
import { useEffect, useState } from 'react';

export default function PrivacyPage() {
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
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
                        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                        <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
                        
                        <h2>1. Information We Collect</h2>
                        <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
                        <h3>Personal Data</h3>
                        <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>
                        <ul>
                            <li>Email address</li>
                            <li>Full name</li>
                            <li>Phone number</li>
                            <li>Date of Birth and Blood Type (for donors)</li>
                        </ul>

                        <h2>2. Use of Your Personal Data</h2>
                        <p>The Company may use Personal Data for the following purposes:</p>
                        <ul>
                            <li><strong>To provide and maintain our Service</strong>, including to monitor the usage of our Service.</li>
                            <li><strong>To manage Your Account:</strong> to manage Your registration as a user of the Service.</li>
                            <li><strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication.</li>
                            <li><strong>To connect donors and recipients:</strong> The core purpose of our platform is to facilitate connections for blood donations.</li>
                        </ul>

                        <h2>3. Security of Your Data</h2>
                        <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
                        
                        <h2>4. Sharing Your Information</h2>
                        <p>We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.</p>

                        <h2>5. Children's Privacy</h2>
                        <p>Our Service does not address anyone under the age of 18. We do not knowingly collect personally identifiable information from anyone under the age of 18. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us.</p>

                        <h2>6. Changes to This Privacy Policy</h2>
                        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

                        <h2>7. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, you can contact us at support@donatelife.com.</p>
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
