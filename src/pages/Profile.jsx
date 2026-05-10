import { useState } from 'react';
import { User, Mail, Globe, Camera, Save, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
];

export default function Profile() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    avatar_url: profile?.avatar_url || '',
    language: profile?.language || 'en',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setSuccess(false); setError('');
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        full_name: form.full_name,
        avatar_url: form.avatar_url,
        language: form.language,
        updated_at: new Date().toISOString(),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== 'DELETE') return;
    try {
      await supabase.from('profiles').delete().eq('id', user.id);
      await signOut();
      navigate('/');
    } catch (err) {
      setError('Failed to delete account. Contact support.');
    }
  }

  const initials = form.full_name
    ? form.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Profile & Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account details and preferences.</p>
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {form.avatar_url ? (
                <img src={form.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white">
              <Camera className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-lg">{profile?.full_name || 'Traveler'}</h2>
            <p className="text-slate-500 text-sm">{user?.email}</p>
            <p className="text-xs text-slate-400 mt-1">Member since {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
              <Save className="w-4 h-4" /> Profile updated successfully!
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block flex items-center gap-1.5">
              <User className="w-4 h-4" /> Full Name
            </label>
            <input name="full_name" value={form.full_name} onChange={onChange}
              placeholder="Your full name"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> Email
            </label>
            <input value={user?.email || ''} disabled
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-400 bg-slate-50 text-sm cursor-not-allowed" />
            <p className="text-xs text-slate-400 mt-1">Email cannot be changed here.</p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block flex items-center gap-1.5">
              <Camera className="w-4 h-4" /> Avatar URL
            </label>
            <input name="avatar_url" value={form.avatar_url} onChange={onChange}
              placeholder="https://example.com/your-photo.jpg"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block flex items-center gap-1.5">
              <Globe className="w-4 h-4" /> Language Preference
            </label>
            <select name="language" value={form.language} onChange={onChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm">
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-medium transition-colors shadow-sm">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
        <h3 className="font-bold text-red-600 mb-1 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Danger Zone</h3>
        <p className="text-slate-500 text-sm mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
        {!showDelete ? (
          <button onClick={() => setShowDelete(true)}
            className="flex items-center gap-2 border border-red-300 text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-700 font-medium">Type <span className="font-bold text-red-600">DELETE</span> to confirm:</p>
            <input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE here"
              className="w-full px-4 py-3 border border-red-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50" />
            <div className="flex gap-2">
              <button onClick={() => setShowDelete(false)} className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">Cancel</button>
              <button onClick={handleDeleteAccount} disabled={deleteConfirm !== 'DELETE'}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
                Confirm Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
