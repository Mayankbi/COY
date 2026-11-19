'use client';

import React, { useState } from 'react';
import {
  Settings,
  UserPlus,
  EyeOff,
  Heart,
  Share2,
  Mail,
  Plus,
  Smartphone,
  Check,
  X,
  Play,
  Lock,
  MessageCircle,
  Compass
} from 'lucide-react';

interface HomeViewProps {
  onGoToDiscover: () => void;
  matchesCount: number;
}

export function HomeView({ onGoToDiscover, matchesCount }: HomeViewProps) {
  const [showAddCrushModal, setShowAddCrushModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [crushName, setCrushName] = useState('');
  const [crushPhone, setCrushPhone] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // User's added crushes list matching the exact video presentation
  const [myCrushes, setMyCrushes] = useState([
    {
      id: 'crush-1',
      name: 'Mayank',
      label: 'riya',
      phone: '+91 95064 80175',
      isMatched: true
    },
    {
      id: 'crush-2',
      name: 'xyz',
      label: 'xyz',
      phone: '+91 98393 31117',
      isMatched: false
    }
  ]);

  const handleAddCrushSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crushName.trim() || !crushPhone.trim()) return;

    const newCrush = {
      id: `crush-${Date.now()}`,
      name: crushName.trim(),
      label: crushName.trim().toLowerCase(),
      phone: `+91 ${crushPhone.trim()}`,
      isMatched: false
    };

    setMyCrushes([...myCrushes, newCrush]);
    setShowAddCrushModal(false);
    setToastMessage(`Added ${newCrush.name}. They'll get an anonymous heads-up.`);
    setCrushName('');
    setCrushPhone('');

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-white overflow-y-auto pb-24 text-gray-900">
      {/* Top Navigation Bar with exact Coy Logo & Gear Icon */}
      <header className="flex justify-between items-center py-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-2xl font-black tracking-tight text-black">coy</span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff2d6c] mt-1 inline-block" />
        </div>
        <button
          onClick={() => {}}
          className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4 stroke-[2.2]" />
        </button>
      </header>

      {/* Hero Card with dot grid pattern and solid brutalist border */}
      <div className="w-full bg-white border-2 border-black rounded-3xl p-5 mb-4 relative overflow-hidden coy-card-shadow">
        {/* Lilac Dot-Grid Pattern Header */}
        <div className="w-full bg-[#f1eeff] rounded-2xl py-3 px-4 mb-4 flex items-center justify-center relative">
          <div className="grid grid-cols-9 gap-2.5 items-center justify-items-center">
            {Array.from({ length: 27 }).map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  i === 13 || i === 14 ? 'bg-[#ff2d6c] ring-2 ring-black' : 'bg-[#c6bdff]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Hero Title & Subtext */}
        <h2 className="text-2xl font-extrabold text-black leading-tight mb-4">
          Find out if your crush likes you back
        </h2>

        {/* 3 Value Statements with rounded icon badges */}
        <div className="space-y-3 mb-5 text-[13px] font-medium text-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
              <UserPlus className="w-4 h-4 text-purple-700" />
            </div>
            <span>Add someone you like, by number or email</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
              <EyeOff className="w-4 h-4 text-orange-700" />
            </div>
            <span>We tell them someone likes them, not who</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-pink-100 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 text-pink-600 fill-pink-600" />
            </div>
            <span>If they add you back, it&apos;s a match</span>
          </div>
        </div>

        {/* Main Brand Action Button */}
        <button
          onClick={() => setShowAddCrushModal(true)}
          className="w-full py-3.5 px-4 bg-[#ff2d6c] hover:bg-[#e01e5a] text-white font-bold rounded-2xl border-2 border-black coy-btn-shadow text-center text-sm transition"
        >
          Add your crushes
        </button>
      </div>

      {/* Yellow Story Broadcast Card (Exact match to real Coy app video) */}
      <div className="w-full bg-[#fce458] border-2 border-black rounded-3xl p-4 mb-4 coy-card-shadow relative">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-9 bg-white border-2 border-black rounded-lg flex items-center justify-center relative shadow-sm">
            <Mail className="w-5 h-5 text-black" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#ff2d6c] rounded-full border border-black flex items-center justify-center text-[7px] text-white font-bold">
              ❤
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-black text-sm leading-tight">
              Someone has a crush on you
            </h3>
          </div>
        </div>

        <div className="border-t border-dashed border-black/40 pt-3 flex items-center justify-between gap-3">
          <p className="text-[11px] font-medium text-black leading-snug">
            Share it on your story to ask your crush to reveal themselves.
          </p>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Coy — Someone has a crush on you',
                  text: 'Someone has a crush on you on Coy! See if you like them back.',
                  url: 'https://app.getcoy.com'
                }).catch(() => {});
              } else {
                setToastMessage('Link copied to clipboard!');
                setTimeout(() => setToastMessage(null), 3000);
              }
            }}
            className="w-9 h-9 rounded-xl bg-[#ff2d6c] border-2 border-black flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition coy-card-shadow-sm"
            aria-label="Share story"
          >
            <Share2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Add Coy to Home Screen Banner */}
      <div className="w-full bg-blue-50 border border-blue-200 rounded-2xl p-3 mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-gray-900">Add Coy to your home screen</p>
            <p className="text-[10px] text-gray-500">Open it like an app, in one tap.</p>
          </div>
        </div>
        <button className="text-xs font-bold text-red-500 hover:text-red-700">
          Add
        </button>
      </div>

      {/* Crushes List Section Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-extrabold text-base text-black">Your crushes</h3>
        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {myCrushes.length}/3
        </span>
      </div>

      {/* Crushes List (Matches real video entries: Mayank, xyz, etc.) */}
      <div className="space-y-3 mb-4">
        {myCrushes.map((c) => (
          <div
            key={c.id}
            className={`w-full rounded-2xl p-3.5 border-2 ${
              c.isMatched
                ? 'bg-[#ffeef3] border-[#ffb8ce] coy-card-shadow-sm'
                : 'bg-gray-50 border-gray-200'
            } flex items-center justify-between`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                  c.isMatched
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm text-black">{c.name}</h4>
                  {c.isMatched && (
                    <span className="text-[11px] font-semibold text-[#ff2d6c] flex items-center gap-0.5">
                      💘 Matched
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 leading-tight">
                  &quot;{c.label}&quot;
                </p>
                <p className="text-[11px] text-gray-400 font-mono">{c.phone}</p>
              </div>
            </div>

            {c.isMatched && (
              <a
                href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="py-1.5 px-3.5 bg-[#17d476] hover:bg-[#13bc67] text-black font-extrabold text-xs rounded-full border-2 border-black coy-card-shadow-sm flex items-center gap-1"
              >
                Say hi
              </a>
            )}
          </div>
        ))}

        {/* Add a Crush Dashed Box Button */}
        {myCrushes.length < 3 && (
          <button
            onClick={() => setShowAddCrushModal(true)}
            className="w-full py-3 px-4 border-2 border-dashed border-gray-400 hover:border-black rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-gray-700 hover:text-black transition"
          >
            <div className="w-5 h-5 rounded-full bg-[#ff2d6c] text-white flex items-center justify-center">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>Add a crush</span>
          </button>
        )}

        {/* Get More Slots Button */}
        <button
          onClick={() => {
            setToastMessage('Invite link copied! Share to get a free slot.');
            setTimeout(() => setToastMessage(null), 3000);
          }}
          className="w-full py-3 px-4 bg-[#f1f2f6] hover:bg-gray-200 border-2 border-black rounded-2xl flex items-center justify-between text-left coy-card-shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#fce458] border border-black flex items-center justify-center">
              <Plus className="w-3.5 h-3.5 stroke-[3] text-black" />
            </div>
            <div>
              <p className="text-xs font-bold text-black">Get more slots</p>
              <p className="text-[10px] text-gray-500">Add more people to your list</p>
            </div>
          </div>
        </button>

        <p className="text-[11px] text-gray-500 text-center pt-1">
          They get an anonymous heads-up right away. Never who.
        </p>
      </div>

      {/* How Coy Works Card */}
      <div
        onClick={() => setShowHowItWorksModal(true)}
        className="w-full bg-[#f1f2f6] border-2 border-black rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-200 transition coy-card-shadow-sm mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-8 bg-pink-100 border border-black rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-[#ff2d6c] fill-[#ff2d6c]" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-black">How Coy works</h4>
            <p className="text-[10px] text-gray-500">
              Follow one crush from add to match, in 6 quick taps.
            </p>
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
          <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
        </div>
      </div>

      {/* Discover Quick Link Banner */}
      <div className="w-full bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-4 text-white flex items-center justify-between shadow-md mb-2">
        <div>
          <h4 className="font-bold text-sm">Discover Campus Profiles</h4>
          <p className="text-xs text-pink-100">Browse verified peers &amp; swipe securely.</p>
        </div>
        <button
          onClick={onGoToDiscover}
          className="py-2 px-3.5 bg-white text-[#ff2d6c] font-bold text-xs rounded-xl shadow-sm hover:bg-gray-50 transition"
        >
          Discover
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xl z-50 flex items-center gap-2 animate-bounce">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Add a Crush Modal (Exact replica of Coy real modal) */}
      {showAddCrushModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border-2 border-black coy-card-shadow relative animate-fadeIn">
            <button
              onClick={() => setShowAddCrushModal(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-extrabold text-black mb-4">Add a crush</h3>

            <form onSubmit={handleAddCrushSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-black mb-1">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Riya from 3rd floor"
                  value={crushName}
                  onChange={(e) => setCrushName(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-2xl bg-gray-100 border border-gray-200 text-sm font-medium focus:outline-hidden focus:border-black"
                  required
                />
                <p className="text-[10px] text-gray-500 mt-1">Only you see this.</p>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-black mb-1">
                  Phone number
                </label>
                <div className="flex rounded-2xl border-2 border-black overflow-hidden">
                  <div className="px-3 bg-gray-50 border-r border-gray-300 flex items-center text-xs font-bold text-gray-700">
                    +91
                  </div>
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    value={crushPhone}
                    onChange={(e) => setCrushPhone(e.target.value)}
                    className="flex-1 px-3 py-3 text-sm font-semibold focus:outline-hidden"
                    required
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">It takes one slot.</p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#ff2d6c] hover:bg-[#e01e5a] text-white font-extrabold rounded-2xl border-2 border-black coy-btn-shadow transition text-sm cursor-pointer mt-2"
              >
                Add crush
              </button>

              <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                They get an anonymous heads-up right away. Adding is final: you can&apos;t remove someone once they&apos;re on your list.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* How It Works Explainer Modal ("Ranbir & Alia" Storyboard from video) */}
      {showHowItWorksModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border-2 border-black coy-card-shadow relative">
            <button
              onClick={() => setShowHowItWorksModal(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-extrabold text-black mb-2">How Coy Works</h3>
            <p className="text-xs text-gray-600 mb-4">
              Double-blind matching guarantees you only discover crushes if it&apos;s mutual.
            </p>

            <div className="bg-[#fde9df] border-2 border-black rounded-2xl p-4 mb-4 text-center">
              <span className="text-xs font-black bg-white px-2.5 py-1 rounded-full border border-black inline-block mb-2">
                Ranbir&apos;s phone
              </span>
              <div className="bg-white border border-gray-300 rounded-xl p-2.5 text-xs font-semibold mb-2 flex justify-between items-center">
                <span>Alia (99887 76655)</span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                  Added
                </span>
              </div>
              <p className="text-[11px] font-medium text-gray-700">
                Ranbir adds Alia. Only he can see his list. Alia gets an anonymous ping.
              </p>
            </div>

            <div className="bg-[#e8e4ff] border-2 border-black rounded-2xl p-4 mb-4 text-center">
              <span className="text-xs font-black bg-white px-2.5 py-1 rounded-full border border-black inline-block mb-2">
                Alia&apos;s phone
              </span>
              <div className="bg-white border border-gray-300 rounded-xl p-2.5 text-xs font-semibold mb-2 flex justify-between items-center">
                <span>Ranbir (91234 56789)</span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                  Added
                </span>
              </div>
              <p className="text-[11px] font-medium text-gray-700">
                Alia adds Ranbir back... and it&apos;s a mutual match! Both see it at the same moment.
              </p>
            </div>

            <button
              onClick={() => setShowHowItWorksModal(false)}
              className="w-full py-3 bg-[#ff2d6c] text-white font-extrabold rounded-2xl border-2 border-black coy-btn-shadow"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
