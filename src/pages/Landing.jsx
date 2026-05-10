import { Link } from 'react-router-dom';
import { Compass, Map, DollarSign, Package, Users, Star, ArrowRight, Globe, CheckCircle } from 'lucide-react';

const features = [
  { icon: Map, title: 'Smart Itineraries', desc: 'Build day-by-day trip plans with cities, activities, and timelines — all in one place.' },
  { icon: DollarSign, title: 'Budget Tracking', desc: 'Estimate costs, track spending by category, and get instant budget breakdowns.' },
  { icon: Package, title: 'Packing Lists', desc: 'Never forget essentials. Smart packing checklists organized by category.' },
  { icon: Globe, title: 'City Explorer', desc: 'Discover destinations with cost indices, popularity ratings, and activity ideas.' },
  { icon: Users, title: 'Share Trips', desc: 'Generate a public link for your itinerary so friends and family can follow along.' },
  { icon: Star, title: 'Trip Journal', desc: 'Document memories, tips, and notes day-by-day for every journey.' },
];

const destinations = [
  { name: 'Paris', country: 'France', img: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=400', cost: '$$' },
  { name: 'Bali', country: 'Indonesia', img: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=400', cost: '$' },
  { name: 'Tokyo', country: 'Japan', img: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400', cost: '$$$' },
  { name: 'New York', country: 'USA', img: 'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg?auto=compress&cs=tinysrgb&w=400', cost: '$$$' },
  { name: 'Cape Town', country: 'South Africa', img: 'https://images.pexels.com/photos/1089194/pexels-photo-1089194.jpeg?auto=compress&cs=tinysrgb&w=400', cost: '$$' },
  { name: 'Kyoto', country: 'Japan', img: 'https://images.pexels.com/photos/2070485/pexels-photo-2070485.jpeg?auto=compress&cs=tinysrgb&w=400', cost: '$$' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
              <Compass className="w-4.5 h-4.5 text-white w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 text-lg">Traveloop</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">Sign In</Link>
            <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 text-emerald-300 border border-emerald-500/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Star className="w-3.5 h-3.5" />
            Trusted by 50,000+ travelers worldwide
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Plan Your Perfect
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400"> Journey</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Traveloop makes it effortless to create personalized itineraries, track budgets, and share your adventures — all in one beautiful platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-4 rounded-2xl text-base font-semibold transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5">
              Start Planning Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl text-base font-medium border border-white/20 transition-all">
              Sign in
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-10 text-slate-400 text-sm">
            {['Free to start', 'No credit card required', 'Unlimited trips'].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-slate-900 mb-4">Everything you need to travel smarter</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">From first idea to final destination, Traveloop handles every detail of your travel planning.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-slate-200 card-hover">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-slate-900 mb-4">Popular Destinations</h2>
            <p className="text-lg text-slate-500">Explore top destinations and add them to your next adventure.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map(({ name, country, img, cost }) => (
              <div key={name} className="group relative rounded-2xl overflow-hidden card-hover cursor-pointer shadow-md">
                <img src={img} alt={name} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-bold text-xl">{name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-slate-300 text-sm">{country}</span>
                    <span className="text-emerald-400 font-semibold text-sm">{cost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 hero-gradient">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to start your next adventure?</h2>
          <p className="text-xl text-slate-300 mb-8">Join thousands of travelers who plan smarter with Traveloop.</p>
          <Link to="/signup"
            className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-2xl font-semibold text-base transition-all shadow-xl hover:-translate-y-0.5">
            Create Your Free Account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Compass className="w-4 h-4 text-blue-400" />
          <span className="text-white font-semibold">Traveloop</span>
        </div>
        <p>&copy; 2026 Traveloop. Built for explorers, dreamers, and adventurers.</p>
      </footer>
    </div>
  );
}
