import React from 'react';
import { Hotel, Message, BookingRequest } from '../types';

interface AppContextType {
  currentHotel: Hotel | null;
  setCurrentHotel: (hotel: Hotel | null) => void;
  hotels: Hotel[];
  setHotels: React.Dispatch<React.SetStateAction<Hotel[]>>;
  bookings: BookingRequest[];
  setBookings: React.Dispatch<React.SetStateAction<BookingRequest[]>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentHotel, setCurrentHotel] = React.useState<Hotel | null>(null);
  const [hotels, setHotels] = React.useState<Hotel[]>([
    {
      id: '1',
      name: 'Abyssinia Grand',
      location: 'Addis Ababa, Bole',
      contactEmail: 'contact@abyssinia.com',
      phone: '+251911223344',
      description: 'Luxury hotel in the heart of the city.',
      amenities: ['Spa', 'Pool', 'Free WiFi', 'Gym'],
      status: 'active'
    }
  ]);
  const [bookings, setBookings] = React.useState<BookingRequest[]>([
    {
      id: 'b1',
      hotelId: '1',
      guestName: 'John Doe',
      checkIn: '2024-06-15',
      checkOut: '2024-06-20',
      guests: 2,
      status: 'pending',
      timestamp: new Date().toISOString()
    }
  ]);
  const [messages, setMessages] = React.useState<Message[]>([]);

  return (
    <AppContext.Provider value={{ 
      currentHotel, setCurrentHotel, 
      hotels, setHotels,
      bookings, setBookings,
      messages, setMessages
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = React.useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};