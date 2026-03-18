-- Initial Schema for AI Hotel Assistant
-- Generated for Supabase Persistence Layer

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hotels Table
CREATE TABLE IF NOT EXISTS public.hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    contact_number TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
    guest_id TEXT NOT NULL,
    message TEXT NOT NULL,
    sender TEXT CHECK (sender IN ('guest', 'ai')) NOT NULL,
    language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Booking Requests Table
CREATE TABLE IF NOT EXISTS public.booking_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
    guest_id TEXT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests_count INTEGER NOT NULL DEFAULT 1,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending' NOT NULL,
    total_price DECIMAL(12, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public Read Hotels" ON public.hotels FOR SELECT USING (true);
CREATE POLICY "Public Insert Conversations" ON public.conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Conversations" ON public.conversations FOR SELECT USING (true);
CREATE POLICY "Public Insert Bookings" ON public.booking_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Bookings" ON public.booking_requests FOR SELECT USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_hotel_id ON public.conversations(hotel_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_hotel_id ON public.booking_requests(hotel_id);