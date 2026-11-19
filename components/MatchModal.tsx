'use client';

import React from 'react';
import { Profile } from '@/lib/types';
import { Sparkles, Heart, ArrowRight, ShieldCheck } from 'lucide-react';

interface MatchModalProps {
  matchedProfile: Profile;
  onClose: () => void;
  onGoToMatches: () => void;
}

export function MatchModal({
  matchedProfile,
  onClose,
  onGoToMatches
}: MatchModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-white border-2 border-black rounded-3xl p-6 text-center flex flex-col items-center space-y-5 coy-card-shadow relative">
        <div className="bg-[#ff2d6c] text-white text-xs font-black px-3.5 py-1 rounded-full border border-black uppercase tracking-wider flex items-center gap-1 shadow">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          It&apos;s a Match!
        </div>

        {/* Matched Avatar Pair */}
        <div className="flex items-center justify-center -space-x-4 pt-1">
          <div className="w-20 h-20 rounded-full border-3 border-black overflow-hidden bg-gray-200 shadow-md relative z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
              alt="You"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="z-20 w-9 h-9 rounded-full bg-[#ff2d6c] border-2 border-black flex items-center justify-center text-white shadow-lg animate-bounce">
            <Heart className="w-4 h-4 fill-white" />
          </div>

          <div className="w-20 h-20 rounded-full border-3 border-black overflow-hidden bg-gray-200 shadow-md relative z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={matchedProfile.photo}
              alt={matchedProfile.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-black tracking-tight">
            You &amp; {matchedProfile.name.split(' ')[0]}
          </h2>
          <p className="text-xs text-[#ff2d6c] font-extrabold">
            Both of you liked each other secretly!
          </p>
          <p className="text-xs text-gray-600 font-medium pt-1 leading-relaxed">
            Because interest is 100% mutual, Coy has safely revealed this connection to both of you at the same moment.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
          <span>Double-blind verification complete.</span>
        </div>

        <div className="w-full space-y-2.5 pt-1">
          <button
            onClick={onGoToMatches}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#ff2d6c] hover:bg-[#e01e5a] text-white font-extrabold text-sm border-2 border-black coy-btn-shadow flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>View All Matches</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition cursor-pointer"
          >
            Keep Swiping
          </button>
        </div>
      </div>
    </div>
  );
}
