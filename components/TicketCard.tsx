'use client';

import React, { useRef, useState } from 'react';
import { Ticket } from '@/lib/types';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, Clock, MapPin, ShieldCheck, Download, Sparkles, Printer, FileCheck } from 'lucide-react';
import Image from 'next/image';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // High-Resolution PDF Ticket Download
  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`GDG_Ticket_${ticket.userName.replace(/\s+/g, '_')}_${ticket.ticketId}.pdf`);
    } catch (err) {
      console.error('PDF Generation failed:', err);
      // Fallback to print
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      ref={cardRef}
      className="printable-ticket relative bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden transition-all hover:shadow-xl max-w-md mx-auto"
    >
      {/* Google Stripe */}
      <div className="h-3 flex">
        <div className="h-full flex-1 bg-[#4285F4]"></div>
        <div className="h-full flex-1 bg-[#EA4335]"></div>
        <div className="h-full flex-1 bg-[#FBBC05]"></div>
        <div className="h-full flex-1 bg-[#34A853]"></div>
      </div>

      <div className="p-6">
        {/* Event Header & GDG Branding */}
        <div className="flex items-center justify-between pb-4 border-b border-dashed border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative shrink-0">
              <Image
                src="/img/gdglogo.png"
                alt="GDG Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#4285F4] uppercase block">
                Official Digital Event Pass
              </span>
              <h3 className="text-base font-bold text-gray-900 line-clamp-1">{ticket.eventTitle}</h3>
            </div>
          </div>
          <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" /> CNIC Verified
          </span>
        </div>

        {/* Ticket Details Body */}
        <div className="py-5 grid grid-cols-2 gap-4 border-b border-dashed border-gray-200">
          <div>
            <span className="text-[11px] font-medium text-gray-400 block uppercase">Attendee Name</span>
            <span className="text-sm font-bold text-gray-900 block truncate">{ticket.userName}</span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-gray-400 block uppercase">CNIC Identification</span>
            <span className="text-sm font-mono font-bold text-gray-800 block">{ticket.userCnic}</span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-gray-400 block uppercase">Date & Time</span>
            <div className="text-xs font-semibold text-gray-800 mt-0.5 space-y-0.5">
              <p className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#4285F4]" /> {ticket.eventDate}
              </p>
              <p className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#FBBC05]" /> {ticket.eventTime}
              </p>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-medium text-gray-400 block uppercase">Venue</span>
            <p className="text-xs font-semibold text-gray-800 flex items-start gap-1 mt-0.5 line-clamp-2">
              <MapPin className="w-3 h-3 text-[#EA4335] shrink-0 mt-0.5" /> {ticket.venue}
            </p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="pt-5 flex flex-col items-center justify-center text-center">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-inner mb-3">
            <QRCodeSVG
              value={ticket.qrPayload}
              size={150}
              level="H"
              fgColor="#202124"
              imageSettings={{
                src: '/img/gdglogo.png',
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
          </div>

          <p className="text-xs font-mono font-bold text-gray-600 tracking-wider">
            ID: {ticket.ticketId}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Show this QR code at Pak-China Friendship Centre gate scan point for instant entry
          </p>

          {ticket.carpoolRequested && (
            <span className="mt-3 inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-[#1A73E8] px-3 py-1 rounded-full text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#FBBC05]" /> Carpool Route Pick-up Match Requested
            </span>
          )}

          {/* Action Buttons */}
          <div className="mt-4 print:hidden w-full grid grid-cols-2 gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-bold rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              {isGenerating ? (
                <>Generating PDF...</>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Download PDF Ticket
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md"
            >
              <Printer className="w-4 h-4 text-[#FBBC05]" /> Print Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
