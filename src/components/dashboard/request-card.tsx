
import type { BloodRequest } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hospital, User, Phone, AlertTriangle, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type RequestCardProps = {
  request: BloodRequest;
};

const urgencyVariant: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
    'Low': 'secondary',
    'Medium': 'default',
    'High': 'default',
    'Critical': 'destructive'
}

export function RequestCard({ request }: RequestCardProps) {
    const timeAgo = formatDistanceToNow(new Date(request.createdAt), { addSuffix: true });
  return (
    <Card className="flex flex-col">
        <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
                <div>
                    <CardTitle className="text-lg font-semibold">{request.patientName}</CardTitle>
                    <CardDescription className="flex items-center pt-1">
                        <Hospital className="mr-2 h-4 w-4"/>
                        {request.hospitalName}
                    </CardDescription>
                </div>
                <Badge variant="outline" className="border-2 text-lg font-bold">{request.requiredBloodType}</Badge>
            </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
            <div className="flex items-center text-sm">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Contact: {request.contactPerson}</span>
            </div>
            <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <a href={`tel:${request.contactPhone}`} className="hover:underline">{request.contactPhone}</a>
            </div>
            {request.additionalInfo && <p className="pt-2 text-sm text-muted-foreground">{request.additionalInfo}</p>}
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-4">
            <Badge variant={urgencyVariant[request.urgency] || 'secondary'} className="capitalize">
                <AlertTriangle className="mr-1 h-3 w-3" />
                {request.urgency}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="mr-1.5 h-3 w-3" />
                <span>{timeAgo}</span>
            </div>
        </CardFooter>
    </Card>
  );
}
