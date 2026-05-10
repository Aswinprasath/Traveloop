import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Calendar, CreditCard as Edit2, Trash2, Eye, MapPin, MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

function TripCard({ trip, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const duration = trip.start_date && trip.end_date
    ? Math.round((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000)
    : null;

  const now = new Date();
  const start = trip.start_date ? new Date(trip.start_date) : null;
  const end = trip.end_date ? new Date(trip.end_date) : null;
  let statusLabel = 'Planning', statusColor = 'bg-amber-100 text-amber-700';
  if (start && end) {
    if (now < start) { statusLabel = 'Upcoming'; statusColor = 'bg-blue-100 text-blue-700'; }
    else if (now > end) { statusLabel = 'Completed'; statusColor = 'bg-slate-100 text-slate-600'; }
    else { statusLabel = 'Ongoing'; statusColor = 'bg-emerald-100 text-emerald-700'; }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm card-hover overflow-hidden group relative">
      <div className="h-36 bg-gradient-to-br from-blue-400 to-emerald-500 relative overflow-hidden">
        {trip.cover_photo && (
          <img src={trip.cover_photo} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>
          {statusLabel}
        </span>
        <div className="absolute top-3 right-3 relative">
          <button onClick={() => setMenuOpen(v => !v)} className="w-7 h-7 rounded-lg bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute top-9 right-0 bg-white rounded-xl shadow-xl border border-slate-100 py-1 min-w-[140px] z-10"
              onMouseLeave={() => setMenuOpen(false)}>
              <Link to={`/trips/${trip.id}`} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-sm text-slate-700">
                <Eye className="w-3.5 h-3.5" /> View
              </Link>
              <Link to={`/trips/${trip.id}/edit`} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-sm text-slate-700">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </Link>
              <button onClick={() => { setMenuOpen(false); onDelete(trip.id); }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-sm text-red-600 w-full">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <Link to={`/trips/${trip.id}`} className="block p-5">
        <h3 className="font-bold text-slate-900 text-base mb-2 truncate">{trip.name}</h3>
        <div className="space-y-1.5">
          {trip.start_date && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {trip.end_date && ` – ${new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
              </span>
            </div>
          )}
          {duration && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span>{duration} day{duration !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        {trip.description && (
          <p className="text-slate-500 text-xs mt-2 line-clamp-2">{trip.description}</p>
        )}
      </Link>
    </div>
  );
}

export default function MyTrips() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    supabase.from('trips').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { setTrips(data || []); setLoading(false); });
  }, [user]);

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this trip? This cannot be undone.')) return;
    await supabase.from('trips').delete().eq('id', id);
    setTrips(prev => prev.filter(t => t.id !== id));
  }

  const now = new Date();
  const filtered = trips.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === 'all') return true;
    if (filter === 'upcoming') return t.start_date && new Date(t.start_date) > now;
    if (filter === 'past') return t.end_date && new Date(t.end_date) < now;
    if (filter === 'planning') return !t.start_date;
    return true;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Trips</h1>
          <p className="text-slate-500 text-sm mt-1">{trips.length} trip{trips.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link to="/trips/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
          <PlusCircle className="w-4 h-4" />
          New Trip
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search trips..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        <div className="flex gap-2">
          {['all', 'upcoming', 'past', 'planning'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors
                ${filter === f ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-56 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-700 mb-2">{search ? 'No trips found' : 'No trips yet'}</h3>
          <p className="text-slate-500 text-sm mb-5">{search ? 'Try a different search term.' : 'Create your first trip to get started!'}</p>
          {!search && (
            <Link to="/trips/new" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
              <PlusCircle className="w-4 h-4" /> Create Trip
            </Link>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(trip => <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />)}
        </div>
      )}
    </div>
  );
}
