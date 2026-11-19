'use client';

import React, { useState } from 'react';
import { Profile } from '@/lib/types';
import { X, MapPin, Sparkles, Heart, ShieldCheck } from 'lucide-react';

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
  )}&size=800&background=111827&color=ffffff&bold=true`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white border-2 border-black rounded-t-3xl sm:rounded-3xl max-h-[88vh] flex flex-col overflow-hidden coy-card-shadow relative">
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 text-gray-900">
          <div className="relative h-72 w-full bg-gray-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageError ? fallbackAvatar : profile.photo}
              alt={profile.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-4 left-5 text-white">
              <h2 className="text-3xl font-black drop-shadow">
                {profile.name}, <span className="font-semibold text-2xl">{profile.age}</span>
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-pink-300 font-semibold mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{profile.location}</span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Double-Blind Protection Active: Swiping remains 100% confidential.</span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                About {profile.name.split(' ')[0]}
              </h3>
              <p className="text-sm text-gray-800 font-medium leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-200">
                {profile.bio}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                Interests &amp; Passions
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-bold bg-[#f1eeff] border border-[#c6bdff] text-purple-900 px-3 py-1.5 rounded-full flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-center gap-4">
          <button
            onClick={() => {
              onClose();
              onPass();
            }}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-white border-2 border-black text-black font-extrabold text-sm coy-btn-shadow flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <X className="w-4 h-4 text-[#ff2d6c] stroke-[3]" />
            Pass
          </button>

          <button
            onClick={() => {
              onClose();
              onLike();
            }}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-[#ff2d6c] hover:bg-[#e01e5a] text-white font-extrabold text-sm border-2 border-black coy-btn-shadow flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-white stroke-[2.5]" />
            Like
          </button>
        </div>
      </div>
    </div>
  );
}
