'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, GDGEvent, Ticket, CarpoolPin, Role, ChatMessage } from './types';
import { INITIAL_EVENTS, INITIAL_CARPOOL_PINS, DEMO_USERS } from './mock-data';
import { db } from './firebase';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  query
} from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  role: Role;
  loginWithCNIC: (cnic: string, name?: string, email?: string, phone?: string) => boolean;
  switchDemoRole: (role: Role) => void;
  logout: () => void;
  events: GDGEvent[];
  tickets: Ticket[];
  carpoolPins: CarpoolPin[];
  registerForEvent: (eventId: string, requestCarpool?: boolean) => Ticket | null;
  addCarpoolPin: (pinData: Omit<CarpoolPin, 'id' | 'userId' | 'userName' | 'userCnic' | 'createdAt'>) => Promise<CarpoolPin>;
  deleteCarpoolPin: (id: string) => Promise<void>;
  verifyTicketQR: (qrPayload: string) => { success: boolean; ticket?: Ticket; message: string };
  addNewEvent: (eventData: Omit<GDGEvent, 'id' | 'registeredCount'>) => Promise<GDGEvent>;
  sendChatMessage: (carpoolId: string, text: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(DEMO_USERS.USER);
  const [events, setEvents] = useState<GDGEvent[]>(INITIAL_EVENTS);
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      ticketId: 'TKT-GDG-881923',
      eventId: 'gdg-cloud-summit-2026',
      eventTitle: 'GDG Cloud Islamabad Summit 2026',
      eventDate: 'Saturday, September 26, 2026',
      eventTime: '09:00 AM - 05:00 PM PKT',
      venue: 'Pak-China Friendship Centre, Garden Avenue, Islamabad',
      userCnic: '61101-7788990-1',
      userName: 'Sarmad Gardezi',
      userEmail: 'sarmad.developer@gdg.community',
      qrPayload: 'GDG-SUMMIT-61101-7788990-1-TKT-881923',
      registeredAt: new Date().toISOString(),
      isCheckedIn: false,
      carpoolRequested: true
    }
  ]);
  const [carpoolPins, setCarpoolPins] = useState<CarpoolPin[]>(INITIAL_CARPOOL_PINS);

  // Sync Live Data from Firestore
  useEffect(() => {
    // 1. Carpools & Chat
    const carpoolsQuery = query(collection(db, 'carpool_pins'));
    const unsubscribeCarpools = onSnapshot(carpoolsQuery, (snapshot) => {
      if (!snapshot.empty) {
        const livePins: CarpoolPin[] = [];
        snapshot.forEach((docSnap) => {
          livePins.push({ id: docSnap.id, ...docSnap.data() } as CarpoolPin);
        });
        setCarpoolPins(livePins);
      }
    }, (err) => console.log('Firestore carpool subscription note:', err.message));

    // 2. Events
    const eventsQuery = query(collection(db, 'events'));
    const unsubscribeEvents = onSnapshot(eventsQuery, (snapshot) => {
      if (!snapshot.empty) {
        const liveEvents: GDGEvent[] = [];
        snapshot.forEach((docSnap) => {
          liveEvents.push({ id: docSnap.id, ...docSnap.data() } as GDGEvent);
        });
        setEvents(liveEvents);
      }
    }, (err) => console.log('Firestore events subscription note:', err.message));

    // 3. Tickets
    const ticketsQuery = query(collection(db, 'tickets'));
    const unsubscribeTickets = onSnapshot(ticketsQuery, (snapshot) => {
      if (!snapshot.empty) {
        const liveTickets: Ticket[] = [];
        snapshot.forEach((docSnap) => {
          liveTickets.push({ ticketId: docSnap.id, ...docSnap.data() } as Ticket);
        });
        setTickets(liveTickets);
      }
    }, (err) => console.log('Firestore tickets subscription note:', err.message));

    return () => {
      unsubscribeCarpools();
      unsubscribeEvents();
      unsubscribeTickets();
    };
  }, []);

  const loginWithCNIC = (cnic: string, name?: string, email?: string, phone?: string): boolean => {
    const formattedCNIC = cnic.trim();
    if (!/^\d{5}-\d{7}-\d{1}$/.test(formattedCNIC) && !/^\d{13}$/.test(formattedCNIC)) {
      return false;
    }
    
    let normalized = formattedCNIC;
    if (/^\d{13}$/.test(formattedCNIC)) {
      normalized = `${formattedCNIC.slice(0, 5)}-${formattedCNIC.slice(5, 12)}-${formattedCNIC.slice(12)}`;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || `Community Member (${normalized.slice(-4)})`,
      cnic: normalized,
      email: email || `user.${normalized.replace(/-/g, '')}@community.dev`,
      phone: phone || '0300-0000000',
      role: 'USER',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${normalized}`,
      registeredEvents: [],
      carpoolOptIn: false
    };

    setUser(newUser);
    try {
      setDoc(doc(db, 'users', newUser.id), newUser, { merge: true });
    } catch (e) {
      console.log('Firebase user save fallback:', e);
    }
    return true;
  };

  const switchDemoRole = (targetRole: Role) => {
    setUser(DEMO_USERS[targetRole]);
  };

  const logout = () => {
    setUser(null);
  };

  const registerForEvent = (eventId: string, requestCarpool = false): Ticket | null => {
    if (!user) return null;
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return null;

    const existingTicket = tickets.find((t) => t.eventId === eventId && t.userCnic === user.cnic);
    if (existingTicket) return existingTicket;

    const ticketId = `TKT-GDG-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTicket: Ticket = {
      ticketId,
      eventId: targetEvent.id,
      eventTitle: targetEvent.title,
      eventDate: targetEvent.date,
      eventTime: targetEvent.time,
      venue: targetEvent.venue,
      userCnic: user.cnic,
      userName: user.name,
      userEmail: user.email,
      qrPayload: `GDG-EVENT-${eventId}-${user.cnic}-${Date.now()}`,
      registeredAt: new Date().toISOString(),
      isCheckedIn: false,
      carpoolRequested: requestCarpool
    };

    setTickets((prev) => [newTicket, ...prev]);
    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, registeredCount: ev.registeredCount + 1 } : ev))
    );
    setUser((prev) =>
      prev ? { ...prev, registeredEvents: [...prev.registeredEvents, eventId] } : null
    );

    try {
      setDoc(doc(db, 'tickets', ticketId), newTicket);
    } catch (err) {
      console.log('Firebase write ticket fallback:', err);
    }

    return newTicket;
  };

  const addCarpoolPin = async (
    pinData: Omit<CarpoolPin, 'id' | 'userId' | 'userName' | 'userCnic' | 'createdAt'>
  ): Promise<CarpoolPin> => {
    const pinId = `cp-${Date.now()}`;
    const newPin: CarpoolPin = {
      ...pinData,
      id: pinId,
      userId: user?.id || 'anon',
      userName: user?.name || 'Community Member',
      userCnic: user?.cnic || 'CNIC Verified',
      createdAt: new Date().toISOString().split('T')[0],
      messages: []
    };

    setCarpoolPins((prev) => [newPin, ...prev]);

    try {
      await setDoc(doc(db, 'carpool_pins', pinId), newPin);
    } catch (e) {
      console.log('Firebase save carpool pin fallback:', e);
    }

    return newPin;
  };

  const deleteCarpoolPin = async (id: string) => {
    setCarpoolPins((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteDoc(doc(db, 'carpool_pins', id));
    } catch (e) {
      console.log('Firebase delete carpool fallback:', e);
    }
  };

  const verifyTicketQR = (qrPayload: string) => {
    const ticketIndex = tickets.findIndex((t) => t.qrPayload === qrPayload || t.ticketId === qrPayload);
    if (ticketIndex === -1) {
      return { success: false, message: 'Invalid or Unrecognized Ticket QR Code' };
    }

    const ticket = tickets[ticketIndex];
    if (ticket.isCheckedIn) {
      return { success: false, ticket, message: `Ticket Already Checked In at ${ticket.checkedInAt}` };
    }

    const updatedTicket = {
      ...ticket,
      isCheckedIn: true,
      checkedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTickets((prev) => prev.map((t, idx) => (idx === ticketIndex ? updatedTicket : t)));

    try {
      updateDoc(doc(db, 'tickets', ticket.ticketId), {
        isCheckedIn: true,
        checkedInAt: updatedTicket.checkedInAt
      });
    } catch (err) {
      console.log('Firebase update check-in fallback:', err);
    }

    return { success: true, ticket: updatedTicket, message: 'Check-in Verified Successfully!' };
  };

  const addNewEvent = async (eventData: Omit<GDGEvent, 'id' | 'registeredCount'>): Promise<GDGEvent> => {
    const eventId = `event-${Date.now()}`;
    const newEv: GDGEvent = {
      ...eventData,
      id: eventId,
      registeredCount: 0
    };
    setEvents((prev) => [newEv, ...prev]);

    try {
      await setDoc(doc(db, 'events', eventId), newEv);
    } catch (e) {
      console.log('Firebase add event fallback:', e);
    }

    return newEv;
  };

  const sendChatMessage = async (carpoolId: string, text: string) => {
    if (!user || !text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      carpoolId,
      senderId: user.id,
      senderName: user.name,
      senderCnic: user.cnic,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const targetPin = carpoolPins.find((p) => p.id === carpoolId);
    if (!targetPin) return;

    const updatedMessages = [...(targetPin.messages || []), newMsg];

    setCarpoolPins((prev) =>
      prev.map((p) => (p.id === carpoolId ? { ...p, messages: updatedMessages } : p))
    );

    try {
      await updateDoc(doc(db, 'carpool_pins', carpoolId), {
        messages: updatedMessages
      });
    } catch (e) {
      console.log('Firebase send message fallback:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'USER',
        loginWithCNIC,
        switchDemoRole,
        logout,
        events,
        tickets,
        carpoolPins,
        registerForEvent,
        addCarpoolPin,
        deleteCarpoolPin,
        verifyTicketQR,
        addNewEvent,
        sendChatMessage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
