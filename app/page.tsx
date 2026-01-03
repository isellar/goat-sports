import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">GOAT Sports</h1>
        <p className="text-lg text-muted-foreground">
          Next-generation fantasy sports platform
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/players">Browse Players</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

