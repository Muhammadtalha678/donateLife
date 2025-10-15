'use client';

import { useFirestore, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, User as UserIcon, Mail, ShieldCheck, HeartHandshake } from 'lucide-react';
import { ProfileActions } from '@/components/profile/profile-actions';
import type { Donor } from '@/lib/types';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { DonorProfileDisplay } from '@/components/profile/donor-profile-display';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [donorProfile, setDonorProfile] = useState<Donor | null>(null);
  const [isDonorLoading, setIsDonorLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    const fetchDonorProfile = async () => {
      if (firestore && user) {
        setIsDonorLoading(true);
        const donorsRef = collection(firestore, 'donors');
        const q = query(donorsRef, where('userId', '==', user.uid), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const donorDoc = querySnapshot.docs[0];
          setDonorProfile({ id: donorDoc.id, ...donorDoc.data() } as Donor);
        }
        setIsDonorLoading(false);
      }
    };

    fetchDonorProfile();
  }, [user, firestore]);

  if (isUserLoading || !user || isDonorLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
            My Profile
          </h1>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="items-center text-center">
                  <Avatar className="h-24 w-24 mb-4 border-4 border-primary">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                    <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                      {user.displayName?.charAt(0).toUpperCase() ?? user.email?.charAt(0).toUpperCase() ?? <UserIcon />}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-2xl">{user.displayName || 'Anonymous User'}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </CardDescription>
                  <CardDescription className="flex items-center gap-2 pt-2">
                     {donorProfile ? (
                        <>
                            <ShieldCheck className="h-4 w-4 text-green-600" />
                            <span>Registered as: Donor</span>
                        </>
                    ) : (
                        <>
                            <HeartHandshake className="h-4 w-4 text-blue-600" />
                            <span>Registered as: Blood Recipient</span>
                        </>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileActions />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              {donorProfile ? (
                <DonorProfileDisplay donor={donorProfile} />
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">You have not registered as a donor yet.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
