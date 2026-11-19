'use client';

import React, { useState } from 'react';
import { Profile } from '@/lib/types';
import { Sparkles, Heart, Shield, MapPin, MessageCircle, ExternalLink } from 'lucide-react';

interface MatchesViewProps {
  matches: Array<{
    id: string;
    profile: Profile;
    matchedAt: string;
  }>;
  isLoading: boolean;
  onGoToDiscover: () => void;
  onSelectProfile: (profile: Profile) => void;
}

export function MatchesView({
  matches,
  isLoading,
  onGoToDiscover,
  onSelectProfile
}: MatchesViewProps) {
  const [selectedForChat, setSelectedForChat] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading your mutual matches...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 overflow-y-auto">
      {/* View Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800/80 mb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Matches</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
              {matches.length}
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Connections where both of you liked each other.
          </p>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-1 rounded-full">
          <Shield className="w-3 h-3" />
          <span>Mutual Only</span>
        </div>
      </div>

      {/* Empty State */}
      {matches.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center">
            <Heart className="w-8 h-8 text-slate-600" />
          </div>
          <div className="space-y-1.5 max-w-xs">
            <h3 className="text-base font-semibold text-white">No matches yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When someone you like has also liked you back, your match will appear here automatically.
            </p>
          </div>
          <button
            onClick={onGoToDiscover}
            className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium text-xs shadow-md shadow-rose-500/20 hover:from-rose-600 hover:to-pink-700 transition cursor-pointer"
          >
            Go to Discover Feed
          </button>
        </div>
      ) : (
        /* Match Grid */
        <div className="grid grid-cols-2 gap-3.5 pb-6">
          {matches.map(({ id, profile, matchedAt }) => {
            const formattedDate = new Date(matchedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric'
            });

            return (
              <div
                key={id}
                onClick={() => onSelectProfile(profile)}
                className="group relative bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-rose-500/50 overflow-hidden transition-all duration-200 cursor-pointer shadow-md hover:shadow-rose-500/10 flex flex-col"
              >
                {/* Profile Photo */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Mutual Match badge */}
                  <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Heart className="w-2.5 h-2.5 fill-white" />
                    Mutual
                  </div>

                  {/* Name and age overlay */}
                  <div className="absolute bottom-2 inset-x-2 text-white">
                    <p className="font-bold text-sm truncate drop-shadow">
                      {profile.name}, {profile.age}
                    </p>
                    <p className="text-[10px] text-slate-300 truncate flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                      {profile.location.split(',')[0]}
                    </p>
                  </div>
                </div>

                {/* Card footer */}
                <div className="p-2.5 bg-slate-900 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
                  <span className="text-[10px]">Matched {formattedDate}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedForChat(profile.name);
                    }}
                    className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition cursor-pointer"
                    title="Send a message"
                    aria-label={`Send message to ${profile.name}`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Coy simulated conversation prompt */}
      {selectedForChat && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white">
              Connect with {selectedForChat.split(' ')[0]}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Coy double-blind matching has revealed your mutual crush! Say hi on campus or through your mutual contact handle.
            </p>
            <button
              onClick={() => setSelectedForChat(null)}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
