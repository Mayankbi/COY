'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Profile, SwipeAction, SwipeResponse } from '@/lib/types';
import { ProfileCard } from './ProfileCard';
import { ProfileDetailsModal } from './ProfileDetailsModal';
import { MatchModal } from './MatchModal';
import {
  X,
  Heart,
  RotateCcw,
  Sparkles,
  Info,
  Shield,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface DiscoverViewProps {
  onGoToMatches: () => void;
  onMatchCreated: () => void;
}

export function DiscoverView({ onGoToMatches, onMatchCreated }: DiscoverViewProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwipingInProgress, setIsSwipingInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dragging gesture state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Modals
  const [detailsProfile, setDetailsProfile] = useState<Profile | null>(null);
  const [recentMatchProfile, setRecentMatchProfile] = useState<Profile | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Fetch feed profiles on mount
  const fetchFeed = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/feed');
      const data = await res.json();
      if (data.success) {
        setProfiles(data.profiles || []);
        setCurrentIndex(0);
      } else {
        setErrorMessage(data.error || 'Failed to load feed.');
      }
    } catch (err: any) {
      setErrorMessage('Network error while loading profiles.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const currentProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];

  // Core Swipe Execution Handler
  const handleSwipe = useCallback(
    async (action: SwipeAction) => {
      if (!currentProfile || isSwipingInProgress) return;

      setIsSwipingInProgress(true);
      setErrorMessage(null);

      // Trigger fly-away visual exit
      const exitDistance = action === 'like' ? 600 : -600;
      setDragOffset({ x: exitDistance, y: 0 });

      try {
        const res = await fetch('/api/swipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profileId: currentProfile.id,
            action
          })
        });

        const data: SwipeResponse = await res.json();

        // Advance to next card smoothly after animation
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setDragOffset({ x: 0, y: 0 });
          setIsSwipingInProgress(false);

          // If mutual match occurred, trigger match modal & notify parent
          if (data.isMatch && data.match) {
            setRecentMatchProfile(data.match.profile);
            onMatchCreated();
          }
        }, 220);
      } catch (err) {
        console.error('Error recording swipe:', err);
        setErrorMessage('Failed to submit swipe. Please try again.');
        setDragOffset({ x: 0, y: 0 });
        setIsSwipingInProgress(false);
      }
    },
    [currentProfile, isSwipingInProgress, onMatchCreated]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (detailsProfile || recentMatchProfile) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSwipe('like');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSwipe('pass');
      } else if (e.key === 'ArrowUp' || e.key === ' ') {
        e.preventDefault();
        if (currentProfile) {
          setDetailsProfile(currentProfile);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProfile, detailsProfile, recentMatchProfile, handleSwipe]);

  // Touch and Mouse Gesture Handling
  const handlePointerDown = (clientX: number, clientY: number) => {
    if (isSwipingInProgress || !currentProfile) return;
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY };
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging || !dragStartRef.current) return;
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const SWIPE_THRESHOLD = 85;
    if (dragOffset.x > SWIPE_THRESHOLD) {
      handleSwipe('like');
    } else if (dragOffset.x < -SWIPE_THRESHOLD) {
      handleSwipe('pass');
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
    dragStartRef.current = null;
  };

  // Reset Demo State Handler
  const handleRestartDemo = async () => {
    try {
      setIsLoading(true);
      await fetch('/api/reset', { method: 'POST' });
      await fetchFeed();
      onMatchCreated();
    } catch (err) {
      setErrorMessage('Failed to reset demo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-white select-none overflow-hidden pb-20 text-gray-900">
      {/* Top Header */}
      <div className="flex justify-between items-center pb-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-2xl font-black tracking-tight text-black">coy</span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff2d6c] mt-1 inline-block" />
          <span className="ml-2 text-xs font-black uppercase tracking-wider bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full border border-gray-300">
            Discover
          </span>
        </div>

        <button
          onClick={() => setShowHelp(true)}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"
          aria-label="Help"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {errorMessage && (
        <div className="mb-2 px-3 py-2 rounded-xl bg-red-100 border border-red-300 text-xs font-bold text-red-700 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)}>&times;</button>
        </div>
      )}

      {/* Main Discover Card Viewport */}
      <div className="flex-1 relative flex flex-col items-center justify-center min-h-[440px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-9 h-9 border-3 border-[#ff2d6c] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-gray-500">Loading confidential feed...</p>
          </div>
        ) : currentProfile ? (
          <div
            className="relative w-full h-[480px] max-w-sm"
            onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
            onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={(e) =>
              handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)
            }
            onTouchMove={(e) =>
              handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)
            }
            onTouchEnd={handlePointerUp}
          >
            {/* Background stack card */}
            {nextProfile && (
              <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden bg-black border-2 border-black pointer-events-none transform scale-95 translate-y-3 opacity-60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={nextProfile.photo}
                  alt={nextProfile.name}
                  className="w-full h-full object-cover filter blur-xs"
                />
              </div>
            )}

            {/* Active Card */}
            <ProfileCard
              profile={currentProfile}
              offsetX={dragOffset.x}
              isDragging={isDragging}
              onOpenDetails={() => setDetailsProfile(currentProfile)}
            />
          </div>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-xs animate-fadeIn">
            <div className="w-20 h-20 rounded-3xl bg-[#ffeef3] border-2 border-black flex items-center justify-center coy-card-shadow">
              <Sparkles className="w-10 h-10 text-[#ff2d6c]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-black">All caught up!</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                You have reviewed all available profiles. All swipes are stored with 100% confidential privacy.
              </p>
            </div>

            <div className="w-full space-y-2 pt-2">
              <button
                onClick={onGoToMatches}
                className="w-full py-3 px-4 rounded-2xl bg-[#ff2d6c] text-white font-extrabold text-xs border-2 border-black coy-btn-shadow transition cursor-pointer"
              >
                View Matches
              </button>

              <button
                onClick={handleRestartDemo}
                className="w-full py-2.5 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 border-2 border-black text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Feed</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Swipe Action Buttons */}
      {currentProfile && (
        <div className="pt-3 pb-1 flex items-center justify-center gap-6">
          {/* Pass Button */}
          <button
            onClick={() => handleSwipe('pass')}
            disabled={isSwipingInProgress}
            className="w-14 h-14 rounded-full bg-white border-2 border-black text-[#ff2d6c] hover:bg-red-50 coy-btn-shadow flex items-center justify-center transition disabled:opacity-50 cursor-pointer"
            title="Pass (Left Arrow)"
            aria-label="Pass"
          >
            <X className="w-7 h-7 stroke-[3]" />
          </button>

          {/* Details Button */}
          <button
            onClick={() => setDetailsProfile(currentProfile)}
            disabled={isSwipingInProgress}
            className="w-11 h-11 rounded-full bg-gray-100 border-2 border-black text-gray-800 hover:bg-gray-200 coy-btn-shadow flex items-center justify-center transition cursor-pointer"
            title="Bio (Up Arrow)"
            aria-label="Bio"
          >
            <Info className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Like Button */}
          <button
            onClick={() => handleSwipe('like')}
            disabled={isSwipingInProgress}
            className="w-14 h-14 rounded-full bg-[#ff2d6c] border-2 border-black text-white hover:bg-[#e01e5a] coy-btn-shadow flex items-center justify-center transition disabled:opacity-50 cursor-pointer"
            title="Like (Right Arrow)"
            aria-label="Like"
          >
            <Heart className="w-7 h-7 fill-white stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* Modals */}
      {detailsProfile && (
        <ProfileDetailsModal
          profile={detailsProfile}
          onClose={() => setDetailsProfile(null)}
          onLike={() => {
            setDetailsProfile(null);
            handleSwipe('like');
          }}
          onPass={() => {
            setDetailsProfile(null);
            handleSwipe('pass');
          }}
        />
      )}

      {recentMatchProfile && (
        <MatchModal
          matchedProfile={recentMatchProfile}
          onClose={() => setRecentMatchProfile(null)}
          onGoToMatches={() => {
            setRecentMatchProfile(null);
            onGoToMatches();
          }}
        />
      )}

      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white border-2 border-black rounded-3xl p-5 space-y-4 coy-card-shadow">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h4 className="font-extrabold text-sm text-black">Controls &amp; Gestures</h4>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-500 hover:text-black font-bold text-lg"
              >
                &times;
              </button>
            </div>
            <div className="space-y-2 text-xs font-semibold text-gray-700">
              <div className="flex justify-between">
                <span>Drag Right / &rarr;</span>
                <span className="text-emerald-600 font-extrabold">Like</span>
              </div>
              <div className="flex justify-between">
                <span>Drag Left / &larr;</span>
                <span className="text-[#ff2d6c] font-extrabold">Pass</span>
              </div>
              <div className="flex justify-between">
                <span>&uarr; / Space</span>
                <span className="text-gray-900 font-extrabold">View Bio</span>
              </div>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-2.5 bg-black text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
