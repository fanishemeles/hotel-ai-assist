import { supabase } from '../lib/supabaseClient';
import { Hotel, Message, BookingRequest } from '../types';

export const backendService = {
  // --- Hotel Onboarding ---
  async onboardHotel(hotelData: Omit<Hotel, 'id' | 'status'>) {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .insert([
          {
            name: hotelData.name,
            location: hotelData.location,
            description: hotelData.description,
            contact_number: hotelData.phone,
            email: hotelData.contactEmail,
            amenities: hotelData.amenities,
          },
        ])
        .select()
        .single();

      if (error) {
        throw this._parseSupabaseError(error);
      }

      // Map database fields to application Hotel type
      return {
        id: data.id,
        name: data.name,
        location: data.location,
        description: data.description,
        phone: data.contact_number,
        contactEmail: data.email,
        amenities: data.amenities || [],
        status: 'active'
      } as Hotel;
    } catch (error: any) {
      console.error('Onboarding Error:', error);
      // Re-throw either the parsed error or a new generic one
      throw error instanceof Error ? error : new Error(error.message || 'An unexpected error occurred during registration.');
    }
  },

  // --- Fetch Hotels ---
  async getHotels() {
    const { data, error } = await supabase
      .from('hotels')
      .select('*');

    if (error) throw error;
    return data.map(h => ({
      id: h.id,
      name: h.name,
      location: h.location,
      description: h.description,
      phone: h.contact_number,
      contactEmail: h.email,
      amenities: h.amenities || [],
      status: 'active'
    })) as Hotel[];
  },

  // --- Guest Chat System ---
  async handleGuestMessage(hotelId: string, guestId: string, text: string) {
    // 1. Save guest message
    const { error: guestMsgErr } = await supabase
      .from('conversations')
      .insert({
        hotel_id: hotelId,
        guest_id: guestId,
        message: text,
        sender: 'guest',
        language: this._detectLanguage(text)
      });

    if (guestMsgErr) throw guestMsgErr;

    // 2. Generate AI Response (Simulated or via Edge Function)
    const aiResponseText = await this._getAIResponse(text, hotelId);

    // 3. Save AI message
    const { data: aiMsg, error: aiMsgErr } = await supabase
      .from('conversations')
      .insert({
        hotel_id: hotelId,
        guest_id: guestId,
        message: aiResponseText,
        sender: 'ai',
        language: this._detectLanguage(aiResponseText)
      })
      .select()
      .single();

    if (aiMsgErr) throw aiMsgErr;

    return {
      id: aiMsg.id,
      hotelId: aiMsg.hotel_id,
      sender: aiMsg.sender as 'ai',
      text: aiMsg.message,
      language: aiMsg.language as 'en' | 'am',
      timestamp: aiMsg.created_at
    } as Message;
  },

  async getMessages(hotelId: string, guestId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('hotel_id', hotelId)
      .eq('guest_id', guestId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data.map(m => ({
      id: m.id,
      hotelId: m.hotel_id,
      sender: m.sender as 'guest' | 'ai',
      text: m.message,
      language: m.language as 'en' | 'am',
      timestamp: m.created_at
    })) as Message[];
  },

  // --- Booking Flow ---
  async createBookingRequest(bookingData: Omit<BookingRequest, 'id' | 'status' | 'timestamp'>) {
    const { data, error } = await supabase
      .from('booking_requests')
      .insert({
        hotel_id: bookingData.hotelId,
        guest_id: 'guest_session', // Use a real identifier in prod
        check_in: bookingData.checkIn,
        check_out: bookingData.checkOut,
        guests_count: bookingData.guests,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      hotelId: data.hotel_id,
      guestName: 'Guest', // From session or profile
      checkIn: data.check_in,
      checkOut: data.check_out,
      guests: data.guests_count,
      status: data.status,
      timestamp: data.created_at
    } as BookingRequest;
  },

  // --- Admin Dashboard ---
  async getHotelRequests(hotelId: string) {
    const { data, error } = await supabase
      .from('booking_requests')
      .select('*')
      .eq('hotel_id', hotelId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(b => ({
      id: b.id,
      hotelId: b.hotel_id,
      guestName: 'Guest',
      checkIn: b.check_in,
      checkOut: b.check_out,
      guests: b.guests_count,
      status: b.status as 'pending' | 'confirmed' | 'cancelled',
      timestamp: b.created_at
    })) as BookingRequest[];
  },

  // --- Internal Helpers ---
  _detectLanguage(text: string): 'en' | 'am' {
    // Simple detection: check for Ethiopic characters
    const amharicRegex = /[\u1200-\u137F]/;
    return amharicRegex.test(text) ? 'am' : 'en';
  },

  async _getAIResponse(text: string, hotelId: string): Promise<string> {
    const isAmharic = this._detectLanguage(text) === 'am';
    
    // Simulate AI response logic
    if (text.toLowerCase().includes('book') || text.toLowerCase().includes('መያዝ')) {
      return isAmharic 
        ? 'በደስታ እረዳዎታለሁ። እባክዎን የመግቢያ እና የመውጫ ቀናትን ይንገሩኝ?' 
        : 'I would be happy to help you book. Please provide your check-in and check-out dates?';
    }

    return isAmharic 
      ? 'እንኳን ወደ ሆቴላችን በሰላም መጡ። በምን ልርዳዎት እችላለሁ?' 
      : 'Welcome to our hotel. How can I help you today?';
  },

  _parseSupabaseError(error: any): Error {
    // 23505 = Unique constraint violation
    if (error.code === '23505') {
      if (error.message?.includes('email')) {
        return new Error('This email address is already registered. Please use a different one or contact support.');
      }
      if (error.message?.includes('name')) {
        return new Error('A hotel with this name is already registered. If this is your hotel, please contact our support team.');
      }
      return new Error('A record with these details already exists.');
    }

    // 42P01 = Undefined table (migration issues)
    if (error.code === '42P01') {
      return new Error('Database system error. Please try again in a few minutes.');
    }

    // 28P01 = Invalid authorization (security policy issues)
    if (error.code === '28P01' || error.status === 403) {
      return new Error('Permission denied. Please check your credentials or contact administrator.');
    }

    // Network or server issues
    if (error.message === 'Failed to fetch') {
      return new Error('Could not connect to the server. Please check your internet connection.');
    }

    return new Error(error.message || 'An error occurred while saving your data. Please try again.');
  }
};