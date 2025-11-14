import React, { useState } from 'react';
import { User, MessageCircle, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type NavbarProps = {
  onAuthClick: () => void;
  onProfileClick: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  onChatClick: () => void;
};

export default function Navbar({
  onAuthClick,
  onProfileClick,
  currentPage,
  onNavigate,
  onChatClick,
}: NavbarProps) {
  const { user, profile } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const leagueFont = {
    fontFamily:
      `'League Spartan', ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial`,
  };

  // NavItem unchanged...
  const NavItem = ({
    label,
    page,
    colorClasses,
    onClick,
  }: {
    label: string;
    page: string;
    colorClasses: string;
    onClick?: () => void;
  }) => {
    const isActive = currentPage === page;
    return (
      <button
        onClick={() => {
          onNavigate(page);
          if (onClick) onClick();
        }}
        aria-current={isActive ? 'page' : undefined}
        className={`inline-flex items-center px-4 py-2 rounded-full text-base font-bold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-60 ${
          isActive
            ? `${colorClasses} shadow-sm text-gray-900`
            : `text-gray-700 hover:text-gray-900 ${colorClasses}`
        }`}
      >
        {label}
      </button>
    );
  };

  const handleChatClick = () => {
    if (user) {
      onChatClick();
    } else {
      onAuthClick();
    }
  };

  return (
    <>
      {/* Set the navbar height variable on :root so siblings can consume it.
          Change the px values if you use a different navbar height. */}
      <style>{`
        :root { --navbar-height: 64px; } /* mobile default */
        @media (min-width: 768px) { :root { --navbar-height: 72px; } } /* md+ */
      `}</style>

      <nav
        className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-300 h-[64px] md:h-[72px]"
        style={leagueFont}
      >
        {/* ===== DESKTOP: unchanged for md+ ===== */}
        <div className="hidden md:flex w-full px-10 py-4 justify-between items-center h-full">
          <div className="flex items-center">
            <button onClick={() => onNavigate('home')} aria-label="Go to home" className="flex items-center">
              <img
                src="/logo.png"
                alt="arz"
                className="h-14 w-auto object-contain" /* keep inside navbar height */
                style={{ maxHeight: '100%' }}
              />
            </button>
          </div>

          <div className="flex items-center gap-10">
            <NavItem label="Events" page="events" colorClasses="hover:bg-[#FF785A] active:bg-[#FF785A] bg-[#FF785A]/0" />
            <NavItem label="Trips" page="trips" colorClasses="hover:bg-[#ABDF8B] active:bg-[#ABDF8B] bg-[#ABDF8B]/0" />
            <NavItem label="Activities" page="activities" colorClasses="hover:bg-[#99C1EC] active:bg-[#99C1EC] bg-[#99C1EC]/0" />
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleChatClick} className="p-2 rounded-full hover:bg-gray-200 transition" aria-label="Open chat">
              <MessageCircle size={24} className="text-gray-700" />
            </button>

            {user ? (
              <button onClick={onProfileClick} className="flex items-center gap-3 hover:opacity-90 transition">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.username ?? 'profile'} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User size={20} className="text-gray-600" />
                  </div>
                )}
              </button>
            ) : (
              <button onClick={onAuthClick} className="px-4 py-2 rounded-full text-base font-semibold text-gray-900 hover:bg-gray-200 transition-all duration-200">
                Login/Signup
              </button>
            )}
          </div>
        </div>

        {/* ===== MOBILE ===== */}
        <div className="flex md:hidden w-full px-4 h-full items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => onNavigate('home')} aria-label="Go to home" className="flex items-center">
              <img src="/logo.png" alt="arz" className="h-10 w-auto object-contain" />
            </button>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <button onClick={handleChatClick} className="p-2 rounded-full hover:bg-gray-100 transition" aria-label="Open chat">
              <MessageCircle size={20} className="text-gray-700" />
            </button>

            <button onClick={() => setMobileOpen((s) => !s)} className="p-2 rounded-full hover:bg-gray-100 transition" aria-label="Open menu">
              {mobileOpen ? <X size={20} className="text-gray-700" /> : <Menu size={20} className="text-gray-700" />}
            </button>
          </div>
        </div>

        {/* mobile slide-over unchanged */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-sm p-6 md:hidden">
            {/* ...menu contents unchanged (same as your original) */}
            {/* copy your existing mobile menu here or keep as-is */}
          </div>
        )}
      </nav>
    </>
  );
}
