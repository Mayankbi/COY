'use client';

import React, { useState } from 'react';
import { Profile } from '@/lib/types';
import { Info, MapPin, Sparkles, ChevronUp } from 'lucide-react';

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

  // Card dynamics based on horizontal drag offset
  const rotation = offsetX * 0.07;
  const likeOpacity = Math.min(Math.max(offsetX / 90, 0), 1);
  const passOpacity = Math.min(Math.max(-offsetX / 90, 0), 1);

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    profile.name
  )}&size=800&background=111827&color=ffffff&bold=true`;

  return (
    <div
      className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden bg-black border-2 border-black coy-card-shadow cursor-grab active:cursor-grabbing select-none"
      style={{
        transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        touchAction: 'none'
      }}
    >
      <div className="relative w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageError ? fallbackAvatar : profile.photo}
          alt={profile.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center pointer-events-none"
          loading="eager"
        />

        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

        {/* LIKE Stamp indicator */}
        <div
          className="absolute top-8 left-8 border-4 border-emerald-400 text-emerald-400 font-black text-2xl uppercase tracking-widest px-4 py-1.5 rounded-2xl rotate-[-15deg] pointer-events-none transition-opacity shadow-lg bg-black/30 backdrop-blur-xs"
          style={{ opacity: likeOpacity }}
        >
          LIKE
        </div>

        {/* PASS Stamp indicator */}
        <div
          className="absolute top-8 right-8 border-4 border-[#ff2d6c] text-[#ff2d6c] font-black text-2xl uppercase tracking-widest px-4 py-1.5 rounded-2xl rotate-[15deg] pointer-events-none transition-opacity shadow-lg bg-black/30 backdrop-blur-xs"
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
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/80 transition active:scale-95 z-20 cursor-pointer shadow-md"
          title="View profile details"
          aria-label="View full details"
        >
          <Info className="w-5 h-5 text-white" />
        </button>

        {/* Card Footer Information */}
        <div className="absolute bottom-0 inset-x-0 p-5 text-white flex flex-col justify-end space-y-2 z-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-black tracking-tight text-white drop-shadow">
              {profile.name}, <span className="font-semibold text-xl text-gray-200">{profile.age}</span>
            </h2>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-pink-300">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{profile.location}</span>
          </div>

          <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed drop-shadow">
            {profile.bio}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {profile.interests.slice(0, 3).map((interest, idx) => (
              <span
                key={idx}
                className="text-[11px] font-bold bg-white/20 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full text-white flex items-center gap-1"
              >
                <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                {interest}
              </span>
            ))}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails();
            }}
            className="w-full flex items-center justify-center gap-1 text-[11px] text-gray-300 hover:text-white pt-1"
          >
            <span>Tap for full bio</span>
            <ChevronUp className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>
      </div>
    </div>
  );
}
