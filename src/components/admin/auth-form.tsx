'use client';

import { useActionState, useFormStatus } from 'react-dom';
import { login } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState = { message: '' };

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

    useEffect(() => {
        if(state?.message) {
            toast({
                variant: 'destructive',
                title: 'Authentication Failed',
                description: state.message,
            })
        }
    }, [state, toast])

  return (
    <form action={formAction} className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="pin">PIN Code</Label>
            <Input id="pin" name="pin" type="password" required maxLength={4} pattern="\d{4}" placeholder="Enter 4-digit PIN" />
        </div>
      <SubmitButton />
    </form>
  );
}
