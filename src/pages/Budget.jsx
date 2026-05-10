import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const CATEGORIES = ['transport', 'accommodation', 'food', 'activities', 'shopping', 'other'];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];

const categoryIcons = {
  transport: '✈️', accommodation: '🏨', food: '🍽️',
  activities: '🎯', shopping: '🛍️', other: '💼'
};

export default function Budget() {
  const { id } = useParams();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ category: 'transport', label: '', amount: '' });

  useEffect(() => {
    if (!user || !id) return;
    Promise.all([
      supabase.from('trips').select('name').eq('id', id).maybeSingle(),
      supabase.from('budgets').select('*').eq('trip_id', id).order('created_at'),
    ]).then(([{ data: tripData }, { data: budgetData }]) => {
      setTrip(tripData);
      setItems(budgetData || []);
      setLoading(false);
    });
  }, [user, id]);

  async function addItem() {
    if (!newItem.label.trim() || !newItem.amount) return;
    const { data, error } = await supabase.from('budgets').insert({
      trip_id: id, user_id: user.id,
      category: newItem.category,
      label: newItem.label,
      amount: parseFloat(newItem.amount),
    }).select().single();
    if (!error) {
      setItems(prev => [...prev, data]);
      setNewItem({ category: 'transport', label: '', amount: '' });
      setShowAdd(false);
    }
  }

  async function deleteItem(itemId) {
    await supabase.from('budgets').delete().eq('id', itemId);
    setItems(prev => prev.filter(i => i.id !== itemId));
  }

  const total = items.reduce((sum, i) => sum + Number(i.amount), 0);

  const byCategory = CATEGORIES.map((cat, idx) => {
    const amount = items.filter(i => i.category === cat).reduce((s, i) => s + Number(i.amount), 0);
    return { name: cat.charAt(0).toUpperCase() + cat.slice(1), value: amount, color: COLORS[idx] };
  }).filter(c => c.value > 0);

  if (loading) return <div className="p-8 text-center"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <Link to={`/trips/${id}`} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Trip {trip?.name && `— ${trip.name}`}
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Budget Tracker</h1>
          <p className="text-slate-500 text-sm mt-1">Track and manage your trip expenses</p>
        </div>
        <button onClick={() => setShowAdd(v => !v)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">${total.toLocaleString()}</p>
          <p className="text-slate-500 text-sm mt-0.5">Total Budget</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{items.length}</p>
          <p className="text-slate-500 text-sm mt-0.5">Expenses Logged</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm col-span-2 lg:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">${items.length > 0 ? (total / items.length).toFixed(0) : 0}</p>
          <p className="text-slate-500 text-sm mt-0.5">Avg Per Item</p>
        </div>
      </div>

      {/* Charts */}
      {byCategory.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-5 mb-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-800 mb-4">Spending by Category</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={byCategory} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {byCategory.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {byCategory.map(c => (
                <div key={c.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  <span className="text-slate-600">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-800 mb-4">Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={byCategory} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {byCategory.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Add Form */}
      {showAdd && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5">
          <h3 className="font-semibold text-slate-800 mb-4 text-sm">Add Expense</h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <select value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}
              className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
              {CATEGORIES.map(c => <option key={c} value={c}>{categoryIcons[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
            <input value={newItem.label} onChange={e => setNewItem(p => ({ ...p, label: e.target.value }))} placeholder="Description *"
              className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
            <input value={newItem.amount} onChange={e => setNewItem(p => ({ ...p, amount: e.target.value }))} type="number" min="0" step="0.01" placeholder="Amount ($) *"
              className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={addItem} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">Add</button>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">All Expenses</h3>
        </div>
        {items.length === 0 ? (
          <div className="p-10 text-center">
            <DollarSign className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No expenses logged yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <span className="text-xl">{categoryIcons[item.category] || '💼'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{item.label}</p>
                  <p className="text-xs text-slate-400 capitalize">{item.category}</p>
                </div>
                <span className="font-bold text-slate-900">${Number(item.amount).toLocaleString()}</span>
                <button onClick={() => deleteItem(item.id)} className="text-slate-300 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-4 px-5 py-4 bg-slate-50">
              <span className="flex-1 font-bold text-slate-900">Total</span>
              <span className="font-bold text-xl text-blue-600">${total.toLocaleString()}</span>
              <div className="w-8" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
