import type { Player } from '@/lib/db/schema';

/**
 * Calculate player age from date of birth
 */
export function calculateAge(dateOfBirth: Date | string | null | undefined): number | null {
  if (!dateOfBirth) return null;
  
  const birthDate = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  if (isNaN(birthDate.getTime())) return null;
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Check if a date is in the next slate (today or tomorrow)
 */
export function isInNextSlate(gameDate: Date | string | null | undefined): boolean {
  if (!gameDate) return false;
  
  const date = typeof gameDate === 'string' ? new Date(gameDate) : gameDate;
  if (isNaN(date.getTime())) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const gameDateOnly = new Date(date);
  gameDateOnly.setHours(0, 0, 0, 0);
  
  return gameDateOnly.getTime() === today.getTime() || gameDateOnly.getTime() === tomorrow.getTime();
}

/**
 * Format game date/time for display
 */
export function formatGameDateTime(gameDate: Date | string | null | undefined): string {
  if (!gameDate) return '-';
  
  const date = typeof gameDate === 'string' ? new Date(gameDate) : gameDate;
  if (isNaN(date.getTime())) return '-';
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const gameDateOnly = new Date(date);
  gameDateOnly.setHours(0, 0, 0, 0);
  const todayOnly = new Date(today);
  todayOnly.setHours(0, 0, 0, 0);
  const tomorrowOnly = new Date(tomorrow);
  tomorrowOnly.setHours(0, 0, 0, 0);
  
  // Check if it's today or tomorrow
  if (gameDateOnly.getTime() === todayOnly.getTime()) {
    return `Today ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  }
  if (gameDateOnly.getTime() === tomorrowOnly.getTime()) {
    return `Tomorrow ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  }
  
  // Otherwise show date and time
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true 
  });
}

