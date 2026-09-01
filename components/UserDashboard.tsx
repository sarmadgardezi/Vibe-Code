'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { TicketCard } from './TicketCard';
import { Ticket, Car, Calendar, Award, MapPin, User, CheckCircle, Clock } from 'lucide-react';
import Image from 'next/image';

export function UserDashboard() {
  const { user, tickets, carpoolPins, deleteCarpoolPin } = useAuth();
  const [activeTab, setActiveTab] = useState<'tickets' | 'carpool' | 'profile'>('tickets');

  const myTickets = tickets.filter((t) => t.userCnic === user?.cnic);
  const myCarpoolPins = carpoolPins.filter((p) => p.userCnic === user?.cnic);

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 p-1 shrink-0 relative overflow-hidden">
              <Image
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt="Avatar"
                fill
                className="object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#FBBC05] text-slate-900 text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Community Member
                </span>
                <span className="text-xs text-blue-200">Verified CNIC</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome, {user?.name}!</h1>
              <p className="text-sm text-blue-100 mt-1">CNIC: <span className="font-mono">{user?.cnic}</span> | {user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shrink-0">
            <div className="text-center px-3 border-r border-white/20">
              <span className="block text-2xl font-black">{myTickets.length}</span>
              <span className="text-[11px] text-blue-200 uppercase font-medium">My Tickets</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-2xl font-black">{myCarpoolPins.length}</span>
              <span className="text-[11px] text-blue-200 uppercase font-medium">Carpools Offered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium text-sm transition-all ${
            activeTab === 'tickets'
              ? 'bg-[#4285F4] text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Ticket className="w-4 h-4" /> My Event Tickets ({myTickets.length})
        </button>

        <button
          onClick={() => setActiveTab('carpool')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium text-sm transition-all ${
            activeTab === 'carpool'
              ? 'bg-[#34A853] text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Car className="w-4 h-4" /> My Carpool Pin Drops ({myCarpoolPins.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium text-sm transition-all ${
            activeTab === 'profile'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <User className="w-4 h-4" /> Community Profile
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'tickets' && (
        <div>
          {myTickets.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
              <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-800">No Tickets Yet</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
                Browse our GDG Cloud Summit 2026 events on the homepage and claim your free digital QR ticket.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myTickets.map((t) => (
                <TicketCard key={t.ticketId} ticket={t} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'carpool' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Your Active Carpool Pickups</h3>
            <span className="text-xs text-gray-500">Visible to all attendees on the main map</span>
          </div>

          {myCarpoolPins.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Car className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">You haven't offered any carpool rides yet.</p>
              <p className="text-xs mt-1">Go to the Carpool Map section to drop your pickup location pin.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myCarpoolPins.map((pin) => (
                <div
                  key={pin.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200 gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-[#4285F4] text-xs font-bold px-2.5 py-0.5 rounded-full">
                        📍 {pin.areaName}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#FBBC05]" /> {pin.departureTime}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 mt-2">
                      Seats Available: {pin.seats} | Vehicle: {pin.vehicleInfo}
                    </p>
                    {pin.note && <p className="text-xs text-gray-500 mt-0.5">"{pin.note}"</p>}
                  </div>

                  <button
                    onClick={() => deleteCarpoolPin(pin.id)}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-colors self-start md:self-auto"
                  >
                    Remove Pin Drop
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm max-w-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#FBBC05]" /> GDG Islamabad Community Badge
          </h3>

          <div className="space-y-4 text-sm">
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#4285F4] text-white flex items-center justify-center font-bold text-lg">
                GDG
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Verified CNIC Member</h4>
                <p className="text-xs text-gray-500">Identity verified for Pak-China Friendship Centre Summit access.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-400 block font-medium">CNIC NUMBER</span>
                <span className="text-sm font-mono font-bold text-gray-800">{user?.cnic}</span>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-400 block font-medium">REGISTERED PHONE</span>
                <span className="text-sm font-bold text-gray-800">{user?.phone}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
