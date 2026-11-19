'use client';

import React from 'react';
import { Sparkles, Shield, Heart, Zap, Lock } from 'lucide-react';

interface HomeViewProps {
  onGoToDiscover: () => void;
  matchesCount: number;
}

export function HomeView({ onGoToDiscover, matchesCount }: HomeViewProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-between p-6 text-center animate-fadeIn">
      {/* Top Banner */}
      <div className="w-full flex justify-between items-center py-2 border-b border-slate-800/80 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
            C
          </div>
          <span className="font-semibold text-sm tracking-wide text-gray-200">Home Feed</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-full">
          <Shield className="w-3.5 h-3.5" />
          <span>Double-Blind Active</span>
        </div>
      </div>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-xs space-y-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500/20 via-pink-500/20 to-purple-500/20 border border-rose-500/30 flex items-center justify-center shadow-lg shadow-rose-500/10">
            <Heart className="w-10 h-10 text-rose-500 fill-rose-500/30 animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 p-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome to Coy
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The privacy-first crush-matching space. Explore profiles safely—no one ever knows you liked them unless the feeling is 100% mutual.
          </p>
        </div>

        {/* Value Highlights */}
        <div className="w-full space-y-2 text-left pt-2">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-200">Zero Rejection Risk</p>
              <p className="text-[11px] text-slate-400">Your swipes are confidential. Passes and one-sided likes remain forever private.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-200">Instant Mutual Reveal</p>
              <p className="text-[11px] text-slate-400">Match alerts unlock only when both parties reciprocate interest.</p>
            </div>
          </div>
        </div>

        {/* CTA to Discover */}
        <button
          onClick={onGoToDiscover}
          className="w-full mt-4 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 active:scale-[0.98] transition-all duration-150 text-white font-medium text-sm shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          Start Discovering Profiles
        </button>
      </div>

      {/* Footer Info */}
      <div className="w-full pt-6 pb-2 border-t border-slate-800/60 text-xs text-slate-500 flex justify-between items-center">
        <span>Logged in as: Demo User</span>
        <span>{matchesCount} Mutual {matchesCount === 1 ? 'Match' : 'Matches'}</span>
      </div>
    </div>
  );
}
