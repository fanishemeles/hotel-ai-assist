import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  MessageSquare, 
  CalendarCheck, 
  Settings, 
  LogOut,
  TrendingUp,
  Users,
  Check,
  X,
  Bell
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export const Dashboard = () => {
  const { hotels, bookings, setBookings } = useApp();
  const hotel = hotels[0]; // Simulation: logged in as first hotel

  const handleStatus = (id: string, status: 'confirmed' | 'cancelled') => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    toast.success(`Booking ${status}!`);
  };

  const stats = [
    { label: 'Total Requests', value: bookings.length, icon: CalendarCheck, color: 'text-blue-600' },
    { label: 'Active Chats', value: '12', icon: MessageSquare, color: 'text-green-600' },
    { label: 'New Guests', value: '45', icon: Users, color: 'text-purple-600' },
    { label: 'Conversion Rate', value: '68%', icon: TrendingUp, color: 'text-orange-600' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
          <span className="text-xl font-bold">Aura Admin</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={LayoutDashboard} label="Overview" active />
          <NavItem icon={MessageSquare} label="Conversations" />
          <NavItem icon={CalendarCheck} label="Bookings" />
          <NavItem icon={Settings} label="Hotel Settings" />
        </nav>

        <Button variant="ghost" className="justify-start gap-3 text-slate-500 hover:text-red-600">
          <LogOut size={20} /> Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back, {hotel.name}</h1>
            <p className="text-slate-500">Here is what's happening today.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300" />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{s.label}</p>
                    <h3 className="text-2xl font-bold mt-1">{s.value}</h3>
                  </div>
                  <div className={`p-2 rounded-lg bg-slate-50 ${s.color}`}>
                    <s.icon size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Booking Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Booking Requests</CardTitle>
                <Button variant="link" className="text-indigo-600">View all</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Users size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{booking.guestName}</p>
                          <p className="text-sm text-slate-500">
                            {booking.checkIn} — {booking.checkOut} • {booking.guests} Guests
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {booking.status === 'pending' ? (
                          <>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-100 hover:bg-red-50" onClick={() => handleStatus(booking.id, 'cancelled')}>
                              <X size={16} />
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleStatus(booking.id, 'confirmed')}>
                              <Check size={16} /> Confirm
                            </Button>
                          </>
                        ) : (
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'destructive'} className={booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : ''}>
                            {booking.status.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>AI Assistant Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-green-700">System Online</span>
                    </div>
                    <Badge variant="outline" className="border-green-200 text-green-600">Active</Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Top Languages</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">English</span>
                      <span className="text-sm font-bold">72%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full w-[72%]" />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm">Amharic</span>
                      <span className="text-sm font-bold">28%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full w-[28%]" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <Button className="w-full bg-slate-900">
                      Configure AI Responses
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
    active ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'
  }`}>
    <Icon size={20} />
    {label}
  </button>
);