import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, Calendar, AlignLeft, Tag, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function CreateTrip() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    description: '',
    cover_photo: '',
    start_date: '',
    end_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) { setError('Trip name is required.'); return; }
    if (form.start_date && form.end_date && form.end_date < form.start_date) {
      setError('End date must be after start date.'); return;
    }
    setLoading(true);
    try {
      const { data, error: err } = await supabase.from('trips').insert({
        user_id: user.id,
        name: form.name.trim(),
        description: form.description,
        cover_photo: form.cover_photo,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      }).select().single();
      if (err) throw err;
      navigate(`/trips/${data.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create trip.');
    } finally {
      setLoading(false);
    }
  }

  const coverOptions = [
    'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=600',
  ];

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Plan a New Trip</h1>
        <p className="text-slate-500 text-sm mt-1">Fill in the details to start building your itinerary.</p>
      </div>

      {/* Cover Preview */}
      <div className="relative h-48 rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-blue-400 to-emerald-500">
        {form.cover_photo && (
          <img src={form.cover_photo} alt="Cover" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="text-white text-center">
            <Camera className="w-8 h-8 mx-auto mb-1 opacity-80" />
            <p className="text-sm opacity-80">Choose a cover photo below</p>
          </div>
        </div>
      </div>

      {/* Cover Photo Options */}
      <div className="mb-6">
        <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-1.5">
          <Camera className="w-4 h-4" /> Cover Photo
        </label>
        <div className="grid grid-cols-3 gap-2">
          {coverOptions.map((url, i) => (
            <button key={i} type="button" onClick={() => setForm(f => ({ ...f, cover_photo: url }))}
              className={`h-20 rounded-xl overflow-hidden border-2 transition-all ${form.cover_photo === url ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-blue-300'}`}>
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        <div className="mt-2">
          <input name="cover_photo" value={form.cover_photo} onChange={onChange} placeholder="Or paste a custom image URL..."
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
        )}

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block flex items-center gap-1.5">
            <Tag className="w-4 h-4" /> Trip Name *
          </label>
          <input name="name" value={form.name} onChange={onChange} placeholder="e.g., European Summer 2026"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm transition-all font-medium" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block flex items-center gap-1.5">
            <AlignLeft className="w-4 h-4" /> Description
          </label>
          <textarea name="description" value={form.description} onChange={onChange} rows={3}
            placeholder="Describe your trip plans, goals, or notes..."
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm transition-all resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Start Date
            </label>
            <input name="start_date" type="date" value={form.start_date} onChange={onChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> End Date
            </label>
            <input name="end_date" type="date" value={form.end_date} onChange={onChange}
              min={form.start_date}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm transition-all" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)}
            className="flex-1 px-5 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors shadow-sm">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : <Save className="w-4 h-4" />}
            {loading ? 'Creating...' : 'Create Trip'}
          </button>
        </div>
      </form>
    </div>
  );
}
