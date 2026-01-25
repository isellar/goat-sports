import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import type { User } from '@supabase/supabase-js';

/**
 * Create a Supabase client for server-side operations that reads from cookies
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle cookie setting errors (e.g., in middleware)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Handle cookie removal errors
          }
        },
      },
    }
  );
}

/**
 * Get the current authenticated user from the session
 * Returns null if not authenticated
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createServerSupabaseClient();

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  const supabase = await createServerSupabaseClient();

  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Require authentication - returns user or null if not authenticated
 * Use this in API routes to check auth status
 */
export async function requireAuth(request?: NextRequest): Promise<User | null> {
  const user = await getUser();
  return user;
}

/**
 * Check if the current user is the commissioner of a league
 */
export async function isLeagueCommissioner(userId: string, commissionerId: string): Promise<boolean> {
  return userId === commissionerId;
}
