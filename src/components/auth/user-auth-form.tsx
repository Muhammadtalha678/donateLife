
'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  type User,
} from 'firebase/auth';
import { useAuth, useFirestore, useMemoFirebase } from '@/firebase';
import { useState, useEffect } from 'react';
import { useRoleStore } from '@/store/role-store';

export enum AuthMode {
  SignIn = 'signIn',
  SignUp = 'signUp',
}

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
}

const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const signUpSchema = z
  .object({
    fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

export function UserAuthForm({ className, mode, setMode, ...props }: UserAuthFormProps) {
  const isSignUp = mode === AuthMode.SignUp;
  const formSchema = isSignUp ? signUpSchema : signInSchema;
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(isSignUp && { fullName: '', confirmPassword: '' }),
    },
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const { role, setRole, setJustSignedUp } = useRoleStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'donor' || roleParam === 'receiver') {
      setRole(roleParam as 'donor' | 'receiver');
      // Default to sign up if a role is specified in the URL
      setMode(AuthMode.SignUp);
    } else {
      setRole(null);
    }
  }, [searchParams, setRole, setMode]);

  const handlePostLogin = async (isNewUser: boolean) => {
    if (isNewUser && role === 'donor') {
      setJustSignedUp(true);
    }
    router.push('/profile');
  };

  const handleSignIn = async (data: z.infer<typeof signInSchema>) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: 'Signed In',
        description: 'You have been successfully signed in.',
      });
      await handlePostLogin(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: error.code === 'auth/invalid-credential' 
          ? 'Incorrect email or password.'
          : 'An unexpected error occurred. Please try again.',
      });
    }
  };

  const handleSignUp = async (data: z.infer<typeof signUpSchema>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(userCredential.user, {
        displayName: data.fullName,
      });
      toast({
        title: 'Account Created',
        description: 'Your account has been created and you are now signed in.',
      });
      await handlePostLogin(true);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.code === 'auth/email-already-in-use'
          ? 'An account with this email already exists.'
          : 'Could not create your account. Please try again.',
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    if (isSignUp) {
      await handleSignUp(data as z.infer<typeof signUpSchema>);
    } else {
      await handleSignIn(data as z.infer<typeof signInSchema>);
    }
    setIsLoading(false);
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          {isSignUp && (
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                type="text"
                autoCapitalize="words"
                autoCorrect="off"
                disabled={isLoading}
                {...register('fullName')}
              />
              {(errors as any)?.fullName && (
                <p className="px-1 text-xs text-destructive">
                  {(errors as any).fullName.message}
                </p>
              )}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register('email')}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-2 relative">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              disabled={isLoading}
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors?.password && (
              <p className="px-1 text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          {isSignUp && (
            <div className="grid gap-2 relative">
               <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                placeholder="••••••••"
                type={showConfirmPassword ? 'text' : 'password'}
                disabled={isLoading}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-muted-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {(errors as any)?.confirmPassword && (
                <p className="px-1 text-xs text-destructive">
                  {(errors as any).confirmPassword.message}
                </p>
              )}
            </div>
          )}
          <button className={cn(buttonVariants(), "w-full")} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </div>
      </form>
    </div>
  );
}
