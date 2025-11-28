'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
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

export default function AuthForm({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [state, formAction] = useActionState(login, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // This effect handles the result of the server action.
    if (state?.success) {
      toast({
        title: 'Success',
        description: state.message || 'Login successful!',
      });
      // The server confirmed the PIN is correct.
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


  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pin">PIN Code</Label>
        <Input id="pin" name="pin" type="password" required maxLength={4} placeholder="Enter 4-digit PIN" />
      </div>
      <SubmitButton />
    </form>
  );
}
