'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Shield, UserCheck, KeyRound, ArrowRight, X, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { loginWithCNIC, switchDemoRole } = useAuth();
  const [cnicInput, setCnicInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFormatCNIC = (val: string) => {
    // Keep numbers and hyphens
    const clean = val.replace(/[^\d]/g, '');
    let formatted = clean;
    if (clean.length > 5 && clean.length <= 12) {
      formatted = `${clean.slice(0, 5)}-${clean.slice(5)}`;
    } else if (clean.length > 12) {
      formatted = `${clean.slice(0, 5)}-${clean.slice(5, 12)}-${clean.slice(12, 13)}`;
    }
    setCnicInput(formatted);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginWithCNIC(cnicInput, nameInput, undefined, phoneInput);
    if (!success) {
      setErrorMsg('Please enter a valid 13-digit Pakistani CNIC (e.g. 61101-1234567-1)');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header decoration */}
        <div className="h-3 flex">
          <div className="h-full flex-1 bg-[#4285F4]"></div>
          <div className="h-full flex-1 bg-[#EA4335]"></div>
          <div className="h-full flex-1 bg-[#FBBC05]"></div>
          <div className="h-full flex-1 bg-[#34A853]"></div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 relative mb-3">
              <Image
                src="/img/gdglogo.png"
                alt="GDG Logo"
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">GDG Islamabad Portal</h2>
            <p className="text-sm text-gray-500 mt-1">Sign in with your CNIC for Summit Pass & Carpool Access</p>
          </div>

          {/* Preset Judge Quick Login Switcher */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3.5 mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 block mb-2 text-center">
              ⚡ Hackathon Judge Quick Switch
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  switchDemoRole('USER');
                  onClose();
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-blue-600 hover:text-white text-blue-700 border border-blue-200 rounded-xl text-xs font-medium transition-all shadow-sm"
              >
                <UserCheck className="w-4 h-4" /> Attendee Demo
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoRole('ADMIN');
                  onClose();
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-medium transition-all shadow-sm"
              >
                <Shield className="w-4 h-4 text-[#FBBC05]" /> Admin Organizer
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-gray-200 w-full"></div>
            <span className="bg-white px-3 text-xs text-gray-400 font-medium uppercase">Or enter CNIC</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Sarmad Gardezi"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                National Identity Card (CNIC) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="61101-1234567-1"
                  value={cnicInput}
                  onChange={(e) => handleFormatCNIC(e.target.value)}
                  maxLength={15}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-transparent text-sm font-mono"
                />
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">13-digit Pakistani CNIC number for security verification</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Phone Number <span className="text-gray-400">(For Carpool SMS)</span>
              </label>
              <input
                type="tel"
                placeholder="0300-1234567"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-transparent text-sm"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[#4285F4] hover:bg-[#3367D6] text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg mt-2"
            >
              Verify CNIC & Continue <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
