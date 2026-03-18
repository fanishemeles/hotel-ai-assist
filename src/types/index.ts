export interface Hotel {
  id: string;
  name: string;
  location: string;
  contactEmail: string;
  phone: string;
  description: string;
  amenities: string[];
  status: 'active' | 'pending';
}

export interface BookingRequest {
  id: string;
  hotelId: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  timestamp: string;
}

export interface Message {
  id: string;
  hotelId: string;
  sender: 'guest' | 'ai';
  text: string;
  language: 'en' | 'am';
  timestamp: string;
}

export type AppView = 'landing' | 'onboarding' | 'dashboard' | 'chat_demo';