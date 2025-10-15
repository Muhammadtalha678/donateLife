
'use client';

import { useFirestore, useCollection, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import type { Donor, BloodRequest } from '@/lib/types';
import { Header } from '@/components/layout/header';
import { DonorCard } from '@/components/dashboard/donor-card';
import { MyDonorProfileCard } from '@/components/dashboard/my-donor-profile-card';
import { RequestCard } from '@/components/dashboard/request-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useRoleStore } from '@/store/role-store';
import { DonateBloodForm } from '@/components/forms/donate-blood-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DashboardPage() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const { donorFormOpen, setDonorFormOpen, role, justSignedUp, setJustSignedUp, setRole } = useRoleStore();
    const [isDonor, setIsDonor] = useState<boolean | null>(null);
    const [userDonorProfile, setUserDonorProfile] = useState<Donor | null>(null);
    const [displayName, setDisplayName] = useState<string>('');

    // Filters state
    const [requestSearch, setRequestSearch] = useState('');
    const [requestBloodType, setRequestBloodType] = useState('');
    const [donorSearch, setDonorSearch] = useState('');
    const [donorBloodType, setDonorBloodType] = useState('');


    const donorsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'donors'));
    }, [firestore]);

    const requestsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'requests'));
    }, [firestore]);

    const { data: donorsData, isLoading: donorsLoading } = useCollection<Donor>(donorsQuery);
    const { data: requestsData, isLoading: requestsLoading } = useCollection<BloodRequest>(requestsQuery);

    const filteredRequests = useMemo(() => {
        return requestsData?.filter(request => {
            const nameMatch = request.patientName.toLowerCase().includes(requestSearch.toLowerCase());
            const bloodTypeMatch = requestBloodType ? request.requiredBloodType === requestBloodType : true;
            return nameMatch && bloodTypeMatch;
        }) ?? [];
    }, [requestsData, requestSearch, requestBloodType]);

    const filteredDonors = useMemo(() => {
        return donorsData?.filter(donor => {
            const nameMatch = donor.fullName.toLowerCase().includes(donorSearch.toLowerCase());
            const bloodTypeMatch = donorBloodType ? donor.bloodType === donorBloodType : true;
            return nameMatch && bloodTypeMatch;
        }) ?? [];
    }, [donorsData, donorSearch, donorBloodType]);

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
        } else if (user) {
            user.reload().then(() => {
                setDisplayName(user.displayName || user.email || 'User');
            });
        }
    }, [user, isUserLoading, router]);
    
    useEffect(() => {
        const checkUserRole = async () => {
             if (firestore && user) {
                const donorsRef = collection(firestore, 'donors');
                const q = query(donorsRef, where('userId', '==', user.uid), limit(1));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    setIsDonor(true);
                    const donorDoc = querySnapshot.docs[0];
                    setUserDonorProfile({ id: donorDoc.id, ...donorDoc.data() } as Donor);
                } else {
                    setIsDonor(false);
                    setUserDonorProfile(null);
                }
            }
        };
        checkUserRole();
    },[user, firestore, donorsData])

    useEffect(() => {
        const checkDonorProfile = async () => {
            if (firestore && user && role === 'donor' && justSignedUp) {
                const donorsRef = collection(firestore, 'donors');
                const q = query(donorsRef, where('userId', '==', user.uid));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setDonorFormOpen(true);
                }
                setJustSignedUp(false);
                setRole(null);
            }
        };

        if (!isUserLoading && !userDonorProfile) {
            checkDonorProfile();
        }
    }, [user, firestore, isUserLoading, role, justSignedUp, setDonorFormOpen, setJustSignedUp, setRole, userDonorProfile]);

    if (isUserLoading || !user || isDonor === null || !displayName) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="flex min-h-screen flex-col bg-muted/40">
            <DonateBloodForm isOpen={donorFormOpen} onOpenChange={setDonorFormOpen}>
                <></>
            </DonateBloodForm>
            <Header />
            <main className="flex-1 py-12">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome, {displayName}!</h1>
                        <p className="text-muted-foreground">
                           Thank you for being part of our lifesaving community.
                        </p>
                    </div>

                    {isDonor && userDonorProfile && (
                         <section id="my-profile" className="mb-12">
                            <MyDonorProfileCard donor={userDonorProfile} />
                        </section>
                    )}
                    
                    <Tabs defaultValue="requests" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="requests">Urgent Requests</TabsTrigger>
                            <TabsTrigger value="donors">Available Donors</TabsTrigger>
                        </TabsList>
                        <TabsContent value="requests">
                            <div className="mt-8">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Urgent Blood Requests</h2>
                                    <div className="flex flex-col gap-4 md:flex-row md:gap-2">
                                        <Input
                                            placeholder="Search by patient name..."
                                            value={requestSearch}
                                            onChange={(e) => setRequestSearch(e.target.value)}
                                            className="w-full md:w-64"
                                        />
                                        <Select value={requestBloodType} onValueChange={(value) => setRequestBloodType(value === 'all' ? '' : value)}>
                                            <SelectTrigger className="w-full md:w-48">
                                                <SelectValue placeholder="Filter by blood type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Blood Types</SelectItem>
                                                {bloodTypes.map(type => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {requestsLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-lg" />)}
                                    {!requestsLoading && filteredRequests.length > 0 ? (
                                        filteredRequests.map(request => <RequestCard key={request.id} request={request} />)
                                    ) : (
                                        !requestsLoading && <p className="col-span-full text-muted-foreground">No active blood requests matching your criteria.</p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="donors">
                             <div className="mt-8">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Available Donors</h2>
                                     <div className="flex flex-col gap-4 md:flex-row md:gap-2">
                                        <Input
                                            placeholder="Search by donor name..."
                                            value={donorSearch}
                                            onChange={(e) => setDonorSearch(e.target.value)}
                                            className="w-full md:w-64"
                                        />
                                        <Select value={donorBloodType} onValueChange={(value) => setDonorBloodType(value === 'all' ? '' : value)}>
                                            <SelectTrigger className="w-full md:w-48">
                                                <SelectValue placeholder="Filter by blood type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                 <SelectItem value="all">All Blood Types</SelectItem>
                                                {bloodTypes.map(type => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {donorsLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-56 w-full rounded-lg" />)}
                                    {!donorsLoading && filteredDonors.length > 0 ? (
                                        filteredDonors.map(donor => <DonorCard key={donor.id} donor={donor} />)
                                    ) : (
                                        !donorsLoading && <p className="col-span-full text-muted-foreground">No registered donors matching your criteria.</p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}

    