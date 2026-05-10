import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, CreditCard as Edit2, FileText, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Notes() {
  const { id } = useParams();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', note_date: '' });

  useEffect(() => {
    if (!user || !id) return;
    Promise.all([
      supabase.from('trips').select('name').eq('id', id).maybeSingle(),
      supabase.from('notes').select('*').eq('trip_id', id).order('created_at', { ascending: false }),
    ]).then(([{ data: tripData }, { data: notesData }]) => {
      setTrip(tripData);
      setNotes(notesData || []);
      setLoading(false);
    });
  }, [user, id]);

  function startAdd() {
    setEditingId(null);
    setForm({ title: '', content: '', note_date: '' });
    setShowAdd(true);
  }

  function startEdit(note) {
    setEditingId(note.id);
    setForm({ title: note.title, content: note.content, note_date: note.note_date || '' });
    setShowAdd(true);
  }

  async function saveNote() {
    if (!form.content.trim()) return;
    if (editingId) {
      const { error } = await supabase.from('notes').update({
        title: form.title,
        content: form.content,
        note_date: form.note_date || null,
        updated_at: new Date().toISOString(),
      }).eq('id', editingId);
      if (!error) {
        setNotes(prev => prev.map(n => n.id === editingId ? { ...n, ...form } : n));
      }
    } else {
      const { data, error } = await supabase.from('notes').insert({
        trip_id: id, user_id: user.id,
        title: form.title,
        content: form.content,
        note_date: form.note_date || null,
      }).select().single();
      if (!error) setNotes(prev => [data, ...prev]);
    }
    setShowAdd(false);
    setEditingId(null);
    setForm({ title: '', content: '', note_date: '' });
  }

  async function deleteNote(noteId) {
    if (!confirm('Delete this note?')) return;
    await supabase.from('notes').delete().eq('id', noteId);
    setNotes(prev => prev.filter(n => n.id !== noteId));
  }

  if (loading) return <div className="p-8 text-center"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <Link to={`/trips/${id}`} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Trip {trip?.name && `— ${trip.name}`}
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trip Journal</h1>
          <p className="text-slate-500 text-sm mt-1">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={startAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> New Note
        </button>
      </div>

      {/* Note Form */}
      {showAdd && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 text-sm">{editingId ? 'Edit Note' : 'New Note'}</h3>
            <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Note title (optional)"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Date (optional)</label>
              <input type="date" value={form.note_date} onChange={e => setForm(p => ({ ...p, note_date: e.target.value }))}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
            </div>
            <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={5}
              placeholder="Write your note, thoughts, or reminders..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 resize-none" />
            <div className="flex gap-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={saveNote} className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                <Save className="w-3.5 h-3.5" /> Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700 mb-1">No notes yet</h3>
          <p className="text-slate-500 text-sm">Start journaling your travel thoughts and ideas.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map(note => (
            <div key={note.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 card-hover">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  {note.title && <h3 className="font-bold text-slate-900 mb-1">{note.title}</h3>}
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    {note.note_date && (
                      <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
                        {new Date(note.note_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                    <span>{new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => startEdit(note)} className="text-slate-400 hover:text-blue-500 transition-colors p-1">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteNote(note.id)} className="text-slate-400 hover:text-red-400 transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
