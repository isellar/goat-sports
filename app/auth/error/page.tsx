import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold text-destructive">Authentication Error</h1>
          <p className="text-muted-foreground mt-4">
            Something went wrong during authentication. This could be due to:
          </p>
          <ul className="text-muted-foreground mt-4 space-y-2 text-left list-disc list-inside">
            <li>Invalid or expired authentication link</li>
            <li>Browser cookies are disabled</li>
            <li>Network connection issues</li>
          </ul>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/auth/login">Try logging in again</Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href="/">Go to homepage</Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}
