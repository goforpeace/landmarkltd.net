'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import { signInWithCustomToken } from 'firebase/auth';

const initialState = { message: '', success: false, token: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Login
    </Button>
  );
}

export default function AuthForm() {
  const [state, formAction] = useActionState(login, initialState);
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth(); // Get the auth instance

  useEffect(() => {
    // This effect runs when the server action completes
    if (state?.success && state.token && auth) {
      // 1. If the login was successful and we have a token, sign in on the client
      signInWithCustomToken(auth, state.token)
        .then(() => {
          // 2. After successful client-side sign-in, redirect to the dashboard
          toast({
            title: 'Success',
            description: 'Login successful!',
          });
          router.push('/ad-panel/dashboard');
        })
        .catch((error) => {
          console.error("Client-side sign-in failed:", error);
          toast({
            variant: 'destructive',
            title: 'Authentication Failed',
            description: 'Could not complete sign-in process.',
          });
        });
    } else if (state?.message && !state.success) {
      // If login failed on the server, show an error
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: state.message,
      });
    }
  }, [state, toast, router, auth]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pin">PIN Code</Label>
        <Input id="pin" name="pin" type="password" required maxLength={4} placeholder="Enter 4-digit PIN" />
      </div>
      <SubmitButton />
    </form>
  );
}
