import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Package, CheckCircle, Circle, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const CATEGORIES = ['documents', 'clothing', 'electronics', 'toiletries', 'health', 'other'];
const catIcons = { documents: '📄', clothing: '👕', electronics: '💻', toiletries: '🧴', health: '💊', other: '🎒' };
const catColors = {
  documents: 'bg-blue-100 text-blue-700',
  clothing: 'bg-pink-100 text-pink-700',
  electronics: 'bg-slate-100 text-slate-700',
  toiletries: 'bg-cyan-100 text-cyan-700',
  health: 'bg-red-100 text-red-700',
  other: 'bg-amber-100 text-amber-700',
};

export default function Packing() {
  const { id } = useParams();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: '', category: 'clothing' });
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    if (!user || !id) return;
    Promise.all([
      supabase.from('trips').select('name').eq('id', id).maybeSingle(),
      supabase.from('packing_items').select('*').eq('trip_id', id).order('created_at'),
    ]).then(([{ data: tripData }, { data: packData }]) => {
      setTrip(tripData);
      setItems(packData || []);
      setLoading(false);
    });
  }, [user, id]);

  async function addItem() {
    if (!newItem.name.trim()) return;
    const { data, error } = await supabase.from('packing_items').insert({
      trip_id: id, user_id: user.id,
      name: newItem.name.trim(),
      category: newItem.category,
      packed: false,
    }).select().single();
    if (!error) {
      setItems(prev => [...prev, data]);
      setNewItem(p => ({ ...p, name: '' }));
    }
  }

  async function togglePacked(item) {
    const { error } = await supabase.from('packing_items').update({ packed: !item.packed }).eq('id', item.id);
    if (!error) setItems(prev => prev.map(i => i.id === item.id ? { ...i, packed: !i.packed } : i));
  }

  async function deleteItem(itemId) {
    await supabase.from('packing_items').delete().eq('id', itemId);
    setItems(prev => prev.filter(i => i.id !== itemId));
  }

  async function resetAll() {
    if (!confirm('Reset all items to unpacked?')) return;
    await supabase.from('packing_items').update({ packed: false }).eq('trip_id', id).eq('user_id', user.id);
    setItems(prev => prev.map(i => ({ ...i, packed: false })));
  }

  const packedCount = items.filter(i => i.packed).length;
  const progress = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0;
  const filtered = activeCategory === 'all' ? items : items.filter(i => i.category === activeCategory);

  if (loading) return <div className="p-8 text-center"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <Link to={`/trips/${id}`} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Trip {trip?.name && `— ${trip.name}`}
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Packing List</h1>
          <p className="text-slate-500 text-sm mt-1">{packedCount} of {items.length} items packed</p>
        </div>
        {items.length > 0 && (
          <button onClick={resetAll} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        )}
      </div>

      {/* Progress */}
      {items.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-medium text-slate-700">Packing Progress</span>
            <span className="text-sm font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>
          {progress === 100 && (
            <p className="text-emerald-600 text-sm font-medium mt-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> All packed! You're ready to go.
            </p>
          )}
        </div>
      )}

      {/* Add Item */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5">
        <div className="flex gap-2">
          <select value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}
            className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 flex-shrink-0">
            {CATEGORIES.map(c => <option key={c} value={c}>{catIcons[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          <input value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            placeholder="Add item (press Enter)..."
            className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
          <button onClick={addItem} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {['all', ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors capitalize
              ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            {cat === 'all' ? 'All' : `${catIcons[cat]} ${cat}`}
          </button>
        ))}
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center">
          <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No items in this category yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-50">
            {filtered.map(item => (
              <div key={item.id}
                className={`flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors ${item.packed ? 'opacity-60' : ''}`}>
                <button onClick={() => togglePacked(item)} className="flex-shrink-0 text-slate-400 hover:text-blue-600 transition-colors">
                  {item.packed
                    ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                    : <Circle className="w-5 h-5" />}
                </button>
                <span className="text-base">{catIcons[item.category]}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${item.packed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {item.name}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${catColors[item.category]}`}>{item.category}</span>
                </div>
                <button onClick={() => deleteItem(item.id)} className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
