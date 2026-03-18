import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';

interface FormErrors {
  name?: string;
  location?: string;
  email?: string;
  phone?: string;
  description?: string;
}

export const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const { onboardHotel } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    email: '',
    phone: '',
    description: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((name: string, value: string) => {
    let error = '';
    const trimmedValue = value.trim();
    
    switch (name) {
      case 'name':
        if (!trimmedValue) {
          error = 'Hotel name is required.';
        } else if (trimmedValue.length < 3) {
          error = 'Hotel name must be at least 3 characters long.';
        } else if (trimmedValue.length > 100) {
          error = 'Hotel name cannot exceed 100 characters.';
        }
        break;
      case 'location':
        if (!trimmedValue) {
          error = 'Location is required.';
        } else if (trimmedValue.length < 5) {
          error = 'Please enter a more descriptive location (at least 5 characters).';
        }
        break;
      case 'email':
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!trimmedValue) {
          error = 'Email address is required.';
        } else if (!emailRegex.test(trimmedValue)) {
          error = 'Please enter a valid email address (e.g., info@hotel.com).';
        }
        break;
      case 'phone':
        // Standard E.164 format or simple digit-based format
        const phoneRegex = /^\+?[0-9\s-]{9,20}$/;
        if (!trimmedValue) {
          error = 'WhatsApp number is required.';
        } else if (!phoneRegex.test(trimmedValue.replace(/\s/g, ''))) {
          error = 'Enter a valid phone number (e.g., +251 911 111111).';
        }
        break;
      case 'description':
        if (!trimmedValue) {
          error = 'Description is required.';
        } else if (trimmedValue.length < 30) {
          error = `Description is too short. Please add ${30 - trimmedValue.length} more characters.`;
        } else if (trimmedValue.length > 3000) {
          error = 'Description is too long. Please keep it under 3000 characters.';
        }
        break;
      default:
        break;
    }
    
    return error;
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const fieldName = id === 'desc' ? 'description' : id;
    
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    setServerError(null); // Clear server error on input change
    
    // Immediate validation feedback as user types
    const error = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const fieldName = id === 'desc' ? 'description' : id;
    
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleNextStep = () => {
    const step1Errors: FormErrors = {
      name: validateField('name', formData.name),
      location: validateField('location', formData.location),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
    };

    setErrors(prev => ({ ...prev, ...step1Errors }));
    setTouched({ name: true, location: true, email: true, phone: true });

    const hasErrors = Object.values(step1Errors).some(err => !!err);
    if (!hasErrors) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error("Please fill in all required fields correctly.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const descError = validateField('description', formData.description);
    if (descError) {
      setErrors(prev => ({ ...prev, description: descError }));
      setTouched(prev => ({ ...prev, description: true }));
      toast.error("Please provide a valid description.");
      return;
    }

    setLoading(true);
    setServerError(null);
    
    try {
      await onboardHotel({
        name: formData.name,
        location: formData.location,
        contactEmail: formData.email,
        phone: formData.phone,
        description: formData.description,
        amenities: ['Free WiFi', 'Room Service', 'Air Conditioning', 'Pool'],
      });
      toast.success("Hotel Registered Successfully!");
      onComplete();
    } catch (error: any) {
      const errorMsg = error.message || "Registration failed. Please try again.";
      setServerError(errorMsg);
      toast.error(errorMsg);
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (fieldName: keyof FormErrors) => {
    if (!touched[fieldName]) return 'text-slate-400';
    return errors[fieldName] ? 'text-red-500' : 'text-green-500';
  };

  const getInputStyles = (fieldName: keyof FormErrors) => {
    if (!touched[fieldName]) return 'focus-visible:ring-indigo-500';
    return errors[fieldName] 
      ? 'border-red-300 focus-visible:ring-red-500' 
      : 'border-green-300 focus-visible:ring-green-500';
  };

  const ErrorDisplay = ({ message }: { message?: string }) => (
    <AnimatePresence mode="wait">
      {message && (
        <motion.p 
          initial={{ opacity: 0, height: 0, y: -5 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -5 }}
          className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium"
        >
          <AlertCircle size={12} className="shrink-0" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Onboard Your Hotel</h1>
          <p className="text-slate-600 text-lg">Create your custom AI concierge in minutes.</p>
        </motion.div>
        
        <div className="flex justify-center mt-10 gap-3">
          {[1, 2].map(s => (
            <div 
              key={s} 
              className={`h-2.5 w-24 rounded-full transition-all duration-500 ${s <= step ? 'bg-indigo-600' : 'bg-slate-200'}`}
            />
          ))}
        </div>
      </div>

      <motion.form 
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={handleSubmit}
        className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl border border-slate-100 relative overflow-hidden"
      >
        {/* Subtle Progress bar on top of the card */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50">
          <motion.div 
            className="h-full bg-indigo-600"
            initial={{ width: '50%' }}
            animate={{ width: step === 1 ? '50%' : '100%' }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3 items-start text-red-700 text-sm shadow-sm"
            >
              <AlertTriangle className="shrink-0 mt-0.5" size={20} />
              <div className="space-y-1">
                <p className="font-bold">Registration Error</p>
                <p className="leading-relaxed">{serverError}</p>
              </div>
            </motion.div>
          )}

          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="name" className="font-bold text-slate-700">Hotel Name</Label>
                  {touched.name && !errors.name && <span className="text-green-600 text-[10px] font-bold uppercase tracking-wider">Valid</span>}
                </div>
                <div className="relative">
                  <Building2 className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${getStatusColor('name')}`} size={20} />
                  <Input 
                    id="name" 
                    className={`pl-12 h-14 rounded-2xl transition-all border-2 text-base ${getInputStyles('name')}`}
                    placeholder="Skyline Luxury Hotel"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                </div>
                <ErrorDisplay message={errors.name} />
              </div>

              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="location" className="font-bold text-slate-700">Location</Label>
                  {touched.location && !errors.location && <span className="text-green-600 text-[10px] font-bold uppercase tracking-wider">Valid</span>}
                </div>
                <div className="relative">
                  <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${getStatusColor('location')}`} size={20} />
                  <Input 
                    id="location" 
                    className={`pl-12 h-14 rounded-2xl transition-all border-2 text-base ${getInputStyles('location')}`}
                    placeholder="Addis Ababa, Bole Area"
                    value={formData.location}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                </div>
                <ErrorDisplay message={errors.location} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="email" className="font-bold text-slate-700">Contact Email</Label>
                    {touched.email && !errors.email && <span className="text-green-600 text-[10px] font-bold uppercase tracking-wider">Valid</span>}
                  </div>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${getStatusColor('email')}`} size={20} />
                    <Input 
                      id="email" 
                      type="email"
                      className={`pl-12 h-14 rounded-2xl transition-all border-2 text-base ${getInputStyles('email')}`}
                      placeholder="admin@skyline.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <ErrorDisplay message={errors.email} />
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="phone" className="font-bold text-slate-700">WhatsApp Number</Label>
                    {touched.phone && !errors.phone && <span className="text-green-600 text-[10px] font-bold uppercase tracking-wider">Valid</span>}
                  </div>
                  <div className="relative">
                    <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${getStatusColor('phone')}`} size={20} />
                    <Input 
                      id="phone" 
                      className={`pl-12 h-14 rounded-2xl transition-all border-2 text-base ${getInputStyles('phone')}`}
                      placeholder="+251 911..."
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <ErrorDisplay message={errors.phone} />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <div className="grid gap-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="desc" className="font-bold text-slate-700 text-xl">AI Training Source (Description)</Label>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${formData.description.length < 30 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                    {formData.description.length} chars
                  </span>
                </div>
                <div className="relative">
                  <Info className={`absolute left-4 top-5 transition-colors ${getStatusColor('description')}`} size={20} />
                  <Textarea 
                    id="desc" 
                    className={`pl-12 min-h-[220px] rounded-[1.5rem] transition-all border-2 text-base leading-relaxed p-4 resize-none ${getInputStyles('description')}`} 
                    placeholder="Provide details about your rooms, dining, check-in policies, and amenities. The AI will learn from this text to assist your guests in English and Amharic."
                    value={formData.description}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                </div>
                <ErrorDisplay message={errors.description} />
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-indigo-50/50 rounded-3xl flex gap-4 items-start border border-indigo-100/50"
              >
                <div className="bg-indigo-600 p-2 rounded-xl shrink-0">
                  <CheckCircle2 className="text-white" size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-indigo-900 mb-1">Pro Tip for AI Quality</h4>
                  <p className="text-sm text-indigo-800/80 leading-relaxed">
                    Mention specific room prices, breakfast hours, and shuttle services. A descriptive profile reduces manual support requests by up to 60%.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-between gap-6">
          <div className="w-32">
            {step > 1 && (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setStep(1)}
                className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center gap-2 h-14 rounded-2xl w-full"
              >
                <ArrowLeft size={20} />
                Back
              </Button>
            )}
          </div>
          
          {step === 1 ? (
            <Button 
              type="button" 
              onClick={handleNextStep}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 h-14 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-2 text-lg font-bold flex-1 md:flex-none"
            >
              Next Step
              <ArrowRight size={20} />
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 h-14 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 text-lg font-bold flex-1 md:flex-none"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Finalizing...
                </span>
              ) : (
                'Launch AI Agent'
              )}
            </Button>
          )}
        </div>
      </motion.form>
    </div>
  );
};