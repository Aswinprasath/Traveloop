import { useState } from 'react';
import { Search, MapPin, Star, DollarSign, Globe, Filter } from 'lucide-react';

const allCities = [
  { name: 'Paris', country: 'France', region: 'Europe', img: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=400', costIndex: 3, rating: 4.8, activities: ['Eiffel Tower', 'Louvre', 'Montmartre', 'Seine River Cruise'], tag: 'Romance' },
  { name: 'Bali', country: 'Indonesia', region: 'Asia', img: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=400', costIndex: 1, rating: 4.7, activities: ['Ubud Temple', 'Rice Terraces', 'Beach Hopping', 'Cooking Class'], tag: 'Tropical' },
  { name: 'Tokyo', country: 'Japan', region: 'Asia', img: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400', costIndex: 3, rating: 4.9, activities: ['Shibuya Crossing', 'Senso-ji Temple', 'Akihabara', 'Mount Fuji Day Trip'], tag: 'Culture' },
  { name: 'New York', country: 'USA', region: 'Americas', img: 'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg?auto=compress&cs=tinysrgb&w=400', costIndex: 4, rating: 4.7, activities: ['Central Park', 'Statue of Liberty', 'Broadway Show', 'Brooklyn Bridge'], tag: 'Urban' },
  { name: 'Cape Town', country: 'South Africa', region: 'Africa', img: 'https://images.pexels.com/photos/1089194/pexels-photo-1089194.jpeg?auto=compress&cs=tinysrgb&w=400', costIndex: 2, rating: 4.6, activities: ['Table Mountain', 'Cape Point', 'Wine Country', 'Penguin Colony'], tag: 'Adventure' },
  { name: 'Santorini', country: 'Greece', region: 'Europe', img: 'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg?auto=compress&cs=tinysrgb&w=400', costIndex: 3, rating: 4.9, activities: ['Oia Sunset', 'Caldera View', 'Wine Tasting', 'Black Sand Beach'], tag: 'Romance' },
  { name: 'Machu Picchu', country: 'Peru', region: 'Americas', img: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=400', costIndex: 2, rating: 4.9, activities: ['Inca Trail', 'Sun Gate', 'Aguas Calientes', 'Huayna Picchu'], tag: 'Adventure' },
  { name: 'Barcelona', country: 'Spain', region: 'Europe', img: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=400', costIndex: 2, rating: 4.7, activities: ['Sagrada Familia', 'Park Güell', 'La Rambla', 'Gothic Quarter'], tag: 'Culture' },
  { name: 'Dubai', country: 'UAE', region: 'Middle East', img: 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=400', costIndex: 4, rating: 4.6, activities: ['Burj Khalifa', 'Desert Safari', 'Dubai Mall', 'Palm Jumeirah'], tag: 'Luxury' },
  { name: 'Kyoto', country: 'Japan', region: 'Asia', img: 'https://images.pexels.com/photos/2070485/pexels-photo-2070485.jpeg?auto=compress&cs=tinysrgb&w=400', costIndex: 2, rating: 4.8, activities: ['Fushimi Inari', 'Arashiyama Bamboo', 'Geisha District', 'Tea Ceremony'], tag: 'Culture' },
  { name: 'Amsterdam', country: 'Netherlands', region: 'Europe', img: 'https://images.pexels.com/photos/1796736/pexels-photo-1796736.jpeg?auto=compress&cs=tinysrgb&w=400', costIndex: 3, rating: 4.6, activities: ['Canal Cruise', 'Rijksmuseum', 'Anne Frank House', 'Bike Tour'], tag: 'Culture' },
  { name: 'Maldives', country: 'Maldives', region: 'Asia', img: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=400', costIndex: 5, rating: 4.9, activities: ['Snorkeling', 'Overwater Bungalow', 'Diving', 'Island Hopping'], tag: 'Luxury' },
];

const REGIONS = ['All', 'Europe', 'Asia', 'Americas', 'Africa', 'Middle East'];
const COST_LABELS = { 1: '$', 2: '$$', 3: '$$$', 4: '$$$$', 5: '$$$$$' };

function CostDots({ index }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= index ? 'bg-emerald-500' : 'bg-slate-200'}`} />
      ))}
    </div>
  );
}

export default function Explore() {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [maxCost, setMaxCost] = useState(5);
  const [selected, setSelected] = useState(null);

  const filtered = allCities.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase());
    const matchRegion = region === 'All' || c.region === region;
    const matchCost = c.costIndex <= maxCost;
    return matchSearch && matchRegion && matchCost;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Explore Destinations</h1>
        <p className="text-slate-500 text-sm mt-1">Discover cities and get inspired for your next trip.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-7">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cities or countries..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {REGIONS.map(r => (
            <button key={r} onClick={() => setRegion(r)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${region === r ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
              {r}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 min-w-0">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <div className="flex-1 min-w-32">
            <label className="text-xs text-slate-500 mb-1 block">Max Cost: {COST_LABELS[maxCost]}</label>
            <input type="range" min={1} max={5} value={maxCost} onChange={e => setMaxCost(Number(e.target.value))}
              className="w-full" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(city => (
          <div key={city.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm card-hover overflow-hidden cursor-pointer"
            onClick={() => setSelected(selected?.name === city.name ? null : city)}>
            <div className="relative h-44 overflow-hidden">
              <img src={city.img} alt={city.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
              <div className="absolute top-3 right-3">
                <span className="bg-white/90 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">{city.tag}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg leading-tight">{city.name}</h3>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-slate-300 text-xs flex items-center gap-1"><Globe className="w-3 h-3" />{city.country}</span>
                  <span className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                    <Star className="w-3 h-3 fill-current" />{city.rating}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{city.region}</span>
                <div className="flex items-center gap-1.5">
                  <CostDots index={city.costIndex} />
                  <span className="text-xs text-slate-500 font-medium">{COST_LABELS[city.costIndex]}</span>
                </div>
              </div>

              {selected?.name === city.name && (
                <div className="mt-2 pt-3 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Top Activities</p>
                  <div className="space-y-1.5">
                    {city.activities.map(act => (
                      <div key={act} className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                        {act}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No destinations match your filters.</p>
        </div>
      )}
    </div>
  );
}
