'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  Shield,
  Users,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Plus,
  BarChart3,
  Car,
  Camera,
  Search,
  Sparkles,
  Send
} from 'lucide-react';
import Image from 'next/image';

export function AdminDashboard() {
  const { events, tickets, carpoolPins, verifyTicketQR, addNewEvent } = useAuth();
  const [manualQRInput, setManualQRInput] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);

  // New Event Form Modal state
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTagline, setNewEventTagline] = useState('');
  const [newEventDate, setNewEventDate] = useState('Saturday, October 24, 2026');
  const [newEventTime, setNewEventTime] = useState('10:00 AM - 04:00 PM PKT');
  const [newEventVenue, setNewEventVenue] = useState('NUST SEECS Auditorium, Islamabad');
  const [newEventCategory, setNewEventCategory] = useState<'Cloud' | 'AI / ML' | 'Mobile / Flutter' | 'Web' | 'Hackathon'>('Cloud');

  // Stats calculation
  const totalRegistrations = tickets.length;
  const checkedInCount = tickets.filter((t) => t.isCheckedIn).length;
  const carpoolRequestsCount = carpoolPins.length;

  const handleManualScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQRInput.trim()) return;
    const res = verifyTicketQR(manualQRInput.trim());
    setScanResult(res);
    setManualQRInput('');
  };

  const handleSimulateRandomScan = () => {
    if (tickets.length === 0) return;
    const randomTicket = tickets[Math.floor(Math.random() * tickets.length)];
    const res = verifyTicketQR(randomTicket.qrPayload);
    setScanResult(res);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addNewEvent({
      title: newEventTitle,
      tagline: newEventTagline,
      description: 'Official GDG Islamabad community learning session and hands-on developer workshop.',
      date: newEventDate,
      time: newEventTime,
      venue: newEventVenue,
      category: newEventCategory,
      status: 'Upcoming',
      registrationType: 'Free registration',
      capacity: 300,
      bannerImg: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      speakers: [
        {
          name: 'GDG Islamabad Lead',
          role: 'Organizer',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          company: 'Google Developer Group'
        }
      ]
    });
    setShowAddEvent(false);
    setNewEventTitle('');
    setNewEventTagline('');
  };

  return (
    <div className="space-y-6">
      {/* Organizer Control Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#4285F4]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2 shrink-0 flex items-center justify-center">
              <Shield className="w-8 h-8 text-[#FBBC05]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#4285F4] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  GDG Organizer Portal
                </span>
                <span className="text-xs text-gray-400">Admin Mode Active</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Summit Organizer Dashboard</h1>
              <p className="text-xs text-gray-400 mt-1">
                Manage attendees, verify gate QR codes, monitor carpool pins & publish events.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddEvent(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[#34A853] hover:bg-emerald-600 text-white font-semibold rounded-2xl text-xs transition-all shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" /> Create New GDG Event
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#4285F4] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium block uppercase">Total Registrations</span>
            <span className="text-2xl font-black text-gray-900">{totalRegistrations}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium block uppercase">Checked In At Gate</span>
            <span className="text-2xl font-black text-gray-900">{checkedInCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#FBBC05] flex items-center justify-center shrink-0">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium block uppercase">Carpool Pin Drops</span>
            <span className="text-2xl font-black text-gray-900">{carpoolRequestsCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#EA4335] flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium block uppercase">Active Events</span>
            <span className="text-2xl font-black text-gray-900">{events.length}</span>
          </div>
        </div>
      </div>

      {/* Main Admin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rapid QR Ticket Check-in Gate Scanner Simulator */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#4285F4]" /> Gate QR Code Check-in
            </h3>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">
              GATE 1 ACTIVE
            </span>
          </div>

          <form onSubmit={handleManualScan} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Scan or Paste QR Ticket Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Paste QR payload or Ticket ID..."
                  value={manualQRInput}
                  onChange={(e) => setManualQRInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#4285F4]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="submit"
                className="py-2.5 bg-[#4285F4] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Verify Ticket
              </button>

              <button
                type="button"
                onClick={handleSimulateRandomScan}
                className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1"
              >
                <Camera className="w-3.5 h-3.5 text-[#34A853]" /> Simulate Scanner
              </button>
            </div>
          </form>

          {/* Scanner Feedback Notification */}
          {scanResult && (
            <div
              className={`p-4 rounded-2xl border text-xs font-medium animate-in fade-in ${
                scanResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                {scanResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>{scanResult.message}</span>
              </div>
              {(scanResult as any).ticket && (
                <div className="mt-2 pt-2 border-t border-emerald-200/50 text-[11px]">
                  <p>👤 <strong>{(scanResult as any).ticket.userName}</strong> ({(scanResult as any).ticket.userCnic})</p>
                  <p>🎟️ {(scanResult as any).ticket.eventTitle}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Registered Attendees Table */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Registered Community Attendees</h3>
            <span className="text-xs text-gray-500">{tickets.length} Registered Passes</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                  <th className="py-2.5 px-3">Attendee</th>
                  <th className="py-2.5 px-3">CNIC</th>
                  <th className="py-2.5 px-3">Event</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.map((t) => (
                  <tr key={t.ticketId} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-gray-900">{t.userName}</div>
                      <div className="text-[10px] text-gray-400">{t.userEmail}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-gray-700">{t.userCnic}</td>
                    <td className="py-3 px-3 font-medium text-gray-800 truncate max-w-[180px]">{t.eventTitle}</td>
                    <td className="py-3 px-3">
                      {t.isCheckedIn ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Checked-in ({t.checkedInAt})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Pending Gate Arrival
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add New Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 max-w-lg w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#34A853]" /> Create New GDG Community Event
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GDG Web Dev Summit"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js, PWAs and Google AI"
                  value={newEventTagline}
                  onChange={(e) => setNewEventTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-white"
                  >
                    <option value="Cloud">Cloud</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="Mobile / Flutter">Mobile / Flutter</option>
                    <option value="Web">Web</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Venue Location</label>
                <input
                  type="text"
                  value={newEventVenue}
                  onChange={(e) => setNewEventVenue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEvent(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#34A853] hover:bg-emerald-600 text-white rounded-xl font-semibold text-xs shadow-md"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
