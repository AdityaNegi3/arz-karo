import React, { useState } from 'react';
import { Edit2, Globe, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ProfileSidebar from '../components/ProfileSidebar';
import ProfileModal from '../components/ProfileModal';

const DEFAULT_AVATAR_URL = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=100';

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const [tab, setTab] = useState<'about' | 'past' | 'connections'>('about');
  const [openEdit, setOpenEdit] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      try {
        // Safe navigation after sign out
        window.location.assign('/');
      } catch {}
    }
  };

  const renderBio = () => {
    if (profile?.bio) return <p className="text-base text-gray-700 mt-5 leading-relaxed max-w-lg whitespace-pre-line">{profile.bio}</p>;
    return <p className="text-sm text-gray-600 italic mt-5 leading-relaxed max-w-lg">Welcome! Add a short bio to help hosts and other guests get to know you.</p>;
  };

  return (
    <>
      {/* 1. Adjusted padding for mobile (sm:px-6 py-8 instead of py-12) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10"> {/* Adjusted gap for mobile */}
          
          {/* 2. Sidebar for mobile/desktop */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            {/* Added relative positioning for mobile sidebar content to ensure it renders normally before lg breakpoint */}
            <div className="lg:sticky lg:top-24"> 
              <div className="flex flex-col">
                <div className="airbnb-card p-4 sm:p-6 lg:p-0 lg:bg-transparent lg:shadow-none"> {/* Card styling for mobile, hidden on large screens */}
                  <ProfileSidebar selected={tab} onSelect={(t) => setTab(t)} />
                </div>
                {/* 3. Sign Out button is always visible */}
                <div className="mt-4">
                  <button onClick={handleSignOut} className="w-full flex items-center gap-3 p-3 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg text-left font-medium transition duration-150">
                    <LogOut size={20} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {/* Header and Edit Button */}
            <div className="flex items-center justify-between mb-8">
              {/* Reduced font size for mobile header */}
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-800">
                {tab === 'about' ? 'About me' : tab === 'past' ? 'Past Experiences' : 'Connections'}
              </h1>
              {tab === 'about' && (
                <button onClick={() => setOpenEdit(true)} className="inline-flex items-center gap-2 btn-primary text-sm py-2 px-3 sm:py-2.5 sm:px-4"> {/* Smaller button on mobile */}
                  <Edit2 size={16} /> Edit
                </button>
              )}
            </div>

            {/* About Tab Content */}
            {tab === 'about' && (
              /* Changed grid layout for mobile: default column, switches to 2 columns on large screens */
              <section className="grid gap-8 lg:grid-cols-[2fr_1fr]"> 
                
                {/* Profile Details Card */}
                <div className="airbnb-card p-6 sm:p-8 flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full"> {/* Reduced mobile gap */}
                    <img
                      src={profile?.avatar_url || DEFAULT_AVATAR_URL}
                      alt={(profile?.full_name || profile?.username || 'profile') as string}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-lg flex-shrink-0 border-4 border-white"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = DEFAULT_AVATAR_URL;
                      }}
                    />

                    <div className="flex-1">
                      {/* Reduced font size for mobile name */}
                      <h2 className="text-xl sm:text-2xl font-semibold capitalize text-gray-800"> 
                        {profile?.full_name || profile?.username || (user?.email ? user.email.split('@')[0] : 'Guest')}
                      </h2>
                      <p className="text-gray-500 text-sm mt-1 flex items-center justify-center sm:justify-start gap-1">
                        {/* Placeholder for location/status */}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100 w-full">
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">My Bio</h3> {/* Reduced font size for mobile */}
                    {renderBio()}
                    {!profile?.bio && (
                      <button onClick={() => setOpenEdit(true)} className="text-primary-active hover:text-[#E46D54] text-sm font-medium mt-3 transition duration-150">
                        Click here to add your bio
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile Completeness Card */}
                <aside className="airbnb-card p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-lg sm:text-xl mb-3 text-gray-800">Profile Completeness</h4> {/* Reduced font size for mobile */}
                    <p className="text-sm text-gray-500 leading-relaxed mb-6">
                      Make a great first impression! Update your profile picture and write a detailed bio.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <button className="btn-primary w-full py-2.5 text-[15px]" onClick={() => setOpenEdit(true)}>
                      {profile?.bio || profile?.avatar_url ? 'Edit Details' : 'Complete Profile'}
                    </button>
                  </div>
                </aside>
              </section>
            )}

            {/* Past Experiences Tab Content */}
            {tab === 'past' && (
              <section className="py-12 sm:py-16 flex flex-col items-center text-center airbnb-card p-6 sm:p-8"> {/* Adjusted padding */}
                <p className="text-gray-500 mb-4 max-w-lg">You'll find your past reservations here after you've taken your first trip on our platform.</p>
                {/* <button className="btn-primary">Book a trip</button> */}
              </section>
            )}

            {/* Connections Tab Content */}
            {tab === 'connections' && (
              <section className="py-6 sm:py-8 airbnb-card p-6 sm:p-8"> {/* Adjusted padding */}
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Travel Companions</h3> {/* Reduced font size for mobile */}
                <p className="text-gray-600">You currently have no connections to display.</p>
                <p className="text-sm text-gray-500 mt-2">Start by sharing your profile link to connect with friends!</p>
              </section>
            )}
          </main>
        </div>
      </div>

      {openEdit && <ProfileModal onClose={() => setOpenEdit(false)} />}
    </>
  );
}