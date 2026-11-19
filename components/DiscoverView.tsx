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
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

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
        setErrorMessage(data.error || 'Failed to load profile feed.');
      }
    } catch (err: any) {
      setErrorMessage('Network error while loading profiles. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // Current active profile
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

  // Keyboard navigation: Left Arrow (Pass), Right Arrow (Like), Up/Space (Details)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input is focused or a modal is open
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

    const SWIPE_THRESHOLD = 90; // pixels to trigger like/pass
    if (dragOffset.x > SWIPE_THRESHOLD) {
      handleSwipe('like');
    } else if (dragOffset.x < -SWIPE_THRESHOLD) {
      handleSwipe('pass');
    } else {
      // Spring back to center
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
      setErrorMessage('Failed to reset demo state.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 relative select-none">
      {/* Top Header Bar */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center font-extrabold text-white text-sm shadow-md shadow-rose-500/20">
            C
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              <span>Discover</span>
              <span className="text-[10px] font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.5 rounded-full">
                Blind Feed
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowKeyboardHelp(true)}
            className="w-8 h-8 rounded-full bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Keyboard shortcuts & info"
            aria-label="Keyboard shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error notification bar */}
      {errorMessage && (
        <div className="mb-3 px-3.5 py-2 rounded-xl bg-rose-950/70 border border-rose-800/60 text-xs text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-white text-xs font-bold px-1"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Discover Card Viewport */}
      <div className="flex-1 relative flex flex-col items-center justify-center min-h-[460px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Loading secret crush feed...</p>
          </div>
        ) : currentProfile ? (
          <div
            className="relative w-full h-[500px] max-w-sm"
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
            {/* Background card preview for smooth 3D stack visual */}
            {nextProfile && (
              <div
                className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-lg bg-slate-900 border border-slate-800 pointer-events-none transform scale-95 translate-y-3 opacity-60"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={nextProfile.photo}
                  alt={nextProfile.name}
                  className="w-full h-full object-cover filter blur-[1px]"
                />
              </div>
            )}

            {/* Top Active Card */}
            <ProfileCard
              profile={currentProfile}
              offsetX={dragOffset.x}
              isDragging={isDragging}
              onOpenDetails={() => setDetailsProfile(currentProfile)}
            />
          </div>
        ) : (
          /* Empty State — Feed Exhausted */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-5 animate-fadeIn max-w-xs">
            <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
              <Sparkles className="w-10 h-10 text-rose-500" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">You&apos;re All Caught Up!</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                You&apos;ve reviewed all available profiles for now. Don&apos;t worry—your swipes have been securely recorded with complete privacy.
              </p>
            </div>

            {/* Privacy Guarantee reminder */}
            <div className="w-full p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2 text-left">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Remember: If anyone you liked also likes you, you will see them in Matches.</span>
            </div>

            {/* Actions */}
            <div className="w-full space-y-2.5 pt-2">
              <button
                onClick={onGoToMatches}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-medium text-xs shadow-md shadow-rose-500/20 transition cursor-pointer"
              >
                View Your Mutual Matches
              </button>

              <button
                onClick={handleRestartDemo}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Feed</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Swipe Action Controls (Bottom Bar) */}
      {currentProfile && (
        <div className="pt-4 pb-2 flex items-center justify-center gap-6">
          {/* Pass Button */}
          <button
            onClick={() => handleSwipe('pass')}
            disabled={isSwipingInProgress}
            className="w-14 h-14 rounded-full bg-slate-900/90 border-2 border-slate-700/80 text-rose-500 hover:border-rose-500/80 hover:bg-rose-500/10 active:scale-90 transition-all duration-150 flex items-center justify-center shadow-lg disabled:opacity-50 cursor-pointer"
            title="Pass (Left Arrow)"
            aria-label="Pass profile"
          >
            <X className="w-7 h-7 stroke-[2.5]" />
          </button>

          {/* Details Button */}
          <button
            onClick={() => setDetailsProfile(currentProfile)}
            disabled={isSwipingInProgress}
            className="w-10 h-10 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center shadow disabled:opacity-50 cursor-pointer"
            title="View Details (Up Arrow)"
            aria-label="Open profile details"
          >
            <Info className="w-5 h-5" />
          </button>

          {/* Like Button */}
          <button
            onClick={() => handleSwipe('like')}
            disabled={isSwipingInProgress}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 active:scale-90 transition-all duration-150 flex items-center justify-center shadow-lg shadow-rose-500/30 disabled:opacity-50 cursor-pointer"
            title="Like (Right Arrow)"
            aria-label="Like profile"
          >
            <Heart className="w-7 h-7 fill-white stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* Profile Details Modal */}
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

      {/* Mutual Match Modal Pop-Up */}
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

      {/* Keyboard Controls & Info Modal */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="text-sm font-semibold text-white">Controls &amp; Gestures</h4>
              <button
                onClick={() => setShowKeyboardHelp(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span>Swipe / Drag Right</span>
                <span className="font-semibold text-emerald-400">Like</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Swipe / Drag Left</span>
                <span className="font-semibold text-rose-400">Pass</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Key &rarr; (Right Arrow)</span>
                <span className="font-semibold text-emerald-400">Like</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Key &larr; (Left Arrow)</span>
                <span className="font-semibold text-rose-400">Pass</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Key &uarr; (Up Arrow) / Space</span>
                <span className="font-semibold text-slate-200">View Bio</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <p className="font-medium text-slate-300 mb-1">Coy Privacy Guarantee:</p>
              Profiles never know you liked them unless they also liked you back.
            </div>

            <button
              onClick={() => setShowKeyboardHelp(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
