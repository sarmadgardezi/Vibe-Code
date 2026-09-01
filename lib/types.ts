export type Role = 'USER' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  cnic: string;
  email: string;
  phone: string;
  role: Role;
  avatar: string;
  registeredEvents: string[];
  carpoolOptIn: boolean;
  carpoolLocation?: {
    lat: number;
    lng: number;
    addressName: string;
    seatsAvailable: number;
    time: string;
    contactNumber: string;
    notes?: string;
  };
}

export interface GDGEvent {
  id: string;
  title: string;
  tagline: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: 'Cloud' | 'AI / ML' | 'Mobile / Flutter' | 'Web' | 'Hackathon';
  status: 'Upcoming' | 'Past';
  registrationType: 'Free registration' | 'External registration';
  capacity: number;
  registeredCount: number;
  bannerImg: string;
  speakers: {
    name: string;
    role: string;
    avatar: string;
    company: string;
  }[];
}

export interface Ticket {
  ticketId: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  userCnic: string;
  userName: string;
  userEmail: string;
  qrPayload: string;
  registeredAt: string;
  isCheckedIn: boolean;
  checkedInAt?: string;
  carpoolRequested?: boolean;
}

export interface ChatMessage {
  id: string;
  carpoolId: string;
  senderId: string;
  senderName: string;
  senderCnic: string;
  text: string;
  timestamp: string;
}

export interface CarpoolPin {
  id: string;
  userId: string;
  userName: string;
  userCnic: string;
  phone: string;
  lat: number;
  lng: number;
  areaName: string;
  seats: number;
  departureTime: string;
  vehicleInfo: string;
  genderPreference: 'Anyone' | 'Male Only' | 'Female Only';
  note: string;
  createdAt: string;
  messages?: ChatMessage[];
}
