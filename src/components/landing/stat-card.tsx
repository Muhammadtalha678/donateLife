
'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type StatCardProps = {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    className?: string;
};

export function StatCard({ icon, value, label, className }: StatCardProps) {
    return (
        <div>
            <Card className={cn('bg-background/80 border-0 shadow-lg hover:shadow-xl transition-shadow', className)}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="rounded-full bg-primary/10 p-3">
                        {icon}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">
                       {value}
                    </div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                </CardContent>
            </Card>
        </div>
    )
}
