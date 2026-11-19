'use client';

import React, { useState } from 'react';
import { Profile } from '@/lib/types';
import { Sparkles, Heart, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';

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
  const [selectedForChat, setSelectedForChat] = useState<Profile | null>(null);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-[#ff2d6c] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-500 font-medium">Checking mutual matches...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 bg-white overflow-y-auto pb-24 text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black tracking-tight text-black">coy</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff2d6c] mt-1 inline-block" />
          </div>
          <h1 className="text-xl font-black text-black flex items-center gap-2 mt-1">
            <span>Matches</span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#ffeef3] text-[#ff2d6c] border border-[#ffb8ce]">
              {matches.length}
            </span>
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Double-blind revealed connections. Both of you liked each other!
          </p>
        </div>
      </div>

      {/* Empty State */}
      {matches.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#ffeef3] border-2 border-black flex items-center justify-center coy-card-shadow">
            <Heart className="w-8 h-8 text-[#ff2d6c] fill-[#ff2d6c]" />
          </div>
          <div className="space-y-1.5 max-w-xs">
            <h3 className="text-base font-extrabold text-black">No matches yet</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              When someone you like on Discover or on your crush list likes you back, they will appear here instantly!
            </p>
          </div>
          <button
            onClick={onGoToDiscover}
            className="py-3 px-5 rounded-2xl bg-[#ff2d6c] text-white font-extrabold text-xs border-2 border-black coy-btn-shadow transition cursor-pointer"
          >
            Explore Discover Feed
          </button>
        </div>
      ) : (
        /* Matches Grid */
        <div className="grid grid-cols-2 gap-3.5 pb-6">
          {matches.map(({ id, profile, matchedAt }) => (
            <div
              key={id}
              onClick={() => onSelectProfile(profile)}
              className="bg-white rounded-3xl border-2 border-black coy-card-shadow overflow-hidden flex flex-col cursor-pointer transition hover:-translate-y-1"
            >
              <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute top-2 left-2 bg-[#ff2d6c] text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-black shadow">
                  💘 Mutual
                </div>

                <div className="absolute bottom-2 inset-x-2 text-white">
                  <p className="font-extrabold text-sm truncate drop-shadow">
                    {profile.name}, {profile.age}
                  </p>
                  <p className="text-[10px] text-pink-200 truncate">
                    {profile.location.split(',')[0]}
                  </p>
                </div>
              </div>

              {/* Match Card Footer */}
              <div className="p-2.5 bg-white border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400">
                  {new Date(matchedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedForChat(profile);
                  }}
                  className="py-1 px-3 bg-[#17d476] hover:bg-[#13bc67] text-black font-extrabold text-xs rounded-full border border-black coy-card-shadow-sm flex items-center gap-1"
                >
                  Say hi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Say Hi WhatsApp Prompt */}
      {selectedForChat && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white border-2 border-black rounded-3xl p-5 space-y-3.5 text-center coy-card-shadow animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-[#17d476]/20 border border-[#17d476] text-[#13bc67] flex items-center justify-center mx-auto">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-black">
              Say hi to {selectedForChat.name.split(' ')[0]}!
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              Both of you added each other secretly! Coy double-blind check is confirmed.
            </p>
            <div className="space-y-2 pt-1">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Hey ${selectedForChat.name.split(' ')[0]}! We just matched on Coy 💘`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 bg-[#17d476] text-black font-extrabold text-xs rounded-2xl border-2 border-black coy-btn-shadow flex items-center justify-center gap-1.5 transition"
              >
                Open WhatsApp
              </a>
              <button
                onClick={() => setSelectedForChat(null)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-2xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
