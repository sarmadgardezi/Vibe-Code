'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { LoginModal } from '@/components/LoginModal';
import { CarpoolMap } from '@/components/CarpoolMap';
import { UserDashboard } from '@/components/UserDashboard';
import { AdminDashboard } from '@/components/AdminDashboard';
import { GeminiAssistant } from '@/components/GeminiAssistant';
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  Ticket,
  Shield,
  User,
  LogOut,
  Sparkles,
  CheckCircle2,
  Users,
  Award,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  Flame,
  Star,
  Check
} from 'lucide-react';
import Image from 'next/image';
import confetti from 'canvas-confetti';

export default function Home() {
  const { user, role, logout, events, registerForEvent, switchDemoRole } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'events' | 'carpool' | 'dashboard'>('events');
  const [eventFilter, setEventFilter] = useState<'Upcoming' | 'Past' | 'All'>('Upcoming');
  const [registeredSuccessMsg, setRegisteredSuccessMsg] = useState<string | null>(null);

  // Register PWA service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('Service Worker Registration Failed', err);
      });
    }
  }, []);

  const handleRegisterEvent = (eventId: string, title: string) => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    const ticket = registerForEvent(eventId, true);
    if (ticket) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setRegisteredSuccessMsg(`🎉 Pass secured! Digital QR Ticket generated for ${title}. View it in your dashboard.`);
      setTimeout(() => setRegisteredSuccessMsg(null), 5000);
    }
  };

  const filteredEvents = events.filter((ev) => {
    if (eventFilter === 'Upcoming') return ev.status === 'Upcoming';
    if (eventFilter === 'Past') return ev.status === 'Past';
    return true;
  });

  const featuredDevFest = events.find((e) => e.id === 'cloud-devfest-2026') || events[0];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Google Brand Top Color Stripe */}
      <div className="h-1.5 flex w-full sticky top-0 z-50">
        <div className="h-full flex-1 bg-[#4285F4]"></div>
        <div className="h-full flex-1 bg-[#EA4335]"></div>
        <div className="h-full flex-1 bg-[#FBBC05]"></div>
        <div className="h-full flex-1 bg-[#34A853]"></div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-1.5 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div
            onClick={() => setCurrentView('events')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-44 h-10 relative transition-transform group-hover:scale-105">
              <Image
                src="/img/gdglogo.png"
                alt="Google Developer Group Cloud Islamabad Logo"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center bg-gray-100/80 p-1 rounded-2xl border border-gray-200 text-xs font-medium">
            <button
              onClick={() => setCurrentView('events')}
              className={`px-4 py-2 rounded-xl transition-all ${
                currentView === 'events'
                  ? 'bg-white text-[#4285F4] font-bold shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Events & DevFest
            </button>
            <button
              onClick={() => setCurrentView('carpool')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                currentView === 'carpool'
                  ? 'bg-white text-[#34A853] font-bold shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Car className="w-3.5 h-3.5 text-[#34A853]" /> Carpool Pin Drops & Chat
            </button>
            {user && (
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-white text-[#EA4335] font-bold shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {role === 'ADMIN' ? (
                  <>
                    <Shield className="w-3.5 h-3.5 text-[#FBBC05]" /> Admin Dashboard
                  </>
                ) : (
                  <>
                    <Ticket className="w-3.5 h-3.5 text-[#4285F4]" /> My Passes & Tickets
                  </>
                )}
              </button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center bg-blue-50 border border-blue-200/80 p-1 rounded-xl text-[11px]">
              <span className="px-2 text-blue-700 font-bold uppercase tracking-wider">Role:</span>
              <button
                onClick={() => switchDemoRole('USER')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  role === 'USER' ? 'bg-[#4285F4] text-white font-bold' : 'text-blue-700 hover:bg-blue-100'
                }`}
              >
                Attendee
              </button>
              <button
                onClick={() => switchDemoRole('ADMIN')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  role === 'ADMIN' ? 'bg-slate-900 text-white font-bold' : 'text-blue-700 hover:bg-blue-100'
                }`}
              >
                Admin (Organizer)
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl text-xs font-semibold text-gray-800 transition-all border border-gray-200"
                >
                  <User className="w-4 h-4 text-[#4285F4]" />
                  <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-2 bg-[#4285F4] hover:bg-[#3367D6] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Sign In with CNIC
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Sub Navigation Mobile Bar */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-around text-xs font-medium">
        <button
          onClick={() => setCurrentView('events')}
          className={`py-1 ${currentView === 'events' ? 'text-[#4285F4] font-bold border-b-2 border-[#4285F4]' : 'text-gray-500'}`}
        >
          Events & DevFest
        </button>
        <button
          onClick={() => setCurrentView('carpool')}
          className={`py-1 ${currentView === 'carpool' ? 'text-[#34A853] font-bold border-b-2 border-[#34A853]' : 'text-gray-500'}`}
        >
          Carpool Map
        </button>
        {user && (
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`py-1 ${currentView === 'dashboard' ? 'text-[#EA4335] font-bold border-b-2 border-[#EA4335]' : 'text-gray-500'}`}
          >
            Dashboard
          </button>
        )}
      </div>

      {registeredSuccessMsg && (
        <div className="max-w-7xl mx-auto px-4 mt-4 w-full">
          <div className="bg-emerald-600 text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-lg flex items-center justify-between animate-in fade-in">
            <span>{registeredSuccessMsg}</span>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="bg-white text-emerald-800 px-3 py-1 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-colors"
            >
              View QR Pass
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-12">
        {currentView === 'dashboard' ? (
          role === 'ADMIN' ? (
            <AdminDashboard />
          ) : (
            <UserDashboard />
          )
        ) : currentView === 'carpool' ? (
          <CarpoolMap />
        ) : (
          /* Events & Community Home View */
          <>
            {/* Featured Upcoming DevFest Hero Section */}
            <section className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4285F4]/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#EA4335] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                    <Flame className="w-3.5 h-3.5 fill-current" /> Flagship Upcoming Summit
                  </span>
                  <span className="bg-white/10 backdrop-blur-md text-blue-200 border border-white/20 text-xs px-3 py-1 rounded-full font-bold">
                    DevFest 2026 Edition
                  </span>
                </div>

                <div>
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
                    Cloud DevFest Islamabad 2026
                  </h1>
                  <p className="text-sm md:text-base text-gray-300 mt-2 leading-relaxed">
                    {featuredDevFest.description}
                  </p>
                </div>

                {/* DevFest Features Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs">
                    <span className="text-amber-400 font-bold block mb-0.5">🎫 Digital QR Ticket</span>
                    <span className="text-gray-300">CNIC verified instant gate entry pass</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs">
                    <span className="text-emerald-400 font-bold block mb-0.5">🚗 Pickup Pin Map</span>
                    <span className="text-gray-300">Live carpool matching & route chat</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs">
                    <span className="text-blue-400 font-bold block mb-0.5">✨ Gemini AI Assist</span>
                    <span className="text-gray-300">24/7 AI concierge for event schedule</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs">
                    <span className="text-rose-400 font-bold block mb-0.5">📲 PWA Offline Pass</span>
                    <span className="text-gray-300">Works without internet connection</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  {user?.registeredEvents.includes(featuredDevFest.id) ? (
                    <button
                      onClick={() => setCurrentView('dashboard')}
                      className="flex items-center gap-2 bg-[#34A853] text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg"
                    >
                      <CheckCircle2 className="w-5 h-5" /> View My DevFest Ticket
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegisterEvent(featuredDevFest.id, featuredDevFest.title)}
                      className="flex items-center gap-2 bg-[#4285F4] hover:bg-[#3367D6] text-white px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-xl hover:scale-105"
                    >
                      <Ticket className="w-5 h-5" /> Register Free for Cloud DevFest
                    </button>
                  )}

                  <button
                    onClick={() => setCurrentView('carpool')}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-2xl font-bold text-sm backdrop-blur-md transition-all"
                  >
                    <Car className="w-5 h-5 text-[#34A853]" /> Carpool Pin Drop Map
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs text-gray-400">
                  <div>
                    <span className="block font-medium text-gray-500">VENUE</span>
                    <span className="font-bold text-white">Pak-China Friendship Centre</span>
                  </div>
                  <div>
                    <span className="block font-medium text-gray-500">DATE</span>
                    <span className="font-bold text-white">{featuredDevFest.date}</span>
                  </div>
                  <div>
                    <span className="block font-medium text-gray-500">CAPACITY</span>
                    <span className="font-bold text-[#34A853]">{featuredDevFest.registeredCount} / {featuredDevFest.capacity} Registered</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Events Directory & Filter Controls */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    GDG Cloud Islamabad Events
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Official community history and upcoming developer conferences.
                  </p>
                </div>

                {/* Filter Switcher Pills */}
                <div className="flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-200 text-xs font-semibold shrink-0">
                  <button
                    onClick={() => setEventFilter('Upcoming')}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      eventFilter === 'Upcoming'
                        ? 'bg-[#4285F4] text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Upcoming Sessions
                  </button>
                  <button
                    onClick={() => setEventFilter('Past')}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      eventFilter === 'Past'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Past Events ({events.filter((e) => e.status === 'Past').length})
                  </button>
                  <button
                    onClick={() => setEventFilter('All')}
                    className={`px-3 py-2 rounded-xl transition-all ${
                      eventFilter === 'All'
                        ? 'bg-gray-800 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    All Events
                  </button>
                </div>
              </div>

              {/* Events Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((ev) => {
                  const isRegistered = user?.registeredEvents.includes(ev.id);
                  const isUpcoming = ev.status === 'Upcoming';

                  return (
                    <div
                      key={ev.id}
                      className={`bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group ${
                        isUpcoming ? 'border-blue-200/80 ring-1 ring-blue-100' : 'border-gray-200'
                      }`}
                    >
                      <div>
                        {/* Event Image Banner */}
                        <div className="h-44 relative overflow-hidden bg-gray-100">
                          <Image
                            src={ev.bannerImg}
                            alt={ev.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md ${
                                isUpcoming
                                  ? 'bg-[#4285F4] text-white'
                                  : 'bg-slate-900/80 text-white backdrop-blur-md'
                              }`}
                            >
                              {ev.status}
                            </span>
                            <span className="bg-white/90 backdrop-blur-md text-gray-800 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                              {ev.category}
                            </span>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="p-6 space-y-3">
                          <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold">
                            <span>{ev.date}</span>
                            <span className="text-[#34A853] font-bold">{ev.registrationType}</span>
                          </div>

                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#4285F4] transition-colors leading-snug">
                            {ev.title}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                            {ev.description}
                          </p>

                          <div className="space-y-1.5 text-xs text-gray-600 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-[#FBBC05]" />
                              <span>{ev.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-[#EA4335]" />
                              <span className="truncate">{ev.venue}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Footer */}
                      <div className="px-6 pb-6 pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[11px] text-gray-400 font-medium">
                          👥 {ev.registeredCount} Attending
                        </span>

                        {isRegistered ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Pass Claimed
                          </span>
                        ) : isUpcoming ? (
                          <button
                            onClick={() => handleRegisterEvent(ev.id, ev.title)}
                            className="px-4 py-2 bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                          >
                            <Ticket className="w-3.5 h-3.5" /> Claim Ticket
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl font-medium">
                            Event Concluded
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>

      <GeminiAssistant />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <footer className="bg-white border-t border-gray-200 mt-16 py-8 px-4 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-32 h-7 relative">
              <Image src="/img/gdglogo.png" alt="GDG Logo" fill className="object-contain" />
            </div>
            <span>&copy; 2026 Google Developer Group Cloud Islamabad.</span>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <a
              href="https://gdg.community.dev/gdg-cloud-islamabad/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#4285F4] flex items-center gap-1 font-semibold"
            >
              Official GDG Community Page <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
