'use client';

import type { Donor } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, Mail, Phone, Droplet, User, MapPin } from 'lucide-react';
import { format } from 'date-fns';

type DonorProfileDisplayProps = {
  donor: Donor;
};

export function DonorProfileDisplay({ donor }: DonorProfileDisplayProps) {
    const formattedDob = format(new Date(donor.dob), 'MMMM d, yyyy');
    const lastDonationDate = donor.lastDonation ? format(new Date(donor.lastDonation), 'MMMM d, yyyy') : 'Not yet recorded';
    const registrationDate = format(new Date(donor.createdAt), 'MMMM d, yyyy');

  return (
    <Card className="shadow-lg h-full">
        <CardHeader>
            <CardTitle className="text-2xl font-bold">My Donor Information</CardTitle>
            <CardDescription>Your registered donor details. Registered on {registrationDate}.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="flex items-center">
                    <User className="mr-3 h-5 w-5 text-muted-foreground"/>
                    <span className="text-foreground">{donor.fullName}</span>
                </div>
                 <div className="flex items-center">
                    <Phone className="mr-3 h-5 w-5 text-muted-foreground"/>
                    <span className="text-foreground">{donor.phone}</span>
                </div>
                <div className="flex items-center">
                    <Droplet className="mr-3 h-5 w-5 text-muted-foreground"/>
                    <span className="text-foreground">Blood Type: <strong>{donor.bloodType}</strong></span>
                </div>
                <div className="flex items-center">
                    <Calendar className="mr-3 h-5 w-5 text-muted-foreground"/>
                    <span className="text-foreground">Born on {formattedDob}</span>
                </div>
                <div className="flex items-center">
                    <Calendar className="mr-3 h-5 w-5 text-muted-foreground"/>
                    <span className="text-foreground">Last Donation: {lastDonationDate}</span>
                </div>
            </div>
             <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
                <h4 className="font-semibold text-foreground">Eligibility Checklist</h4>
                 <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="mr-2 h-4 w-4"/>
                    <span>Age requirement met</span>
                </div>
                 <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="mr-2 h-4 w-4"/>
                    <span>Weight requirement met</span>
                </div>
                 <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="mr-2 h-4 w-4"/>
                    <span>No recent tattoos/piercings</span>
                </div>
                <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="mr-2 h-4 w-4"/>
                    <span>In good health</span>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
