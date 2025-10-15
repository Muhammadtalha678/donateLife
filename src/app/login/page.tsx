
'use client';

import { useState, Suspense } from 'react';
import { UserAuthForm, AuthMode } from "@/components/auth/user-auth-form";
import { Logo } from "@/components/layout/logo";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

function LoginForm() {
  const [mode, setMode] = useState<AuthMode>(AuthMode.SignIn);

  const toggleMode = () => {
    setMode(mode === AuthMode.SignIn ? AuthMode.SignUp : AuthMode.SignIn);
  };
  
  return (
     <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex items-center justify-center">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === AuthMode.SignIn ? "Sign In to Donate Life" : "Create an Account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === AuthMode.SignIn
              ? "Enter your credentials to access your account"
              : "Enter your email and password to get started"}
          </p>
        </div>
        
        <UserAuthForm mode={mode} setMode={setMode}/>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
            <Button variant="link" onClick={toggleMode} className="w-full text-muted-foreground">
              {mode === AuthMode.SignIn
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </Button>
        </div>


        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
  )
}

export default function LoginPage() {
  return (
    <div className="container relative flex h-screen flex-col items-center justify-center">
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
