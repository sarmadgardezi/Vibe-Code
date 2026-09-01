'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { CarpoolPin } from '@/lib/types';
import { MapPin, Navigation, Car, Plus, Phone, CheckCircle2, Clock, MessageSquare, Send, X } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const createGooglePinIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export function CarpoolMapContent() {
  const { carpoolPins, addCarpoolPin, user, sendChatMessage } = useAuth();
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tempMarkerRef = useRef<L.Marker | null>(null);

  const [isAddingPin, setIsAddingPin] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Active Live Chat Modal State
  const [activeChatPin, setActiveChatPin] = useState<CarpoolPin | null>(null);
  const [chatInputText, setChatInputText] = useState('');
  
  // New pin form state
  const [areaName, setAreaName] = useState('');
  const [seats, setSeats] = useState(3);
  const [departureTime, setDepartureTime] = useState('08:15 AM');
  const [vehicleInfo, setVehicleInfo] = useState('Honda Civic / Toyota Corolla');
  const [genderPref, setGenderPref] = useState<'Anyone' | 'Male Only' | 'Female Only'>('Anyone');
  const [phone, setPhone] = useState(user?.phone || '0300-1234567');
  const [note, setNote] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [33.6844, 73.0479],
      zoom: 12,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync pins onto map
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer !== tempMarkerRef.current) {
        map.removeLayer(layer);
      }
    });

    // Pak-China Friendship Centre Event Venue Marker
    const venueIcon = L.divIcon({
      className: 'venue-marker',
      html: `
        <div style="
          background-color: #EA4335;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 11px;
          box-shadow: 0 4px 14px rgba(234, 67, 53, 0.4);
          border: 2px solid white;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        ">
          📍 GDG Summit Venue
        </div>
      `,
      iconAnchor: [60, 20]
    });

    L.marker([33.6938, 73.0858], { icon: venueIcon })
      .addTo(map)
      .bindPopup(`
        <div style="padding: 6px; font-family: sans-serif;">
          <h4 style="margin: 0 0 4px 0; font-weight: bold; color: #EA4335;">GDG Cloud Summit Venue</h4>
          <p style="margin: 0; font-size: 12px; color: #555;">Pak-China Friendship Centre, Islamabad</p>
        </div>
      `);

    // Render Carpool Pins
    carpoolPins.forEach((pin, index) => {
      const colors = ['#4285F4', '#34A853', '#FBBC05', '#EA4335'];
      const pinColor = colors[index % colors.length];
      const icon = createGooglePinIcon(pinColor);

      const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map);

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; padding: 4px; max-width: 220px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="background: #e8f0fe; color: #1a73e8; font-weight: 600; font-size: 10px; padding: 2px 8px; border-radius: 12px;">
              🚗 ${pin.seats} seats left
            </span>
            <span style="font-size: 11px; color: #5f6368;">${pin.departureTime}</span>
          </div>
          <h4 style="margin: 0 0 2px 0; color: #202124; font-size: 14px; font-weight: 700;">${pin.userName}</h4>
          <p style="margin: 0 0 6px 0; font-size: 12px; color: #3c4043; line-height: 1.3;">📍 ${pin.areaName}</p>
          <div style="background: #f8f9fa; border-radius: 8px; padding: 6px; font-size: 11px; color: #5f6368; margin-bottom: 8px;">
            🚙 ${pin.vehicleInfo}<br/>
            🏷️ ${pin.genderPreference}
          </div>
          <a href="tel:${pin.phone}" style="display: block; text-align: center; background: #34A853; color: white; text-decoration: none; padding: 6px; border-radius: 8px; font-weight: 600; font-size: 12px; margin-bottom: 4px;">
            📞 Call Driver (${pin.phone})
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);
    });
  }, [carpoolPins]);

  // Map click handler
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!isAddingPin) return;

      const { lat, lng } = e.latlng;
      setSelectedCoords({ lat, lng });

      if (tempMarkerRef.current) {
        map.removeLayer(tempMarkerRef.current);
      }

      const tempIcon = createGooglePinIcon('#4285F4');
      tempMarkerRef.current = L.marker([lat, lng], { icon: tempIcon }).addTo(map);

      setAreaName(`Pickup Point (${lat.toFixed(4)}, ${lng.toFixed(4)}) - Islamabad`);
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isAddingPin]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const map = mapRef.current;
        if (map) {
          map.flyTo([latitude, longitude], 14);
          setIsAddingPin(true);
          setSelectedCoords({ lat: latitude, lng: longitude });

          if (tempMarkerRef.current) {
            map.removeLayer(tempMarkerRef.current);
          }
          const tempIcon = createGooglePinIcon('#4285F4');
          tempMarkerRef.current = L.marker([latitude, longitude], { icon: tempIcon }).addTo(map);
          setAreaName(`My GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        }
      },
      () => {
        alert('Could not fetch GPS location. Click anywhere on the map to drop your pickup pin manually.');
      }
    );
  };

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoords) {
      alert('Please click on the map to select a pickup pin location first.');
      return;
    }

    await addCarpoolPin({
      lat: selectedCoords.lat,
      lng: selectedCoords.lng,
      areaName: areaName || 'Islamabad Pick-up Point',
      seats: Number(seats),
      departureTime,
      vehicleInfo,
      genderPreference: genderPref,
      phone,
      note
    });

    if (tempMarkerRef.current && mapRef.current) {
      mapRef.current.removeLayer(tempMarkerRef.current);
      tempMarkerRef.current = null;
    }

    setIsAddingPin(false);
    setSelectedCoords(null);
    setToastMsg('🎉 Your carpool pickup pin has been dropped! Other attendees can now ping you.');
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatPin || !chatInputText.trim()) return;

    await sendChatMessage(activeChatPin.id, chatInputText);
    setChatInputText('');
  };

  // Sync active chat messages live from main pins array
  const currentChatPin = activeChatPin
    ? carpoolPins.find((p) => p.id === activeChatPin.id) || activeChatPin
    : null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              Live Community Carpool & Chat
            </span>
            <span className="text-xs text-gray-400">GDG Summit 2026</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Drop Pickup Pin & Chat for Ride Matching
          </h2>
          <p className="text-sm text-gray-500">
            Mark your pickup point on the map. Connect with attendees on the same route via online chat.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleUseMyLocation}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
          >
            <Navigation className="w-4 h-4 text-[#4285F4]" /> My GPS Location
          </button>

          <button
            onClick={() => {
              setIsAddingPin(!isAddingPin);
              if (!isAddingPin) {
                setToastMsg('📍 Click anywhere on the map to place your pickup pin.');
                setTimeout(() => setToastMsg(''), 3000);
              }
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md ${
              isAddingPin
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-[#4285F4] hover:bg-[#3367D6] text-white'
            }`}
          >
            {isAddingPin ? (
              <>Cancel Pin Drop</>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Drop Pickup Pin / Offer Carpool
              </>
            )}
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="bg-[#E8F0FE] border border-[#4285F4]/30 text-[#1A73E8] px-4 py-3 rounded-2xl text-sm font-medium flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#4285F4]" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Map & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map View */}
        <div className="lg:col-span-2 relative bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 shadow-sm h-[540px]">
          {isAddingPin && (
            <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 text-white px-4 py-2 rounded-2xl text-xs font-medium backdrop-blur-md border border-white/20 flex items-center gap-2 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05] animate-ping"></span>
              Click anywhere on map to position pickup pin
            </div>
          )}

          <div ref={containerRef} className="w-full h-full z-0" />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {isAddingPin ? (
            <div className="bg-white rounded-3xl p-6 border border-blue-200 shadow-md animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#4285F4]" /> Drop Pickup Point
                </h3>
                <span className="text-xs text-[#4285F4] bg-blue-50 px-2.5 py-1 rounded-full font-medium">
                  {selectedCoords ? 'Location Selected' : 'Tap Map First'}
                </span>
              </div>

              <form onSubmit={handleSavePin} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Pickup Point / Neighborhood</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. F-7 Markaz / Commercial Market"
                    value={areaName}
                    onChange={(e) => setAreaName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#4285F4] text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Seats Offered/Needed</label>
                    <select
                      value={seats}
                      onChange={(e) => setSeats(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-white"
                    >
                      <option value={1}>1 Seat</option>
                      <option value={2}>2 Seats</option>
                      <option value={3}>3 Seats</option>
                      <option value={4}>4 Seats</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Departure Time</label>
                    <input
                      type="text"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      placeholder="08:15 AM"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Vehicle / Ride Info</label>
                  <input
                    type="text"
                    value={vehicleInfo}
                    onChange={(e) => setVehicleInfo(e.target.value)}
                    placeholder="e.g. Honda Civic (White) / Looking for ride"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Preference</label>
                  <select
                    value={genderPref}
                    onChange={(e) => setGenderPref(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-white"
                  >
                    <option value="Anyone">Everyone Welcome</option>
                    <option value="Male Only">Male Only</option>
                    <option value="Female Only">Female Only</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Notes / Pickup instructions</label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Standing near Safa Gold Mall main gate."
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#34A853] hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-md text-sm mt-2"
                >
                  Confirm & Save Pickup Pin
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm h-[540px] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Car className="w-5 h-5 text-[#34A853]" /> Attendee Carpool Pins
                </h3>
                <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium">
                  {carpoolPins.length} Pins
                </span>
              </div>

              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                {carpoolPins.map((pin) => (
                  <div
                    key={pin.id}
                    className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 hover:border-blue-300 transition-all google-card-hover"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{pin.userName}</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#EA4335]" /> {pin.areaName}
                        </p>
                      </div>
                      <span className="bg-green-100 text-green-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        {pin.seats} seats
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 my-2 bg-white p-2 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#FBBC05]" /> {pin.departureTime}
                      </div>
                      <div className="flex items-center gap-1 font-medium text-gray-700">
                        🚙 {pin.vehicleInfo}
                      </div>
                    </div>

                    {pin.note && <p className="text-xs text-gray-500 italic mb-3">"{pin.note}"</p>}

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <a
                        href={`tel:${pin.phone}`}
                        className="flex items-center justify-center gap-1 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-semibold transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call Driver
                      </a>

                      <button
                        onClick={() => setActiveChatPin(pin)}
                        className="flex items-center justify-center gap-1 py-2 bg-[#E8F0FE] hover:bg-[#4285F4] text-[#1A73E8] hover:text-white rounded-xl text-xs font-semibold transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Online Chat ({pin.messages?.length || 0})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Online Chat Modal for Route Pickup Ping */}
      {currentChatPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden flex flex-col h-[500px]">
            {/* Chat Modal Header */}
            <div className="bg-[#4285F4] text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-100 block">
                  Carpool Pickup Route Chat
                </span>
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-[#FBBC05]" /> Chat with {currentChatPin.userName}
                </h3>
              </div>
              <button
                onClick={() => setActiveChatPin(null)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Location banner */}
            <div className="bg-blue-50 px-4 py-2 text-xs border-b border-blue-100 flex items-center justify-between text-blue-800">
              <span>📍 Route: {currentChatPin.areaName}</span>
              <span className="font-bold bg-white px-2 py-0.5 rounded-full border border-blue-200">
                {currentChatPin.seats} Seats Left
              </span>
            </div>

            {/* Messages Stream */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-gray-50 text-xs">
              {(!currentChatPin.messages || currentChatPin.messages.length === 0) ? (
                <div className="text-center text-gray-400 py-8">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No messages yet on this route.</p>
                  <p className="text-[11px] mt-1 text-gray-500">Send a ping message to coordinate your pickup location!</p>
                </div>
              ) : (
                currentChatPin.messages.map((msg) => {
                  const isMe = msg.senderId === user?.id || msg.senderCnic === user?.cnic;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] text-gray-400 mb-0.5 font-medium">{msg.senderName} • {msg.timestamp}</span>
                      <div
                        className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                          isMe
                            ? 'bg-[#4285F4] text-white rounded-br-none'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
              <input
                type="text"
                placeholder={user ? "Write a pickup ping message..." : "Login with CNIC to chat..."}
                disabled={!user}
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#4285F4] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!user}
                className="p-2.5 bg-[#4285F4] hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl transition-all shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
