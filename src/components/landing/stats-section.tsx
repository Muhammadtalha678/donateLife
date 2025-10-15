
'use client';
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { StatCard } from "./stat-card";
import { Users, HeartHandshake, Droplet } from "lucide-react";
import { useState, useEffect } from 'react';

export function StatsSection() {
    const firestore = useFirestore();
    
    const donorsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'donors'));
    }, [firestore]);

    const requestsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'requests'));
    }, [firestore]);

    const { data: donors } = useCollection(donorsQuery);
    const { data: requests } = useCollection(requestsQuery);
    
    const donorCount = donors ? donors.length : 0;
    const requestCount = requests ? requests.length : 0;
    
    return (
        <section id="stats" className="bg-muted/50 py-20">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Impact in Numbers</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Join a growing community dedicated to saving lives. Here's a look at our progress so far.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard icon={<Users className="text-primary"/>} value={new Intl.NumberFormat('en-US').format(donorCount)} label="Total Donors"/>
                    <StatCard icon={<HeartHandshake className="text-primary"/>} value={new Intl.NumberFormat('en-US').format(requestCount)} label="Active Requests"/>
                    <StatCard icon={<Droplet className="text-primary"/>} value="8" label="Blood Types Supported"/>
                </div>
            </div>
        </section>
    );
}
