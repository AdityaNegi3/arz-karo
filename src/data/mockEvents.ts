// src/data/mockEvents.ts

import { Event } from '../pages/EventDetailPage';

// Update the Event type to explicitly allow an array of artist names
export type MockEventItem = Omit<Event, 'artist_name'> & { 
  artist_name: string | string[]; // Now supports a single string OR an array of strings
  member_count?: number;
  genre?: string;
  is_online?: boolean;
  banner_image_url?: string;
  // NEW FIELD for map integration
  map_embed_url?: string; // Optional: Google Maps Embed URL for the venue
  // NEW FIELD for image gallery
  gallery_images?: string[]; 
  // ADDED: Optional field for the time range
  event_time_range?: string; 
};

// --- MOCK ARTISTS (For EventsPage & Artist Profiles) ---
export const MOCK_ARTISTS = [
  { name: 'Shivam', image_url: '/shivam1.jpeg' }, 
  { name: 'Niyam', image_url: '/niyam1.jpeg' }, 
 
];

// --- MOCK EVENTS (FOR EVENTS PAGE LISTING & DETAIL LOOKUP) ---
export const ALL_MOCK_EVENTS: MockEventItem[] = [
  {
    id: 'evt-9',
    title: 'Shivam Performing Live',
    artist_name: 'Shivam', // Single artist remains a string
    city: 'Gurugram',
    venue: 'The Vibe Lounge', // <--- CHANGED to a real venue name for testing announced state
    event_date: new Date("2025-12-30T00:00:00.000Z").toISOString(),
    event_time_range: '9:00 PM - 11:00 PM',
    image_url: '/shivamposter.jpeg', // Listing Poster
    banner_image_url: '/shivambanner.jpeg', // Detail Page Banner (for the ARZ style page)
    ticket_price: 999,
    member_count: 17,
    genre: 'acoustic',
    description: "Get ready for an unforgettable night as Shivam brings his soulful voice, raw emotion, and high-energy performance to the stage. One thing’s guaranteed: it’s going to be a night full of music, memories, and pure vibes.",
    includes: ["Concert Entry (General Admission)", "Exclusive Merch Discount Voucher (10%)", "Full Group Chat Access"],
    notes: ["Venue will be announced 2 weeks prior to the event date.", "A valid government-issued ID is mandatory for entry.", "Tickets are non-transferable and non-refundable."],
    contact: 'support@shivamevents.com',
    // ADDED: Using a mock URL for the map embed
    map_embed_url: `https://maps.app.goo.gl/XocrznF7i3mCtuyX8?g_st=ipc`,
    // NEW: Gallery Images for this event (Ensure these paths are valid in your public folder)
    // gallery_images: ['/image1.jpg', '/image2.jpg', '/image3.jpg', '/image4.jpg', '/image5.jpg'],
  },
  {
    id: 'evt-10',
    title: 'Post Malone Listening Party',
    artist_name: 'Niyam',
    city: 'Gurugram',
    venue: 'Venue to be announced', // <--- Back to a clear placeholder for testing unannounced state
    event_date: new Date("2025-12-06T00:00:00Z").toISOString(),
    // ADDED: Event Time Range
    event_time_range: '6:00 PM - 10:00 PM',
    image_url: '/post.jpg', // Listing Poster
    banner_image_url: '/banner.jpg', // Detail Page Banner (This is the one for the screenshot you shared)
    ticket_price: 599,
    member_count: 3,
    genre: 'rock',
description: "Post Malone fans, this one's for you, Delhi! 🎤 \
Join us for the ultimate Post Malone Listening Party — featuring a live band performing his biggest hits from *Beerbongs & Bentleys* to *Hollywood’s Bleeding* and beyond. \
\
This isn’t just another gig — it’s a night for every Delhi Posty fan to come together, sing their hearts out, and vibe like we’re at his actual concert. \
\
Expect electrifying live performances, amazing food, and drinks flowing all night. \
When the band wraps up, the party keeps going with a high-energy DJ set spinning Posty’s best tracks and hip-hop bangers. \
\
No rules. No filters. Just pure, carefree energy. \
For four unforgettable hours, we’ll all feel like rockstars. \
Let’s get loud, weird, and unapologetically us. 🤘",
    includes: ["Standing Access Ticket", "Event Poster (Digital)", "Group Chat Access"],
    notes: ["Venue details expected to be released 7 days before the show.", "No professional cameras allowed.", "Late entry will be permitted until 9:00 PM."],
    contact: 'info@arzevents.net',
    // ADDED: Using a mock URL for the map embed
    map_embed_url: `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY_HERE&q=DLF+Cyber+City`,
    gallery_images: ['/gallery1.jpeg'],
    // NOTE: gallery_images is omitted here, so the gallery section will not be visible for this event.
  },
  
  // ... (other events)
];