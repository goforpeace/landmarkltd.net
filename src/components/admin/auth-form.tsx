'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useUser } from '@/firebase';
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
  const { user, isUserLoading } = useUser();
  const formRef = useRef<HTMLFormElement>(null);

  // Effect to ensure the user has an anonymous session before trying to log in.
  useEffect(() => {
    if (!user && !isUserLoading && auth) {
      signInAnonymously(auth).catch((error) => {
        console.error("Anonymous sign-in failed on component mount:", error);
        toast({
          variant: 'destructive',
          title: 'Authentication Error',
          description: 'Could not initialize user session.',
        });
      });
    }
  }, [user, isUserLoading, auth, toast]);

  useEffect(() => {
    // This effect handles the result of the server action.
    if (state?.success) {
      toast({
        title: 'Success',
        description: state.message || 'Login successful!',
      });
      // The server has confirmed the PIN and granted the admin role.
      // We can now proceed to the dashboard.
      onLoginSuccess();
    } else if (state?.message && !state.success) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: state.message,
      });
    }
  }, [state, toast, onLoginSuccess]);

  // Wrapper action to include the UID in the form data.
  const actionWithUID = (formData: FormData) => {
    if (user?.uid) {
      formData.append('uid', user.uid);
      formAction(formData);
    } else {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'User is not authenticated. Cannot log in.',
      });
    }
  };

  return (
    <form ref={formRef} action={actionWithUID} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pin">PIN Code</Label>
        <Input id="pin" name="pin" type="password" required maxLength={4} placeholder="Enter 4-digit PIN" />
      </div>
      {/* Hidden input for UID might not be strictly necessary if we pass it in the action, but it's good practice */}
      {user?.uid && <input type="hidden" name="uid" value={user.uid} />}
      <SubmitButton />
    </form>
  );
}
