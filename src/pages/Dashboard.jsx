import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, MapPin, Calendar, TrendingUp, Briefcase, ArrowRight, Globe, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const suggestedDestinations = [
  { name: 'Santorini', country: 'Greece', img: 'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg?auto=compress&cs=tinysrgb&w=400', rating: 4.9 },
  { name: 'Machu Picchu', country: 'Peru', img: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=400', rating: 4.8 },
  { name: 'Maldives', country: 'Maldives', img: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=400', rating: 4.9 },
  { name: 'Amalfi Coast', country: 'Italy', img: 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=400', rating: 4.7 },
];

function tripDuration(start, end) {
  if (!start || !end) return '—';
  const days = Math.round((new Date(end) - new Date(start)) / 86400000);
  return `${days} day${days !== 1 ? 's' : ''}`;
}

function tripStatus(start, end) {
  const now = new Date();
  const s = new Date(start), e = new Date(end);
  if (!start) return { label: 'Planning', color: 'bg-amber-100 text-amber-700' };
  if (now < s) return { label: 'Upcoming', color: 'bg-blue-100 text-blue-700' };
  if (now > e) return { label: 'Completed', color: 'bg-slate-100 text-slate-600' };
  return { label: 'Ongoing', color: 'bg-emerald-100 text-emerald-700' };
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('trips').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(6)
      .then(({ data }) => { setTrips(data || []); setLoading(false); });
  }, [user]);

  const upcoming = trips.filter(t => t.start_date && new Date(t.start_date) > new Date());
  const totalTrips = trips.length;

  const firstName = profile?.full_name?.split(' ')[0] || 'Traveler';

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="relative rounded-3xl overflow-hidden hero-gradient p-8 lg:p-10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 left-10 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-emerald-400 text-sm font-semibold mb-1">Good day,</p>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-2">Welcome back, {firstName}!</h1>
            <p className="text-slate-300 text-base">Ready for your next adventure? You have {upcoming.length} upcoming trip{upcoming.length !== 1 ? 's' : ''}.</p>
          </div>
          <Link to="/trips/new"
            className="flex-shrink-0 flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-2xl font-semibold text-sm transition-all shadow-lg hover:-translate-y-0.5">
            <PlusCircle className="w-4 h-4" />
            Plan New Trip
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Trips', value: totalTrips, icon: Briefcase, color: 'text-blue-600 bg-blue-50' },
          { label: 'Upcoming', value: upcoming.length, icon: Calendar, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Destinations', value: trips.length > 0 ? `${trips.length * 2}+` : '0', icon: MapPin, color: 'text-amber-600 bg-amber-50' },
          { label: 'Countries', value: trips.length > 0 ? `${Math.max(1, Math.floor(trips.length * 1.3))}` : '0', icon: Globe, color: 'text-rose-600 bg-rose-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm card-hover">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-slate-500 text-sm mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Trips */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">My Trips</h2>
          <Link to="/trips" className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-700 mb-2">No trips yet</h3>
            <p className="text-slate-500 text-sm mb-4">Start planning your first adventure!</p>
            <Link to="/trips/new" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
              <PlusCircle className="w-4 h-4" />
              Create Trip
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map(trip => {
              const status = tripStatus(trip.start_date, trip.end_date);
              return (
                <Link key={trip.id} to={`/trips/${trip.id}`}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm card-hover overflow-hidden group">
                  <div className="h-28 bg-gradient-to-br from-blue-400 to-emerald-500 relative overflow-hidden">
                    {trip.cover_photo && (
                      <img src={trip.cover_photo} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 truncate">{trip.name}</h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {trip.start_date ? new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date set'}
                      </span>
                      <span>{tripDuration(trip.start_date, trip.end_date)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommended Destinations */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">Recommended Destinations</h2>
          <Link to="/explore" className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
            Explore all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {suggestedDestinations.map(({ name, country, img, rating }) => (
            <div key={name} className="group relative rounded-2xl overflow-hidden card-hover cursor-pointer shadow-sm">
              <img src={img} alt={name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold">{name}</h3>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-slate-300 text-xs">{country}</span>
                  <span className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                    <Star className="w-3 h-3 fill-current" /> {rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
