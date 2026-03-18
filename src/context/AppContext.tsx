import React, { useEffect } from 'react';
import { Hotel, Message, BookingRequest } from '../types';
import { backendService } from '../services/backendService';

interface AppContextType {
  currentHotel: Hotel | null;
  setCurrentHotel: (hotel: Hotel | null) => void;
  hotels: Hotel[];
  setHotels: React.Dispatch<React.SetStateAction<Hotel[]>>;
  bookings: BookingRequest[];
  setBookings: React.Dispatch<React.SetStateAction<BookingRequest[]>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onboardHotel: (hotelData: any) => Promise<void>;
  sendMessage: (hotelId: string, guestId: string, text: string) => Promise<void>;
  loadHotelRequests: (hotelId: string) => Promise<void>;
}

export const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentHotel, setCurrentHotel] = React.useState<Hotel | null>(null);
  const [hotels, setHotels] = React.useState<Hotel[]>([]);
  const [bookings, setBookings] = React.useState<BookingRequest[]>([]);
  const [messages, setMessages] = React.useState<Message[]>([]);

  // Initial Data Loading
  useEffect(() => {
    async function init() {
      try {
        const fetchedHotels = await backendService.getHotels();
        setHotels(fetchedHotels);
      } catch (err) {
        console.error('Error fetching hotels:', err);
      }
    }
    init();
  }, []);

  // Onboard Hotel
  const onboardHotel = async (hotelData: any) => {
    const newHotel = await backendService.onboardHotel(hotelData);
    setHotels(prev => [...prev, newHotel]);
  };

  // Send Message and handle AI response
  const sendMessage = async (hotelId: string, guestId: string, text: string) => {
    // Optimistic guest message
    const guestMsg: Message = {
      id: Math.random().toString(),
      hotelId,
      sender: 'guest',
      text,
      language: 'en', // Backend detects it
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, guestMsg]);

    const aiMsg = await backendService.handleGuestMessage(hotelId, guestId, text);
    setMessages(prev => [...prev, aiMsg]);
  };

  // Load requests for a hotel
  const loadHotelRequests = async (hotelId: string) => {
    const fetchedBookings = await backendService.getHotelRequests(hotelId);
    setBookings(fetchedBookings);
  };

  return (
    <AppContext.Provider value={{ 
      currentHotel, setCurrentHotel, 
      hotels, setHotels,
      bookings, setBookings,
      messages, setMessages,
      onboardHotel,
      sendMessage,
      loadHotelRequests
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