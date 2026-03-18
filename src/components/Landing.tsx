import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Globe, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Landing = ({ onStart, onDemo }: { onStart: () => void, onDemo: () => void }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">A</div>
          <span className="text-2xl font-black tracking-tight text-slate-900">AURA AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
          <a href="#" className="hover:text-indigo-600">Product</a>
          <a href="#" className="hover:text-indigo-600">Features</a>
          <a href="#" className="hover:text-indigo-600">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="font-semibold" onClick={onDemo}>Try Demo</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full px-6" onClick={onStart}>
            Register Hotel
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-medium text-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              Empowering Ethiopian Hospitality
            </div>
            <h1 className="text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6">
              Your Hotel's AI <span className="text-indigo-600">Concierge</span> on WhatsApp.
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              Automate guest inquiries, handle bookings, and provide 24/7 support in English and Amharic. All through a simple WhatsApp interface.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 h-14 px-8 text-lg rounded-full" onClick={onStart}>
                Get Started for Free <ArrowRight className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-slate-200" onClick={onDemo}>
                See AI in Action
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/5ca432dc-01a9-4adf-98cf-b96b4469c439/hero-image-e18c341d-1773841423597.webp" 
              alt="Aura AI Interface"
              className="rounded-3xl shadow-2xl relative z-10 w-full"
            />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-60" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-60" />
          </motion.div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <FeatureCard 
            icon={Globe}
            title="Bilingual Support"
            description="Native support for Amharic and English, allowing your guests to communicate in the language they're most comfortable with."
          />
          <FeatureCard 
            icon={Bot}
            title="Intelligent Bookings"
            description="AI guides guests through the entire booking process, collecting dates and details before handing off to your team."
          />
          <FeatureCard 
            icon={Zap}
            title="Instant Responses"
            description="No more waiting for front-desk replies. Aura AI answers frequently asked questions instantly, 24/7."
          />
        </div>
      </main>

      {/* Social Proof */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Trusted by Leading Hotels</h2>
            <div className="flex justify-center gap-12 opacity-50 grayscale">
              {/* Mock logos */}
              <span className="text-2xl font-bold">ABYSSINIA</span>
              <span className="text-2xl font-bold">SKYLINE</span>
              <span className="text-2xl font-bold">HERITAGE</span>
              <span className="text-2xl font-bold">NILE VIEW</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/5ca432dc-01a9-4adf-98cf-b96b4469c439/hotel-1-95fd239e-1773841423573.webp" 
              className="rounded-2xl shadow-lg h-64 w-full object-cover"
              alt="Hotel 1"
            />
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/5ca432dc-01a9-4adf-98cf-b96b4469c439/hotel-2-900442b4-1773841423661.webp" 
              className="rounded-2xl shadow-lg h-64 w-full object-cover"
              alt="Hotel 2"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="p-8 rounded-3xl border border-slate-100 bg-white hover:shadow-xl transition-shadow duration-300">
    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);