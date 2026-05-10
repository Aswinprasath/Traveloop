import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, Calendar, MapPin, Clock, Share2, Copy, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SharedItinerary() {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;
    async function load() {
      const { data: share } = await supabase
        .from('shared_itineraries')
        .select('trip_id')
        .eq('share_token', token)
        .eq('is_active', true)
        .maybeSingle();

      if (!share) { setNotFound(true); setLoading(false); return; }

      const [{ data: tripData }, { data: stopsData }] = await Promise.all([
        supabase.from('trips').select('*').eq('id', share.trip_id).maybeSingle(),
        supabase.from('stops').select('*').eq('trip_id', share.trip_id).order('order_index'),
      ]);

      if (!tripData) { setNotFound(true); setLoading(false); return; }

      setTrip(tripData);
      setStops(stopsData || []);

      if (stopsData && stopsData.length > 0) {
        const stopIds = stopsData.map(s => s.id);
        const { data: actsData } = await supabase.from('activities').select('*').in('stop_id', stopIds);
        setActivities(actsData || []);
      }
      setLoading(false);
    }
    load();
  }, [token]);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center hero-gradient">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white">Loading itinerary...</p>
      </div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center hero-gradient px-4">
      <div className="text-center">
        <Compass className="w-16 h-16 text-white/50 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Itinerary Not Found</h1>
        <p className="text-slate-400 mb-6">This share link may have expired or been removed.</p>
        <Link to="/" className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
          Go to Traveloop
        </Link>
      </div>
    </div>
  );

  const duration = trip.start_date && trip.end_date
    ? Math.round((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000)
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="hero-gradient py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
              <Compass className="w-5 h-5" />
              <span className="font-semibold">Traveloop</span>
            </Link>
            <div className="flex gap-2">
              <button onClick={copyLink}
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-3.5 py-2 rounded-xl text-sm font-medium transition-colors border border-white/20">
                {copied ? 'Copied!' : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
              </button>
              <Link to="/signup"
                className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> Create My Own
              </Link>
            </div>
          </div>

          <div className="relative h-40 rounded-2xl overflow-hidden mb-5 bg-gradient-to-br from-blue-400/40 to-emerald-400/40">
            {trip.cover_photo && <img src={trip.cover_photo} alt={trip.name} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h1 className="font-display text-3xl font-bold text-white">{trip.name}</h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            {trip.start_date && (
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                {trip.end_date && ` – ${new Date(trip.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
              </span>
            )}
            {duration && (
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                <Clock className="w-3.5 h-3.5" /> {duration} days
              </span>
            )}
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5" /> {stops.length} stop{stops.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        {trip.description && (
          <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6 shadow-sm">
            <p className="text-slate-600 text-sm leading-relaxed">{trip.description}</p>
          </div>
        )}

        {/* Read-only banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-2 text-sm text-blue-700">
          <Share2 className="w-4 h-4 flex-shrink-0" />
          <span>This is a read-only shared itinerary.</span>
          <Link to="/signup" className="ml-auto font-semibold hover:underline flex-shrink-0">Copy this trip</Link>
        </div>

        {/* Timeline */}
        {stops.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">No stops in this itinerary.</div>
        ) : (
          <div className="relative">
            <div className="timeline-line" />
            <div className="space-y-0">
              {stops.map((stop, i) => {
                const stopActivities = activities.filter(a => a.stop_id === stop.id);
                return (
                  <div key={stop.id} className="relative pl-12 pb-8">
                    <div className="absolute left-0 top-1 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-md">
                      <span className="text-white text-xs font-bold">{i + 1}</span>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{stop.city}</h3>
                          {stop.country && <p className="text-slate-500 text-sm">{stop.country}</p>}
                        </div>
                        {stop.arrival_date && (
                          <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full flex-shrink-0 font-medium">
                            {new Date(stop.arrival_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            {stop.departure_date && ` – ${new Date(stop.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                          </span>
                        )}
                      </div>
                      {stopActivities.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          {stopActivities.map(act => (
                            <div key={act.id} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-xl px-3 py-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                              <span className="flex-1">{act.name}</span>
                              {act.cost > 0 && <span className="text-slate-400 text-xs">${act.cost}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl p-8 text-center text-white">
          <h3 className="font-display text-2xl font-bold mb-2">Inspired? Plan your own trip!</h3>
          <p className="text-white/80 mb-5 text-sm">Create a free Traveloop account and start planning your next adventure.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
}
