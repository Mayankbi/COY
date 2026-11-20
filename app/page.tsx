'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { HomeView } from '@/components/HomeView';
import { DiscoverView } from '@/components/DiscoverView';
import { MatchesView } from '@/components/MatchesView';
import { ProfileDetailsModal } from '@/components/ProfileDetailsModal';
import { Profile } from '@/lib/types';
import { Home, Compass, Heart } from 'lucide-react';

type TabType = 'home' | 'discover' | 'matches';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [matches, setMatches] = useState<
    Array<{ id: string; profile: Profile; matchedAt: string }>
  >([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [activeProfileForModal, setActiveProfileForModal] = useState<Profile | null>(null);

  // Fetch mutual matches
  const fetchMatches = useCallback(async () => {
    try {
      setIsLoadingMatches(true);
      const res = await fetch('/api/matches');
      const data = await res.json();
      if (data.success) {
        setMatches(data.matches || []);
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setIsLoadingMatches(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <div className="flex flex-col h-screen w-full select-none overflow-hidden bg-white">
      {/* Dynamic Main Body Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'home' && (
          <HomeView
            onGoToDiscover={() => setActiveTab('discover')}
            matchesCount={matches.length}
          />
        )}

        {activeTab === 'discover' && (
          <DiscoverView
            onGoToMatches={() => setActiveTab('matches')}
            onMatchCreated={fetchMatches}
          />
        )}

        {activeTab === 'matches' && (
          <MatchesView
            matches={matches}
            isLoading={isLoadingMatches}
            onGoToDiscover={() => setActiveTab('discover')}
            onSelectProfile={(profile) => setActiveProfileForModal(profile)}
          />
        )}
      </main>

      {/* Mobile-First Bottom Navigation Bar */}
      <nav className="h-16 bg-white border-t-2 border-gray-100 px-6 flex items-center justify-around z-30 shrink-0">
        {/* Home Tab */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-150 cursor-pointer ${
            activeTab === 'home'
              ? 'text-[#ff2d6c] scale-105 font-bold'
              : 'text-gray-400 hover:text-gray-700 font-semibold'
          }`}
          aria-label="Home tab"
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-wider uppercase">Home</span>
        </button>

        {/* Discover Tab */}
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-150 cursor-pointer relative ${
            activeTab === 'discover'
              ? 'text-[#ff2d6c] scale-105 font-bold'
              : 'text-gray-400 hover:text-gray-700 font-semibold'
          }`}
          aria-label="Discover tab"
        >
          <Compass className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-wider uppercase">Discover</span>
          {activeTab === 'discover' && (
            <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#ff2d6c]" />
          )}
        </button>

        {/* Matches Tab */}
        <button
          onClick={() => setActiveTab('matches')}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-150 cursor-pointer relative ${
            activeTab === 'matches'
              ? 'text-[#ff2d6c] scale-105 font-bold'
              : 'text-gray-400 hover:text-gray-700 font-semibold'
          }`}
          aria-label="Matches tab"
        >
          <div className="relative">
            <Heart className="w-5 h-5 stroke-[2.2]" />
            {matches.length > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#ff2d6c] text-white text-[9px] font-black px-1.5 rounded-full min-w-4 text-center leading-tight border border-white">
                {matches.length}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-wider uppercase">Matches</span>
          {activeTab === 'matches' && (
            <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#ff2d6c]" />
          )}
        </button>
      </nav>

      {activeProfileForModal && (
        <ProfileDetailsModal
          profile={activeProfileForModal}
          onClose={() => setActiveProfileForModal(null)}
        />
      )}
    </div>
  );
}
