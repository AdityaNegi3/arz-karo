import React, { useEffect, useState } from 'react';
import { Search, MapPin, Users, Calendar, X, Globe } from 'lucide-react';
// Import Framer Motion
import { motion } from 'framer-motion'; 
// import { supabase } from '../lib/supabase'; // Assuming supabase and basic types are available
import { 
    MOCK_TRIPS_LISTING, 
    BasicTrip as Trip, 
    MOCK_DESTINATIONS_DATA, // Use the new data source with images
    DetailedTrip // Although not directly used for the list, important for type consistency
} from '../data/mockTrips'; 

const ACCENT_VARIABLE = '--accent';

// Define types for component props
type TripsPageProps = {
  onTripSelect: (tripId: string) => void;
  onChatOpen?: (tripId: string) => void; // app-level chat opener
  currentUserId?: string | null; 
};


// Framer Motion Variants for Staggered Grid Load
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Small delay between each card's appearance
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};


export default function TripsPage({ onTripSelect, onChatOpen, currentUserId }: TripsPageProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [loading, setLoading] = useState(true);

  // filter drawer states
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<'sort' | 'cost' | 'duration' | 'privacy' | 'more'>('sort');

  // detailed filter options
  const [sortBy, setSortBy] = useState<'popularity' | 'cost_low' | 'cost_high' | 'date_upcoming'>('date_upcoming');
  const [costRange, setCostRange] = useState<[number, number]>([0, 40000]); 
  const [durationFilter, setDurationFilter] = useState<'short' | 'long' | 'any'>('any'); 
  const [privacyFilter, setPrivacyFilter] = useState<'all' | 'public' | 'private'>('all');

  // user/joining state
  const [joinedTripIds, setJoinedTripIds] = useState<Set<string>>(new Set()); // Kept for 'Chat' button logic

  useEffect(() => {
    loadTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedDestination, trips, sortBy, costRange, durationFilter, privacyFilter]);

  const loadTrips = async () => {
    setTrips(MOCK_TRIPS_LISTING as Trip[]); 
    await loadCurrentUserAndMemberships();
    setLoading(false);
  };

  const loadCurrentUserAndMemberships = async () => {
    // Only kept for the 'Chat' button's current logic
    setJoinedTripIds(new Set(['trip-1', 'trip-3'])); 
  };

  const filterTrips = () => {
    let filtered = [...trips];

    // Search filter
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          (t.title || '').toLowerCase().includes(q) ||
          (t.destination || '').toLowerCase().includes(q)
      );
    }

    // Quick select filter: Destination
    if (selectedDestination !== 'all') filtered = filtered.filter((t) => t.destination === selectedDestination);

    // Detailed filters
    if (privacyFilter !== 'all') {
        const isPrivate = privacyFilter === 'private';
        filtered = filtered.filter(t => t.is_private === isPrivate);
    }

    filtered = filtered.filter((t) => t.estimated_cost >= costRange[0] && t.estimated_cost <= costRange[1]);

    if (durationFilter !== 'any') {
        filtered = filtered.filter(t => {
            const startDate = new Date(t.start_date).getTime();
            const endDate = new Date(t.end_date).getTime();
            const durationDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

            if (durationFilter === 'short') return durationDays < 7;
            if (durationFilter === 'long') return durationDays >= 7;
            return true;
        });
    }

    // Sort
    if (sortBy === 'popularity') {
      filtered.sort((a, b) => (b.member_count || 0) - (a.member_count || 0));
    } else if (sortBy === 'cost_low') {
      filtered.sort((a, b) => (a.estimated_cost || 0) - (b.estimated_cost || 0));
    } else if (sortBy === 'cost_high') {
      filtered.sort((a, b) => (b.estimated_cost || 0) - (a.estimated_cost || 0));
    } else if (sortBy === 'date_upcoming') {
      filtered.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    }

    setFilteredTrips(filtered);
  };

  // Get unique destinations from current trips for the quick select dropdown
  const uniqueDestinations = Array.from(new Set(trips.map((t) => t.destination))).filter(Boolean);
  const destinationList = MOCK_DESTINATIONS_DATA.filter(d => uniqueDestinations.includes(d.name));

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading trips...</div>
      </div>
    );
  }

  const visibleTrips = filteredTrips.slice(0, 8); // limiting to 8 for display

  const clearAllFilters = () => {
    setSelectedDestination('all');
    setSearchQuery('');
    setSortBy('date_upcoming');
    setCostRange([0, 40000]); // Reset to max appropriate range
    setDurationFilter('any');
    setPrivacyFilter('all');
  };

  const userHasJoined = (tripId: string) => joinedTripIds.has(tripId);

  // Function to open the chat window
  const openChat = (tripItem: Trip) => {
    const tripId = tripItem.id;
    if (!tripId) return;

    if (onChatOpen) {
      onChatOpen(tripId);
      return;
    }

    // Fallback: push state and dispatch event
    try {
      window.history.replaceState({}, '', `#chat-trip-${tripId}`);
      window.dispatchEvent(new CustomEvent('openChat', { detail: { tripId } }));
    } catch (err) {
      console.warn('Could not open chat via fallback:', err);
    }
  };

  // Helper to format dates for display
  const formatTripDates = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const startStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (startDate.getFullYear() === endDate.getFullYear() && startDate.getMonth() === endDate.getMonth() && startDate.getDate() === endDate.getDate()) {
        return startStr + ', ' + startDate.getFullYear();
    }

    return `${startStr} - ${endStr}`;
  };

  return (
    <>
      <style>{`
        :root {
          ${ACCENT_VARIABLE}: #FF785A; /* Updated to Coral/Orange */
        }
        .bg-black-85 { background-color: rgba(0,0,0,0.85); }
        .scroll-offset { scroll-margin-top: 6rem; }
      `}</style>

      {/* Removed top padding so the page starts at the top (no large gap under navbar) */}
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6"> {/* reduced vertical padding */}
          {/* Header */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="w-full flex items-end justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Explore Trips</h1>
                <p className="text-sm text-gray-500 mt-1">Find your next adventure with fellow travellers.</p> {/* Updated text */}
              </div>
            </div>

            {/* Search bar */}
            <div className="w-full">
              <div className="max-w-3xl w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search trip titles or destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick selects - MODIFIED FOR SINGLE-LINE MOBILE VIEW */}
          <div className="mb-6 flex flex-col gap-3">
            {/* Row 1: Destinations, Filters, Clear (All on one line for mobile) */}
            <div className="flex items-center gap-3 w-full"> 
                {/* Destination Dropdown */}
                <select
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    // Removed w-full on mobile so it can sit beside the other buttons
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                >
                    <option value="all">All Destinations</option>
                    {uniqueDestinations.map((destination) => (
                        <option key={destination} value={destination}>
                            {destination}
                        </option>
                    ))}
                </select>

                {/* Filters Button */}
                <button
                    onClick={() => setShowFilters(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-colors bg-white flex-shrink-0"
                    aria-label="Filters"
                >
                    <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l7 9v7l6-3v-4l7-9z" /></svg>
                    <span className="font-medium">Filters</span>
                </button>

                {/* Clear Button */}
                <button
                    onClick={() => clearAllFilters()}
                    className="px-3 py-2 text-sm border border-dashed border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 flex-shrink-0"
                    aria-label="Clear filters"
                >
                    Clear
                </button>
            </div>
            
            {/* Row 2: Popular/Upcoming Buttons (Pushed to the end/next line on mobile) */}
            <div className="flex items-center gap-3 self-end md:self-auto md:ml-auto md:flex-row">
              <button onClick={() => { setSortBy('popularity'); }} className={`px-3 py-2 rounded-lg text-sm ${sortBy === 'popularity' ? 'bg-[var(--accent)] text-white' : 'border'}`}>Popular</button>
              <button onClick={() => { setSortBy('date_upcoming'); }} className={`px-3 py-2 rounded-lg text-sm ${sortBy === 'date_upcoming' ? 'bg-[var(--accent)] text-white' : 'border'}`}>Upcoming</button>
            </div>
          </div>
          {/* END MODIFIED QUICK SELECTS */}


          {/* Destinations row */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Popular Destinations</h2>
            <div className="flex gap-6 overflow-x-auto pb-2 items-center">
              <button
                onClick={() => setSelectedDestination('all')}
                className={`flex flex-col items-center gap-2 flex-shrink-0 ${selectedDestination === 'all' ? 'opacity-100' : 'opacity-80'}`}
              >
                <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-medium border border-gray-100">
                  All
                </div>
              </button>

              {destinationList.map((destination) => (
                <button
                  key={destination.name}
                  onClick={() => setSelectedDestination(destination.name)}
                  className={`flex flex-col items-center gap-2 flex-shrink-0 transition-transform ${selectedDestination === destination.name ? 'scale-105' : 'hover:scale-105'}`}
                >
                  <img
                    src={destination.image_url}
                    alt={destination.name}
                    className="w-28 h-28 rounded-full object-cover shadow"
                    loading="lazy" // Native lazy loading for images
                  />
                  <span className="text-sm text-gray-700 font-medium">{destination.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {visibleTrips.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No trips found matching your criteria.</p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {visibleTrips.map((trip) => (
                <motion.article
                  key={trip.id}
                  onClick={() => onTripSelect(trip.id)}
                  className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col scroll-offset"
                  aria-labelledby={`trip-${trip.id}-title`}
                  // Framer Motion properties for each card
                  variants={itemVariants}
                  // Optionally add a slight hover effect
                  whileHover={{ scale: 1.02 }} 
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="relative">
                    <img 
                        src={trip.image_url} 
                        alt={trip.title} 
                        className="w-full h-64 object-cover" 
                        loading="lazy" // Native lazy loading for trip images
                    />

                    <div className="absolute left-3 bottom-3 bg-black-85 text-white px-3 py-1 rounded-md text-sm flex items-center gap-2">
                      <Users size={14} />
                      <span className="font-medium">{trip.member_count} travellers</span> {/* Updated text */}
                    </div>

                    <div className="absolute right-3 top-3 flex items-center gap-2">
                        {trip.is_private ? (
                             <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-white shadow">
                                Private
                            </span>
                        ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                                Public
                            </span>
                        )}
                      <button
                        onClick={(e) => { e.stopPropagation(); openChat(trip); }}
                        className={`px-3 py-1 rounded-full text-sm font-medium shadow ${userHasJoined(trip.id) ? 'bg-[var(--accent)] text-white' : 'bg-white text-gray-800 border'}`}
                        aria-label="Open group chat"
                      >
                        {userHasJoined(trip.id) ? 'Chat' : 'View Group'}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 id={`trip-${trip.id}-title`} className="text-lg font-semibold text-gray-900 truncate">{trip.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Globe size={14} className='text-gray-400' />
                            {trip.destination}
                        </p>
                      </div>

                      <div className="flex-shrink-0 ml-2">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-semibold">
                          <span className="text-sm">₹{trip.estimated_cost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>{formatTripDates(trip.start_date, trip.end_date)}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mt-3 line-clamp-2">{trip.notes || 'An exciting adventure awaits at this beautiful destination!'}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // NEW LOGIC: Direct navigation to detail page via prop function
                            onTripSelect(trip.id);
                          }}
                          className={`px-5 py-2 rounded-lg transition text-white text-sm`}
                          style={{ backgroundColor: 'var(--accent)' }}
                          aria-label="View trip details"
                        >
                          View Trip
                        </button>
                      </div>

                      <div>
                        {/* The existing Chat button (used for joined users or viewing the group) */}
                        <button
                          onClick={(e) => { e.stopPropagation(); openChat(trip); }}
                          className="px-4 py-2 rounded-lg border text-sm"
                        >
                          Chat
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Filter Drawer (No changes needed here) */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-start justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFilters(false)}
            aria-hidden
          />

          <div className="relative bg-white rounded-2xl w-[92%] md:w-[80%] lg:w-[70%] max-w-5xl mt-12 shadow-lg overflow-hidden">
            <button
              onClick={() => setShowFilters(false)}
              className="absolute right-4 top-4 z-20 p-2 rounded-full bg-white border shadow-sm"
              aria-label="Close filters"
            >
              <X size={18} />
            </button>

            <div className="flex">
              <div className="w-48 border-r border-gray-100 bg-gradient-to-r from-[#fdf2ee] to-white p-4">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Filter by</h3>
                <nav className="space-y-2">
                  {['sort', 'cost', 'duration', 'privacy', 'more'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveFilterTab(tab as any)}
                      className={`w-full text-left px-3 py-2 rounded-lg ${activeFilterTab === tab ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-semibold' : 'text-gray-800'}`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="flex-1 p-8">
                {activeFilterTab === 'sort' && (
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Sort By</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="radio" name="sort" checked={sortBy === 'popularity'} onChange={() => setSortBy('popularity')} />
                        <span className="font-medium">Popularity (Group Size)</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="radio" name="sort" checked={sortBy === 'cost_low'} onChange={() => setSortBy('cost_low')} />
                        <span className="font-medium">Cost : Low to High</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="radio" name="sort" checked={sortBy === 'cost_high'} onChange={() => setSortBy('cost_high')} />
                        <span className="font-medium">Cost : High to Low</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="radio" name="sort" checked={sortBy === 'date_upcoming'} onChange={() => setSortBy('date_upcoming')} />
                        <span className="font-medium">Upcoming Date</span>
                      </label>
                    </div>
                  </div>
                )}

                {activeFilterTab === 'cost' && (
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Estimated Cost Range (₹)</h4>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        value={costRange[0]}
                        onChange={(e) => setCostRange([Math.max(0, Number(e.target.value)), costRange[1]])}
                        className="w-24 px-3 py-2 border rounded-lg"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        value={costRange[1]}
                        onChange={(e) => setCostRange([costRange[0], Math.max(costRange[0], Number(e.target.value))])}
                        className="w-24 px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-3">Filter based on the estimated cost per person.</p>
                  </div>
                )}

                {activeFilterTab === 'duration' && (
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Trip Duration</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3">
                        <input type="radio" name="duration" checked={durationFilter === 'any'} onChange={() => setDurationFilter('any')} />
                        <span>Any Duration</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="radio" name="duration" checked={durationFilter === 'short'} onChange={() => setDurationFilter('short')} />
                        <span>Short Trips (Under 7 Days)</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="radio" name="duration" checked={durationFilter === 'long'} onChange={() => setDurationFilter('long')} />
                        <span>Long Trips (7+ Days)</span>
                      </label>
                    </div>
                  </div>
                )}

                {activeFilterTab === 'privacy' && (
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Trip Privacy</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3">
                        <input type="radio" name="privacy" checked={privacyFilter === 'all'} onChange={() => setPrivacyFilter('all')} />
                        <span>All Trips</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="radio" name="privacy" checked={privacyFilter === 'public'} onChange={() => setPrivacyFilter('public')} />
                        <span>Public Trips</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="radio" name="privacy" checked={privacyFilter === 'private'} onChange={() => setPrivacyFilter('private')} />
                        <span>Private Trips</span>
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">Private trips may require an invitation to join.</p>
                  </div>
                )}

                {activeFilterTab === 'more' && (
                  <div>
                    <h4 className="text-xl font-semibold mb-4">More Filters</h4>
                    <p className="text-sm text-gray-600 mb-3">Filter by activity type, transportation, or required gear.</p>

                    <div className="flex gap-3 flex-wrap">
                      <label className="flex items-center gap-2 px-3 py-2 border rounded-lg">
                        <input type="checkbox" />
                        <span className="text-sm">Hiking</span>
                      </label>
                      <label className="flex items-center gap-2 px-3 py-2 border rounded-lg">
                        <input type="checkbox" />
                        <span className="text-sm">Budget Friendly</span>
                      </label>
                      <label className="flex items-center gap-2 px-3 py-2 border rounded-lg">
                        <input type="checkbox" />
                        <span className="text-sm">Self-Drive</span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={() => { clearAllFilters(); }}
                    className="text-sm underline decoration-dotted text-gray-700"
                  >
                    Clear filters
                  </button>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => { setShowFilters(false); }}
                      className="px-4 py-2 rounded-lg border"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => { setShowFilters(false); }}
                      className="px-8 py-3 rounded-2xl text-white text-lg font-semibold shadow"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      Apply Filters ({filteredTrips.length})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}