
'use client';
import type { Donor } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Calendar, HeartHandshake } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

type DonorCardProps = {
  donor: Donor;
};

export function DonorCard({ donor }: DonorCardProps) {
    const timeAgo = formatDistanceToNow(new Date(donor.createdAt), { addSuffix: true });
    const [isContactVisible, setIsContactVisible] = useState(false);

    const toggleContact = () => {
        setIsContactVisible(!isContactVisible);
    }
  return (
    <Card className="flex flex-col transition-shadow hover:shadow-lg">
        <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">{donor.fullName}</CardTitle>
            <Badge variant="secondary" className="text-base font-bold">{donor.bloodType}</Badge>
        </CardHeader>
        <CardContent className="flex-grow space-y-3 pt-4">
            {isContactVisible ? (
                <>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="mr-2 h-4 w-4" />
                        <a href={`mailto:${donor.email}`} className="truncate hover:underline">{donor.email}</a>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="mr-2 h-4 w-4" />
                        <a href={`tel:${donor.phone}`} className="truncate hover:underline">{donor.phone}</a>
                    </div>
                </>
            ) : (
                <div className="flex items-center text-sm text-muted-foreground h-10">
                    <User className="mr-2 h-4 w-4" />
                    <span>Contact details are hidden</span>
                </div>
            )}
            <div className="flex items-center text-sm text-muted-foreground pt-2">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Registered {timeAgo}</span>
            </div>
        </CardContent>
         <CardFooter className="pt-4">
            <Button onClick={toggleContact} className="w-full">
                <HeartHandshake className="mr-2 h-4 w-4" />
                {isContactVisible ? 'Hide Details' : 'Contact Donor'}
            </Button>
        </CardFooter>
    </Card>
  );
}
