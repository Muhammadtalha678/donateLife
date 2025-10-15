'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState, type ReactNode, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { ScrollArea } from '../ui/scroll-area';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Donor } from '@/lib/types';
import { countries } from '@/lib/countries';
import { useRouter } from 'next/navigation';
import { Separator } from '../ui/separator';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  countryCode: z.string().min(1, { message: 'Please select a country code.' }),
  phone: z.string().min(7, { message: 'Phone number must be at least 7 digits.' }),
  bloodType: z.string().min(1, { message: 'Please select a blood type.' }),
  dob: z.date({ required_error: 'Date of birth is required.' }),
  lastDonation: z.date().optional(),
  eligibilityAge: z.string().refine(value => value === 'yes', { message: 'You must be between 18 and 65 years old to donate.' }),
  eligibilityWeight: z.string().refine(value => value === 'yes', { message: 'You must weigh over 50kg (110 lbs) to donate.' }),
  eligibilityTattoo: z.string().refine(value => value === 'no', { message: 'You must not have had a tattoo, piercing, or acupuncture in the last 3 months.' }),
  eligibilityHealth: z.string().refine(value => value === 'yes', { message: 'You must be in good health to donate.' }),
});

type DonateBloodFormProps = {
    children: ReactNode;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const countryCodeToEmoji = (code: string) => {
    if (!code) return '';
    const codePoints = code
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

export function DonateBloodForm({ children, isOpen, onOpenChange }: DonateBloodFormProps) {
    const { toast } = useToast();
    const [internalOpen, setInternalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    const open = isOpen ?? internalOpen;
    const setOpen = onOpenChange ?? setInternalOpen;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: user?.displayName ?? '',
            email: user?.email ?? '',
            countryCode: '+92',
            phone: '',
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                fullName: user.displayName ?? '',
                email: user.email ?? '',
                countryCode: '+92',
                phone: '',
            });
        }
    }, [user, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user || !firestore) {
            toast({
                variant: "destructive",
                title: "Authentication Error",
                description: "You must be logged in to register as a donor.",
            });
            return;
        }
        setIsSubmitting(true);

        const donorsCollection = collection(firestore, 'donors');

        const donorData: Omit<Donor, 'id'> = {
            ...values,
            userId: user.uid,
            phone: `${values.countryCode}${values.phone}`,
            dob: values.dob.toISOString(),
            lastDonation: values.lastDonation?.toISOString(),
            createdAt: new Date().toISOString(),
        };

        if (donorData.lastDonation === undefined) {
            delete donorData.lastDonation;
        }

        try {
            await addDocumentNonBlocking(donorsCollection, donorData);

            toast({
                title: "Registration Successful!",
                description: "Thank you for registering as a blood donor. You are a lifesaver!",
            });
            form.reset();
            setOpen(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: 'There was an error submitting your registration. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleTriggerClick = () => {
        if (!user) {
            router.push('/login?role=donor');
        } else {
            setOpen(true);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div onClick={handleTriggerClick}>
                    {children}
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Blood Donor Registration</DialogTitle>
                    <DialogDescription>
                        Thank you for your interest in saving lives. Please fill out the form below.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] w-full pr-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full py-4">
                            
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-foreground">Personal Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="john.doe@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name="dob"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Date of Birth</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={'outline'}
                                                                className={cn(
                                                                    'w-full justify-start text-left font-normal',
                                                                    !field.value && 'text-muted-foreground'
                                                                )}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date > new Date() || date < new Date('1900-01-01')
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="bloodType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Blood Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select your blood type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {bloodTypes.map(type => (
                                                            <SelectItem key={type} value={type}>
                                                                {type}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-foreground">Contact Information</h3>
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <FormField
                                            control={form.control}
                                            name="countryCode"
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full sm:w-40">
                                                            <SelectValue placeholder="Code" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <ScrollArea className="h-72">
                                                            {countries.map(country => (
                                                                <SelectItem key={country.code} value={country.dial_code}>
                                                                    <span className="mr-2">{countryCodeToEmoji(country.code)}</span>
                                                                    {country.dial_code} ({country.code})
                                                                </SelectItem>
                                                            ))}
                                                        </ScrollArea>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormControl>
                                                    <Input placeholder="123-456-7890" {...field} className="flex-1"/>
                                                </FormControl>
                                            )}
                                        />
                                    </div>
                                    <FormMessage>
                                        {form.formState.errors.phone?.message}
                                    </FormMessage>
                                </FormItem>
                            </div>
                            
                            <Separator />

                            <div className="space-y-6 rounded-md border p-4 shadow-sm">
                                <h3 className="text-lg font-medium text-foreground">Eligibility Checklist</h3>

                                <FormField
                                    control={form.control}
                                    name="eligibilityAge"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Are you between 18 and 65 years old?</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="yes" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Yes</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="no" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">No</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="eligibilityWeight"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Do you weigh over 50kg (110 lbs)?</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="yes" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Yes</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="no" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">No</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="eligibilityTattoo"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Have you had a tattoo, piercing, or acupuncture in the last 3 months?</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="yes" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Yes</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="no" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">No</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="eligibilityHealth"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Are you feeling well and in good health today?</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="yes" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Yes</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="no" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">No</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="lastDonation"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Last Donation Date (Optional)</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={'outline'}
                                                        className={cn(
                                                            'w-full justify-start text-left font-normal',
                                                            !field.value && 'text-muted-foreground'
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => date > new Date()}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <DialogFooter className="sticky bottom-0 bg-background pt-4">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            Submit Registration
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

    