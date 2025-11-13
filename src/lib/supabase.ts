// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  const msg = `Missing Supabase env vars:
  - VITE_SUPABASE_URL: ${supabaseUrl ? '✓' : '✗'}
  - VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✓' : '✗'}`;
  console.error('[Supabase Init]', msg);
  throw new Error(msg);
}

console.debug('[Supabase Init] Creating client with URL:', supabaseUrl);
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
console.debug('[Supabase Init] Client created successfully');

export type Profile = {
  id: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  email?: string | null;
  updated_at?: string | null;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  artist_name: string;
  city: string;
  venue: string;
  event_date: string;
  ticket_price: number;
  image_url: string | null;
  video_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type Ticket = {
  id: string;
  event_id: string;
  user_id: string;
  purchased_at: string;
  ticket_number: string;
};

export type ChatMessage = {
  id: string;
  event_id: string;
  user_id: string;
  message: string;
  created_at: string;
  profiles?: Profile;
};
