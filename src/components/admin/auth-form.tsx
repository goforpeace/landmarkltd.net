'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';

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

export default function AuthForm({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [state, formAction] = useActionState(login, initialState);
  const { toast } = useToast();
  const auth = useAuth(); 

  useEffect(() => {
    if (state?.success && auth) {
      // The server action succeeded. Now, ensure the user is signed in on the client.
      // We'll use anonymous sign-in as a simple way to get an authenticated session.
      signInAnonymously(auth)
        .then(() => {
          toast({
            title: 'Success',
            description: 'Login successful!',
          });
          onLoginSuccess();
        })
        .catch((error) => {
          console.error("Client-side anonymous sign-in failed:", error);
          toast({
            variant: 'destructive',
            title: 'Authentication Failed',
            description: 'Could not complete client-side sign-in.',
          });
        });
    } else if (state?.message && !state.success) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: state.message,
      });
    }
  }, [state, toast, auth, onLoginSuccess]);

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
