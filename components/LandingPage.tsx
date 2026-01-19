import React from 'react';

export type LandingNav = 'home' | 'legal' | 'enterprise' | 'privacy' | 'terms' | 'safety';

interface LandingPageProps {
  onStartAuth: (role: 'customer' | 'company' | 'admin') => void;
  onNavigate: (page: LandingNav) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAuth, onNavigate }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-100 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 uppercase">BoxDefense</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
          <button onClick={() => onNavigate('enterprise')} className="hover:text-blue-600">Solutions</button>
          <button onClick={() => onNavigate('legal')} className="hover:text-blue-600">Legal</button>
          <button onClick={() => onNavigate('enterprise')} className="hover:text-blue-600">Enterprise</button>
        </div>
        <button 
          onClick={() => onStartAuth('customer')}
          className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-800 transition-all"
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-6">
            Trusted by Top Carriers
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
            Legally Defense Your Move.
          </h1>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            The industry-standard inventory documentation system. Create photo-backed, timestamped records that reduce liability and eliminate insurance disputes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => onStartAuth('customer')}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              Start My Inventory
            </button>
            <button 
              onClick={() => onStartAuth('company')}
              className="bg-white border-2 border-slate-200 text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg hover:border-slate-300 transition-all"
            >
              Corporate Portal
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="bg-slate-100 rounded-[3rem] aspect-square flex items-center justify-center p-8">
            <div className="bg-white rounded-3xl shadow-2xl w-full h-full overflow-hidden border border-slate-200">
              <div className="p-6 border-b border-slate-100 flex justify-between">
                <div className="h-4 w-32 bg-slate-100 rounded"></div>
                <div className="h-4 w-8 bg-blue-100 rounded"></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                   <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                   </svg>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded"></div>
                <div className="h-4 w-2/3 bg-slate-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Roles */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Select your entry point</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <button onClick={() => onStartAuth('customer')} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:border-blue-500 transition-all text-left group">
              <div className="text-blue-600 mb-4 font-bold text-sm uppercase group-hover:scale-110 transition-transform origin-left">Personal</div>
              <h3 className="text-xl font-bold mb-2">Customers</h3>
              <p className="text-slate-500 text-sm">Secure your move with full photo inventory and digital signature.</p>
            </button>
            <button onClick={() => onStartAuth('company')} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:border-blue-500 transition-all text-left group">
              <div className="text-blue-600 mb-4 font-bold text-sm uppercase group-hover:scale-110 transition-transform origin-left">Corporate</div>
              <h3 className="text-xl font-bold mb-2">Moving Companies</h3>
              <p className="text-slate-500 text-sm">Manage assigned inventories, review evidence, and export documents.</p>
            </button>
            <button onClick={() => onStartAuth('admin')} className="bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-800 hover:bg-slate-800 transition-all text-left text-white group">
              <div className="text-blue-400 mb-4 font-bold text-sm uppercase group-hover:scale-110 transition-transform origin-left">Operations</div>
              <h3 className="text-xl font-bold mb-2">System Admin</h3>
              <p className="text-slate-400 text-sm">Oversee global system health, resolve disputes, and manage users.</p>
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-500 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-xs">&copy; 2024 BoxDefense Inc. US Patent Pending. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold uppercase tracking-widest">
            <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">Terms of Service</button>
            <button onClick={() => onNavigate('safety')} className="hover:text-white transition-colors">Safety Report</button>
          </div>
        </div>
      </footer>
    </div>
  );
};