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

const initialState = { message: '', success: false };

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

  useEffect(() => {
    if (state?.success) {
      // Redirect to dashboard on successful login from server action.
      // The dashboard page will handle the session sign-in.
      router.push('/ad-panel/dashboard');
    } else if (state?.message && !state.success) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: state.message,
      });
    }
  }, [state, toast, router]);

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
