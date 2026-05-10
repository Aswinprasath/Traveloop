import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Plus, CreditCard as Edit2, Trash2, Share2, DollarSign, Package, FileText, ChevronDown, ChevronUp, Clock, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

function StopCard({ stop, onDelete, tripId }) {
  const [expanded, setExpanded] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loadingActs, setLoadingActs] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivity, setNewActivity] = useState({ name: '', category: 'sightseeing', cost: '', duration_hours: '' });
  const { user } = useAuth();

  async function loadActivities() {
    if (activities.length > 0) return;
    setLoadingActs(true);
    const { data } = await supabase.from('activities').select('*').eq('stop_id', stop.id).order('created_at');
    setActivities(data || []);
    setLoadingActs(false);
  }

  function toggleExpand() {
    setExpanded(v => !v);
    if (!expanded) loadActivities();
  }

  async function addActivity() {
    if (!newActivity.name.trim()) return;
    const { data, error } = await supabase.from('activities').insert({
      stop_id: stop.id,
      user_id: user.id,
      name: newActivity.name,
      category: newActivity.category,
      cost: parseFloat(newActivity.cost) || 0,
      duration_hours: parseFloat(newActivity.duration_hours) || 1,
    }).select().single();
    if (!error) {
      setActivities(prev => [...prev, data]);
      setNewActivity({ name: '', category: 'sightseeing', cost: '', duration_hours: '' });
      setShowAddActivity(false);
    }
  }

  async function deleteActivity(id) {
    await supabase.from('activities').delete().eq('id', id);
    setActivities(prev => prev.filter(a => a.id !== id));
  }

  const days = stop.arrival_date && stop.departure_date
    ? Math.round((new Date(stop.departure_date) - new Date(stop.arrival_date)) / 86400000)
    : null;

  const categoryColors = {
    sightseeing: 'bg-blue-100 text-blue-700',
    food: 'bg-amber-100 text-amber-700',
    adventure: 'bg-emerald-100 text-emerald-700',
    culture: 'bg-rose-100 text-rose-700',
    transport: 'bg-slate-100 text-slate-700',
    shopping: 'bg-pink-100 text-pink-700',
    other: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{stop.city}</h3>
              {stop.country && <p className="text-slate-500 text-sm">{stop.country}</p>}
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                {stop.arrival_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(stop.arrival_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {stop.departure_date && ` – ${new Date(stop.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                  </span>
                )}
                {days !== null && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{days} night{days !== 1 ? 's' : ''}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={toggleExpand} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <button onClick={() => onDelete(stop.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 px-5 pb-5">
          <div className="flex items-center justify-between mt-4 mb-3">
            <h4 className="text-sm font-semibold text-slate-700">Activities</h4>
            <button onClick={() => setShowAddActivity(v => !v)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
              <Plus className="w-3.5 h-3.5" /> Add Activity
            </button>
          </div>

          {showAddActivity && (
            <div className="bg-slate-50 rounded-xl p-4 mb-3 space-y-2.5">
              <input value={newActivity.name} onChange={e => setNewActivity(p => ({ ...p, name: e.target.value }))}
                placeholder="Activity name (e.g., Eiffel Tower visit)"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              <div className="grid grid-cols-3 gap-2">
                <select value={newActivity.category} onChange={e => setNewActivity(p => ({ ...p, category: e.target.value }))}
                  className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  {['sightseeing','food','adventure','culture','transport','shopping','other'].map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
                <input value={newActivity.cost} onChange={e => setNewActivity(p => ({ ...p, cost: e.target.value }))}
                  type="number" min="0" placeholder="Cost ($)"
                  className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                <input value={newActivity.duration_hours} onChange={e => setNewActivity(p => ({ ...p, duration_hours: e.target.value }))}
                  type="number" min="0.5" step="0.5" placeholder="Hours"
                  className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowAddActivity(false)} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                <button onClick={addActivity} className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Add</button>
              </div>
            </div>
          )}

          {loadingActs ? (
            <div className="space-y-2">{[1,2].map(i => <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />)}</div>
          ) : activities.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">No activities yet. Add some!</p>
          ) : (
            <div className="space-y-2">
              {activities.map(act => (
                <div key={act.id} className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[act.category] || 'bg-gray-100 text-gray-700'}`}>
                    {act.category}
                  </span>
                  <span className="flex-1 text-sm text-slate-800 font-medium truncate">{act.name}</span>
                  {act.cost > 0 && <span className="text-xs text-slate-500">${act.cost}</span>}
                  {act.duration_hours && <span className="text-xs text-slate-400">{act.duration_hours}h</span>}
                  <button onClick={() => deleteActivity(act.id)} className="text-slate-300 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddStop, setShowAddStop] = useState(false);
  const [newStop, setNewStop] = useState({ city: '', country: '', arrival_date: '', departure_date: '' });
  const [shareLoading, setShareLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (!user || !id) return;
    Promise.all([
      supabase.from('trips').select('*').eq('id', id).eq('user_id', user.id).maybeSingle(),
      supabase.from('stops').select('*').eq('trip_id', id).order('order_index'),
    ]).then(([{ data: tripData }, { data: stopsData }]) => {
      setTrip(tripData);
      setStops(stopsData || []);
      setLoading(false);
    });
  }, [user, id]);

  async function addStop() {
    if (!newStop.city.trim()) return;
    const { data, error } = await supabase.from('stops').insert({
      trip_id: id,
      user_id: user.id,
      city: newStop.city,
      country: newStop.country,
      arrival_date: newStop.arrival_date || null,
      departure_date: newStop.departure_date || null,
      order_index: stops.length,
    }).select().single();
    if (!error) {
      setStops(prev => [...prev, data]);
      setNewStop({ city: '', country: '', arrival_date: '', departure_date: '' });
      setShowAddStop(false);
    }
  }

  async function deleteStop(stopId) {
    if (!confirm('Delete this stop and all its activities?')) return;
    await supabase.from('stops').delete().eq('id', stopId);
    setStops(prev => prev.filter(s => s.id !== stopId));
  }

  async function handleShare() {
    setShareLoading(true);
    const { data: existing } = await supabase.from('shared_itineraries').select('share_token').eq('trip_id', id).maybeSingle();
    if (existing) {
      setShareUrl(`${window.location.origin}/share/${existing.share_token}`);
    } else {
      const { data } = await supabase.from('shared_itineraries').insert({ trip_id: id, user_id: user.id }).select().single();
      if (data) setShareUrl(`${window.location.origin}/share/${data.share_token}`);
    }
    setShareLoading(false);
  }

  async function copyShareUrl() {
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  }

  if (loading) return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-4">
      <div className="h-52 bg-slate-100 rounded-2xl animate-pulse" />
      <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
    </div>
  );

  if (!trip) return (
    <div className="p-8 text-center">
      <p className="text-slate-500">Trip not found.</p>
      <Link to="/trips" className="text-blue-600 hover:underline mt-2 inline-block">Back to trips</Link>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <button onClick={() => navigate('/trips')} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> All Trips
      </button>

      {/* Hero */}
      <div className="relative h-56 rounded-3xl overflow-hidden mb-6 bg-gradient-to-br from-blue-400 to-emerald-500">
        {trip.cover_photo && <img src={trip.cover_photo} alt={trip.name} className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="font-display text-3xl font-bold text-white mb-1">{trip.name}</h1>
          {trip.start_date && (
            <p className="text-slate-300 text-sm flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              {trip.end_date && ` – ${new Date(trip.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
            </p>
          )}
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <Link to={`/trips/${id}/edit`} className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white backdrop-blur px-3 py-2 rounded-xl text-sm font-medium transition-colors">
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </Link>
        </div>
      </div>

      {/* Description */}
      {trip.description && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-5">
          <p className="text-slate-600 text-sm leading-relaxed">{trip.description}</p>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { to: `/trips/${id}/budget`, icon: DollarSign, label: 'Budget', color: 'text-emerald-600 bg-emerald-50' },
          { to: `/trips/${id}/packing`, icon: Package, label: 'Packing', color: 'text-amber-600 bg-amber-50' },
          { to: `/trips/${id}/notes`, icon: FileText, label: 'Notes', color: 'text-blue-600 bg-blue-50' },
          { to: null, icon: Share2, label: shareLoading ? '...' : 'Share', color: 'text-rose-600 bg-rose-50', onClick: handleShare },
        ].map(({ to, icon: Icon, label, color, onClick }) => {
          const cls = `flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-100 bg-white hover:shadow-md transition-all text-center card-hover`;
          const inner = (
            <>
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-700">{label}</span>
            </>
          );
          return to ? (
            <Link key={label} to={to} className={cls}>{inner}</Link>
          ) : (
            <button key={label} onClick={onClick} className={cls}>{inner}</button>
          );
        })}
      </div>

      {/* Share URL */}
      {shareUrl && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-emerald-700 font-medium mb-1">Share URL</p>
            <p className="text-sm text-emerald-800 truncate font-mono">{shareUrl}</p>
          </div>
          <button onClick={copyShareUrl} className="flex-shrink-0 bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors">
            Copy
          </button>
        </div>
      )}

      {/* Stops */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" /> Stops ({stops.length})
          </h2>
          <button onClick={() => setShowAddStop(v => !v)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Add Stop
          </button>
        </div>

        {showAddStop && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-4">
            <h3 className="font-semibold text-slate-800 mb-4 text-sm">New Stop</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input value={newStop.city} onChange={e => setNewStop(p => ({ ...p, city: e.target.value }))}
                placeholder="City *"
                className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
              <input value={newStop.country} onChange={e => setNewStop(p => ({ ...p, country: e.target.value }))}
                placeholder="Country"
                className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Arrival Date</label>
                <input type="date" value={newStop.arrival_date} onChange={e => setNewStop(p => ({ ...p, arrival_date: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Departure Date</label>
                <input type="date" value={newStop.departure_date} onChange={e => setNewStop(p => ({ ...p, departure_date: e.target.value }))}
                  min={newStop.arrival_date}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAddStop(false)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={addStop} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">Add Stop</button>
            </div>
          </div>
        )}

        {stops.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center">
            <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No stops added yet. Add your first destination!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stops.map((stop, i) => (
              <div key={stop.id} className="relative">
                {i < stops.length - 1 && (
                  <div className="absolute left-9 top-full h-3 w-0.5 bg-slate-200 z-10" />
                )}
                <StopCard stop={stop} onDelete={deleteStop} tripId={id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
