'use client';

import React, { useState } from 'react';
import { Profile } from '@/lib/types';
import { Info, MapPin, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';

interface ProfileCardProps {
  profile: Profile;
  offsetX: number;
  isDragging: boolean;
  onOpenDetails: () => void;
}

export function ProfileCard({
  profile,
  offsetX,
  isDragging,
  onOpenDetails
}: ProfileCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showQuickBio, setShowQuickBio] = useState(false);

  // Card dynamics based on horizontal drag offset
  const rotation = offsetX * 0.08; // subtle tilt during drag
  const likeOpacity = Math.min(Math.max(offsetX / 100, 0), 1);
  const passOpacity = Math.min(Math.max(-offsetX / 100, 0), 1);

  // Fallback image gradient if Unsplash image fails to load
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    profile.name
  )}&size=800&background=1e293b&color=cbd5e1&bold=true`;

  return (
    <div
      className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800/80 cursor-grab active:cursor-grabbing select-none"
      style={{
        transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        touchAction: 'none'
      }}
    >
      {/* Background Image Container */}
      <div className="relative w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageError ? fallbackAvatar : profile.photo}
          alt={profile.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center pointer-events-none"
          loading="eager"
        />

        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none h-24" />

        {/* LIKE Stamp indicator while dragging right */}
        <div
          className="absolute top-8 left-8 border-4 border-emerald-400 text-emerald-400 font-extrabold text-2xl uppercase tracking-widest px-4 py-1.5 rounded-xl rotate-[-15deg] pointer-events-none transition-opacity shadow-lg"
          style={{ opacity: likeOpacity }}
        >
          LIKE
        </div>

        {/* PASS Stamp indicator while dragging left */}
        <div
          className="absolute top-8 right-8 border-4 border-rose-500 text-rose-500 font-extrabold text-2xl uppercase tracking-widest px-4 py-1.5 rounded-xl rotate-[15deg] pointer-events-none transition-opacity shadow-lg"
          style={{ opacity: passOpacity }}
        >
          PASS
        </div>

        {/* Details button on top right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/60 transition active:scale-95 z-20 cursor-pointer shadow-md"
          title="View full profile details"
          aria-label="View full profile details"
        >
          <Info className="w-5 h-5 text-gray-200" />
        </button>

        {/* Profile Card Footer Information */}
        <div className="absolute bottom-0 inset-x-0 p-5 text-white flex flex-col justify-end space-y-2.5 z-10">
          {/* Name & Age Header */}
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
              {profile.name}, <span className="font-medium text-xl text-slate-200">{profile.age}</span>
            </h2>
          </div>

          {/* Location / Campus */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{profile.location}</span>
          </div>

          {/* Quick Bio snippet */}
          <p
            className={`text-xs text-slate-200 leading-relaxed drop-shadow transition-all ${
              showQuickBio ? 'line-clamp-none' : 'line-clamp-2'
            }`}
          >
            {profile.bio}
          </p>

          {/* Interests Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {profile.interests.slice(0, 3).map((interest, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-white/15 backdrop-blur-md border border-white/10 px-2.5 py-0.5 rounded-full text-slate-100 flex items-center gap-1"
              >
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                {interest}
              </span>
            ))}
            {profile.interests.length > 3 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetails();
                }}
                className="text-[11px] font-medium bg-black/30 backdrop-blur-md border border-white/15 px-2 py-0.5 rounded-full text-slate-300 cursor-pointer hover:bg-black/50"
              >
                +{profile.interests.length - 3} more
              </span>
            )}
          </div>

          {/* Pull up indicator for full profile */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails();
            }}
            className="w-full flex items-center justify-center gap-1 text-[11px] text-slate-400 hover:text-white pt-1 transition"
          >
            <span>Tap for full bio & details</span>
            <ChevronUp className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>
      </div>
    </div>
  );
}
