'use client';

import React, { useState } from 'react';
import { Profile } from '@/lib/types';
import { X, MapPin, Sparkles, Heart, ShieldCheck, User } from 'lucide-react';

interface ProfileDetailsModalProps {
  profile: Profile;
  onClose: () => void;
  onLike: () => void;
  onPass: () => void;
}

export function ProfileDetailsModal({
  profile,
  onClose,
  onLike,
  onPass
}: ProfileDetailsModalProps) {
  const [imageError, setImageError] = useState(false);
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    profile.name
  )}&size=800&background=1e293b&color=cbd5e1&bold=true`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#121624] border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Sticky Header with Close Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/80 transition active:scale-95 cursor-pointer shadow-lg"
            aria-label="Close profile details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Header Image */}
          <div className="relative h-72 w-full bg-slate-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageError ? fallbackAvatar : profile.photo}
              alt={profile.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121624] via-transparent to-black/30" />
            <div className="absolute bottom-4 left-5">
              <h2 className="text-3xl font-extrabold text-white drop-shadow">
                {profile.name}, <span className="font-semibold text-2xl text-slate-300">{profile.age}</span>
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-rose-300 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{profile.location}</span>
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 space-y-6">
            {/* Privacy verification badge */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Double-Blind Protected: Swiping like or pass remains 100% confidential.</span>
            </div>

            {/* About / Bio */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                About {profile.name.split(' ')[0]}
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800/80">
                {profile.bio}
              </p>
            </div>

            {/* Interests & Passions */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Interests & Passions
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-full text-slate-200 flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Overview
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Campus / City</span>
                  <span className="font-medium text-slate-200 truncate block mt-0.5">{profile.location}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Age</span>
                  <span className="font-medium text-slate-200 block mt-0.5">{profile.age} years old</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-center gap-6">
          <button
            onClick={() => {
              onClose();
              onPass();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-900 border border-slate-700 hover:bg-slate-800 active:scale-95 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <X className="w-4 h-4 text-rose-400" />
            Pass
          </button>

          <button
            onClick={() => {
              onClose();
              onLike();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 active:scale-95 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 transition cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-white" />
            Like
          </button>
        </div>
      </div>
    </div>
  );
}
