'use client';

import React from 'react';
import { Profile } from '@/lib/types';
import { Sparkles, Heart, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-gradient-to-b from-[#1c1836] via-[#121624] to-[#0c0e18] border border-rose-500/30 rounded-3xl p-6 text-center flex flex-col items-center space-y-6 shadow-2xl relative glow-matched">
        {/* Decorative ambient sparkles */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
          <Sparkles className="w-3 h-3 text-amber-300" />
          It&apos;s a Match!
        </div>

        {/* Floating Heart Icon */}
        <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mt-2">
          <Heart className="w-9 h-9 text-rose-500 fill-rose-500 animate-pulse" />
        </div>

        {/* Matched Avatar Pair Visualization */}
        <div className="flex items-center justify-center -space-x-4 pt-1">
          {/* User Avatar */}
          <div className="w-20 h-20 rounded-full border-4 border-[#121624] overflow-hidden bg-slate-800 shadow-xl relative z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
              alt="You"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Sparkle Connector */}
          <div className="z-20 w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-white shadow-lg animate-bounce">
            <Heart className="w-4 h-4 fill-white" />
          </div>

          {/* Matched Profile Avatar */}
          <div className="w-20 h-20 rounded-full border-4 border-[#121624] overflow-hidden bg-slate-800 shadow-xl relative z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={matchedProfile.photo}
              alt={matchedProfile.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Congratulations message */}
        <div className="space-y-1.5">
          <h2 className="text-2xl font-black text-white tracking-tight">
            You &amp; {matchedProfile.name.split(' ')[0]}
          </h2>
          <p className="text-xs text-rose-300 font-medium">
            Both of you liked each other secretly!
          </p>
          <p className="text-xs text-slate-400 pt-1 leading-relaxed">
            Because interest is 100% mutual, Coy has safely revealed this connection to both of you.
          </p>
        </div>

        {/* Privacy Note */}
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Double-blind verification complete.</span>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5 pt-2">
          <button
            onClick={onGoToMatches}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 active:scale-95 text-white font-semibold text-sm shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>View All Matches</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-2xl bg-slate-900/80 border border-slate-700 hover:bg-slate-800 active:scale-95 text-slate-300 font-medium text-xs transition cursor-pointer"
          >
            Keep Swiping Discover
          </button>
        </div>
      </div>
    </div>
  );
}
