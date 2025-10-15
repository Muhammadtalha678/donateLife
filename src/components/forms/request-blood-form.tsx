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
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { BloodRequest } from '@/lib/types';
import { countries } from '@/lib/countries';
import { useRouter } from 'next/navigation';
import { Separator } from '../ui/separator';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const urgencyLevels = ['Critical', 'High', 'Medium', 'Low'];

const formSchema = z.object({
  patientName: z.string().min(2, { message: 'Patient name must be at least 2 characters.' }),
  hospitalName: z.string().min(2, { message: 'Hospital name is required.' }),
  requiredBloodType: z.string().min(1, { message: 'Please select a blood type.' }),
  urgency: z.string().min(1, { message: 'Please select an urgency level.' }),
  contactPerson: z.string().min(2, { message: 'Contact person name is required.' }),
  countryCode: z.string().min(1, { message: 'Please select a country code.' }),
  contactPhone: z.string().min(7, { message: 'Phone number must be at least 7 digits.' }),
  additionalInfo: z.string().optional(),
});

type RequestBloodFormProps = {
    children: ReactNode;
}

const countryCodeToEmoji = (code: string) => {
    if (!code) return '';
    const codePoints = code
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

export function RequestBloodForm({ children }: RequestBloodFormProps) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: '',
      hospitalName: '',
      contactPerson: '',
      countryCode: '+92',
      contactPhone: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to request blood.",
        });
        return;
    }
    setIsSubmitting(true);

    const requestsCollection = collection(firestore, 'requests');

    const requestData: Omit<BloodRequest, 'id'> = {
        ...values,
        userId: user.uid,
        contactPhone: `${values.countryCode}${values.contactPhone}`,
        createdAt: new Date().toISOString(),
    };

    if (requestData.additionalInfo === undefined || requestData.additionalInfo === '') {
      delete requestData.additionalInfo;
    }

    try {
        await addDocumentNonBlocking(requestsCollection, requestData);

        toast({
            title: "Request Submitted",
            description: "Your blood request has been submitted. We will contact you if a match is found.",
        });
        form.reset();
        setOpen(false);
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Submission Failed',
            description: 'There was an error submitting your request. Please try again.'
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleTriggerClick = () => {
    if (!user) {
      router.push('/login?role=receiver');
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Emergency Blood Request</DialogTitle>
          <DialogDescription>
            Please provide the following details to request blood for a patient.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] w-full pr-6">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full py-4">
                
                <div className='space-y-4'>
                    <h3 className="text-lg font-medium text-foreground">Patient & Hospital Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="patientName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Patient Full Name</FormLabel>
                            <FormControl>
                            <Input placeholder="Jane Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="hospitalName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hospital Name</FormLabel>
                            <FormControl>
                            <Input placeholder="City General Hospital" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="requiredBloodType"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Required Blood Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select blood type" />
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
                    <FormField
                        control={form.control}
                        name="urgency"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Urgency Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select urgency" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {urgencyLevels.map(level => (
                                <SelectItem key={level} value={level}>
                                    {level}
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

                <div className='space-y-4'>
                    <h3 className="text-lg font-medium text-foreground">Contact Information</h3>
                    <FormField
                        control={form.control}
                        name="contactPerson"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Contact Person</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
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
                                name="contactPhone"
                                render={({ field }) => (
                                    <FormControl>
                                        <Input placeholder="123-456-7890" {...field} className="flex-1" />
                                    </FormControl>
                                )}
                            />
                        </div>
                        <FormMessage>
                            {form.formState.errors.contactPhone?.message}
                        </FormMessage>
                    </FormItem>
                </div>
                
                <Separator />
                
                <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Additional Information (Optional)</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Any other relevant details (e.g., patient condition, specific instructions)."
                        {...field}
                        />
                    </FormControl>
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
                                Submit Request
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

    