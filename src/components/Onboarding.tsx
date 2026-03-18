import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Mail, Phone, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';

export const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const { setHotels } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    email: '',
    phone: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      const newHotel = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        contactEmail: formData.email,
        amenities: ['Free WiFi', 'Room Service'],
        status: 'pending' as const
      };
      setHotels(prev => [...prev, newHotel]);
      toast.success("Hotel Registered Successfully!");
      onComplete();
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Register Your Hotel</h1>
        <p className="text-slate-600">Join the Aura AI network and automate your guest relations.</p>
        
        <div className="flex justify-center mt-8 gap-4">
          {[1, 2].map(s => (
            <div 
              key={s} 
              className={`h-2 w-16 rounded-full ${s <= step ? 'bg-indigo-600' : 'bg-slate-200'}`}
            />
          ))}
        </div>
      </div>

      <motion.form 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
      >
        {step === 1 ? (
          <div className="space-y-6">
            <div className="grid gap-4">
              <Label htmlFor="name">Hotel Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 text-slate-400" size={18} />
                <Input 
                  id="name" 
                  required
                  className="pl-10" 
                  placeholder="e.g. Skyline Luxury Resort" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                <Input 
                  id="location" 
                  required
                  className="pl-10" 
                  placeholder="e.g. Addis Ababa, Bole"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-4">
                <Label htmlFor="email">Contact Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <Input 
                    id="email" 
                    type="email"
                    required
                    className="pl-10" 
                    placeholder="manager@hotel.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-4">
                <Label htmlFor="phone">WhatsApp Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                  <Input 
                    id="phone" 
                    required
                    className="pl-10" 
                    placeholder="+251 ..."
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4">
              <Label htmlFor="desc">Hotel Description</Label>
              <div className="relative">
                <Info className="absolute left-3 top-3 text-slate-400" size={18} />
                <Textarea 
                  id="desc" 
                  className="pl-10 min-h-[150px]" 
                  placeholder="Tell us about your rooms, services, and what makes you unique..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-xl flex gap-4 items-start">
              <CheckCircle2 className="text-indigo-600 shrink-0" size={24} />
              <p className="text-sm text-indigo-900">
                By completing registration, our AI will begin learning your hotel details to assist your guests in both English and Amharic.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <Button type="submit" className="ml-auto bg-indigo-600 hover:bg-indigo-700">
            {step === 2 ? 'Complete Setup' : 'Next Step'}
          </Button>
        </div>
      </motion.form>
    </div>
  );
};