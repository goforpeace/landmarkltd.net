'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { checkPin } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState = { message: '' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Access Dashboard
    </Button>
  );
}

export default function PinAuth() {
  const [state, formAction] = useFormState(checkPin, initialState);
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
      <Input
        name="pin"
        type="password"
        placeholder="Enter PIN"
        maxLength={4}
        className="text-center text-lg tracking-[0.5em]"
        required
      />
      <SubmitButton />
    </form>
  );
}
