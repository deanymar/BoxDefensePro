
import React, { useState } from 'react';
import { Button, Card, Badge } from '../components/UI';
import { 
  Shield, Camera, ClipboardCheck, ArrowRight, 
  CheckCircle2, Building2, User, Star, Share2, 
  ShieldCheck, Smartphone, Lock, Zap, FileWarning, PlayCircle,
  Check, Info, TrendingUp, Sparkles, Clock, Scale, Eye, FileText, Gavel, Truck
} from 'lucide-react';
import { User as UserType } from '../types';

interface LandingProps {
  onStart: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  onShowDemo?: () => void;
  currentUser?: UserType | null;
}

type SubPage = 'home' | 'features' | 'pricing' | 'how-it-works' | 'terms' | 'privacy' | 'compliance';

export const Landing: React.FC<LandingProps> = ({ onStart, onToggleTheme, isDarkMode, onShowDemo, currentUser }) => {
  const [activePage, setActivePage] = useState<SubPage>('home');

  const navigateTo = (page: SubPage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const commonFeatures = [
    "Unlimited Cargo Registry",
    "4-Point Photo Verification",
    "Certified Liability Ledgers",
    "Real-time Claim Auditing",
    "24/7 Enterprise Support"
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 selection:bg-emerald-100 dark:selection:bg-emerald-900">
      <nav className="sticky top-0 z-50 glass-morphism border-b border-slate-200/50 dark:border-slate-800/50 px-4 md:px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => navigateTo('home')}>
            <div className="bg-emerald-600 p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">BoxDefense <span className="text-emerald-600">PRO</span></span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden lg:flex items-center space-x-8">
              <button onClick={() => navigateTo('features')} className={`text-xs uppercase font-black tracking-widest transition-colors ${activePage === 'features' ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-400 hover:text-emerald-600'}`}>Solutions</button>
              <button onClick={() => navigateTo('pricing')} className={`text-xs uppercase font-black tracking-widest transition-colors ${activePage === 'pricing' ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-400 hover:text-emerald-600'}`}>Pricing</button>
              <button onClick={() => navigateTo('how-it-works')} className={`text-xs uppercase font-black tracking-widest transition-colors ${activePage === 'how-it-works' ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-400 hover:text-emerald-600'}`}>Methodology</button>
            </div>
            <Button size="md" variant="success" onClick={onStart} className="rounded-xl px-8 font-black text-xs uppercase tracking-widest">
              {currentUser ? 'Dashboard' : 'Deploy'}
            </Button>
          </div>
        </div>
      </nav>

      <main className="animate-in fade-in duration-500">
        {activePage === 'home' && (
          <div className="space-y-32">
            <section className="px-4 md:px-6 pt-24 pb-32 max-w-6xl mx-auto text-center space-y-12">
              <div className="flex justify-center">
                <Badge variant="emerald">Enterprise Move Protection</Badge>
              </div>
              
              <h1 className="text-6xl md:text-9xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter uppercase italic">
                Defend Your <br />
                <span className="text-emerald-600">Logistics.</span>
              </h1>
              
              <p className="text-lg md:text-2xl text-slate-800 dark:text-slate-400 max-w-3xl mx-auto font-bold leading-relaxed">
                Secure every box with verified photo evidence. BoxDefense Pro is the industry standard for eliminating false liability claims.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                <Button size="xl" variant="success" icon={ArrowRight} onClick={onStart} className="w-full sm:w-80 shadow-2xl shadow-emerald-500/40 rounded-[2rem]">
                  {currentUser ? 'Enter Portal' : 'Start Free Trial'}
                </Button>
                {onShowDemo && (
                  <Button variant="secondary" size="xl" icon={PlayCircle} onClick={onShowDemo} className="w-full sm:w-auto rounded-[2rem] border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 px-10">Live Demo</Button>
                )}
              </div>

              <div className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                {[
                  { icon: Camera, title: "Visual Proof", desc: "4 photos per box & item with tamper-proof timestamps." },
                  { icon: ShieldCheck, title: "Chain of Custody", desc: "Digital signatures from customer & carrier at every step." },
                  { icon: ClipboardCheck, title: "Audit Ledgers", desc: "Auto-generated PDFs ready for insurance verification." },
                  { icon: Zap, title: "Instant Claims", desc: "Report damage in real-time with zero paperwork." }
                ].map((item, i) => (
                  <Card key={i} className="p-8 border-none bg-white dark:bg-slate-900 shadow-xl">
                    <item.icon className="w-8 h-8 text-emerald-600 mb-6" />
                    <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{item.title}</h4>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {activePage === 'pricing' && (
          <section className="px-4 md:px-6 py-24 max-w-6xl mx-auto space-y-16 animate-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-4">
              <Badge variant="emerald">Transparent Logistics Pricing</Badge>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight">Scale Your <span className="text-emerald-600">Defense.</span></h2>
              <p className="text-slate-800 dark:text-slate-300 font-black max-w-2xl mx-auto italic text-lg">First month is on us for all plans. Full feature parity across every tier.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
              {/* Plan 1 */}
              <Card className="p-10 border-none bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between hover:shadow-emerald-500/10 transition-all duration-500 rounded-[3rem]">
                <div>
                   <div className="flex justify-between items-start mb-8">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700">
                         <Star className="w-8 h-8" />
                      </div>
                      <Badge variant="slate">Flexible</Badge>
                   </div>
                   <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter italic">Logistics Basic</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Monthly + 1 Month Free</p>
                   
                   <ul className="space-y-4 mb-12">
                      <li className="flex items-center text-emerald-600 font-black italic text-xs animate-bounce bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-xl w-fit">
                         <Check className="w-4 h-4 mr-3" /> 1st MONTH $0 FREE
                      </li>
                      {commonFeatures.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm font-bold text-slate-900 dark:text-slate-300">
                           <Check className="w-4 h-4 mr-3 text-emerald-500 flex-shrink-0" /> {feature}
                        </li>
                      ))}
                   </ul>
                </div>
                <div>
                   <div className="mb-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">$99</span>
                      <span className="text-slate-500 font-bold ml-2 uppercase text-xs">/month</span>
                   </div>
                   <Button fullWidth size="xl" variant="success" onClick={onStart} className="rounded-2xl">Start Free Trial</Button>
                </div>
              </Card>

              {/* Plan 2 - Most Popular */}
              <Card className="p-10 border-none bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between scale-110 relative overflow-hidden group ring-[6px] ring-emerald-500 shadow-emerald-500/30 rounded-[3.5rem] z-10">
                <div className="absolute top-0 left-0 bg-emerald-600 px-8 py-3 font-black text-[11px] uppercase tracking-[0.2em] rounded-br-[2rem] text-white shadow-xl">Most Popular</div>
                
                <div className="relative z-10 mt-6">
                   <div className="flex justify-between items-start mb-8">
                      <div className="p-4 bg-emerald-600 rounded-2xl text-white shadow-xl shadow-emerald-500/40">
                         <ShieldCheck className="w-8 h-8" />
                      </div>
                   </div>
                   <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter italic leading-none">Professional</h3>
                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-10 italic font-bold">6 Months + 1 Month Free</p>
                   
                   <ul className="space-y-4 mb-12">
                      <li className="flex items-center text-emerald-600 font-black italic text-xs animate-pulse bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-xl w-fit">
                         <Check className="w-4 h-4 mr-3" /> 1st MONTH $0 FREE
                      </li>
                      <li className="flex items-center text-emerald-600 font-black italic text-xs">
                         <TrendingUp className="w-4 h-4 mr-3" /> Save $54 over monthly
                      </li>
                      {commonFeatures.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm font-bold text-slate-900 dark:text-slate-200">
                           <Check className="w-4 h-4 mr-3 text-emerald-500 flex-shrink-0" /> {feature}
                        </li>
                      ))}
                   </ul>
                </div>
                <div className="relative z-10 pt-6 border-t border-slate-100 dark:border-slate-800">
                   <div className="mb-6">
                      <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">$540</span>
                      <span className="text-emerald-500 font-black ml-2 uppercase text-xs">/6 months</span>
                      <p className="text-[11px] font-black text-emerald-600 uppercase mt-2 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full w-fit">Equiv. $90/mo</p>
                   </div>
                   <Button fullWidth size="xl" variant="success" onClick={onStart} className="rounded-2xl shadow-2xl shadow-emerald-500/40 text-lg uppercase tracking-widest">Deploy Pro Defense</Button>
                </div>
              </Card>

              {/* Plan 3 */}
              <Card className="p-10 border-none bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between hover:shadow-emerald-500/10 transition-all duration-500 rounded-[3rem]">
                <div>
                   <div className="flex justify-between items-start mb-8">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-900 dark:text-white border border-slate-100 dark:border-slate-700">
                         <Building2 className="w-8 h-8" />
                      </div>
                      <Badge variant="emerald">Best Value</Badge>
                   </div>
                   <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter italic">Enterprise</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">1 Year + 1 Month Free</p>
                   
                   <ul className="space-y-4 mb-12">
                      <li className="flex items-center text-emerald-600 font-black italic text-xs animate-bounce bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-xl w-fit">
                         <Check className="w-4 h-4 mr-3" /> 1st MONTH $0 FREE
                      </li>
                      <li className="flex items-center text-slate-900 dark:text-white font-black italic text-xs">
                         <TrendingUp className="w-4 h-4 mr-3" /> Save $228 vs Monthly
                      </li>
                      {commonFeatures.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm font-bold text-slate-900 dark:text-slate-300">
                           <Check className="w-4 h-4 mr-3 text-emerald-500 flex-shrink-0" /> {feature}
                        </li>
                      ))}
                   </ul>
                </div>
                <div>
                   <div className="mb-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">$960</span>
                      <span className="text-slate-500 font-bold ml-2 uppercase text-xs">/year</span>
                      <p className="text-[11px] font-black text-slate-500 uppercase mt-2">Equiv. $80/mo</p>
                   </div>
                   <Button fullWidth size="xl" variant="secondary" onClick={onStart} className="rounded-2xl">Scale Enterprise</Button>
                </div>
              </Card>
            </div>
          </section>
        )}

        {activePage === 'terms' && (
          <section className="px-4 md:px-6 py-24 max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-4">
              <Badge variant="slate">Legal Protocol</Badge>
              <h2 className="text-5xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight">Terms of <span className="text-emerald-600">Service.</span></h2>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl space-y-8 border-2 border-slate-100 dark:border-slate-800">
              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center"><Scale className="w-6 h-6 mr-3 text-emerald-600" /> 1. Documentation Accuracy</h3>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-400 leading-relaxed">
                  BoxDefense Pro provides a platform for recording cargo condition. Users are solely responsible for the accuracy and completeness of photo evidence and itemized registries. BoxDefense does not verify the physical contents of any package.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center"><Gavel className="w-6 h-6 mr-3 text-emerald-600" /> 2. Liability Limitation</h3>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-400 leading-relaxed">
                  BoxDefense Pro is a documentation software service, not an insurance provider. Our "Registry Ledger" serves as evidence for third-party claims but does not guarantee payout from carriers or insurance companies.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center"><ShieldCheck className="w-6 h-6 mr-3 text-emerald-600" /> 3. Verification Protocol</h3>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-400 leading-relaxed">
                  The use of our digital signature and photo verification system constitutes a binding acknowledgment of the cargo state at the time of entry. Tampering with digital timestamps or signatures is grounds for immediate account termination.
                </p>
              </div>
            </div>
          </section>
        )}

        {activePage === 'privacy' && (
          <section className="px-4 md:px-6 py-24 max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-4">
              <Badge variant="emerald">Security Protocol</Badge>
              <h2 className="text-5xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight">Privacy <span className="text-emerald-600">Policy.</span></h2>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl space-y-8 border-2 border-slate-100 dark:border-slate-800">
              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center"><Eye className="w-6 h-6 mr-3 text-emerald-600" /> 1. Evidence Data Management</h3>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-400 leading-relaxed">
                  Photos uploaded to BoxDefense Pro are stored using AES-256 encryption. These images are accessible only by the account holder and authorized carrier partners who have been granted explicit access via secure move links.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center"><Smartphone className="w-6 h-6 mr-3 text-emerald-600" /> 2. Authentication Data</h3>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-400 leading-relaxed">
                  We use phone numbers for secure verification. We never sell your personal data to third-party marketing firms. Your information is used strictly for move coordination and liability verification.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center"><Lock className="w-6 h-6 mr-3 text-emerald-600" /> 3. Data Retention</h3>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-400 leading-relaxed">
                  Move registries are archived for 2 years following the move date to comply with insurance claim windows, after which they are permanently purged from our active nodes.
                </p>
              </div>
            </div>
          </section>
        )}

        {activePage === 'compliance' && (
          <section className="px-4 md:px-6 py-24 max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-4">
              <Badge variant="emerald">Audit Standard</Badge>
              <h2 className="text-5xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight">Insurance <span className="text-emerald-600">Compliance.</span></h2>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl space-y-8 border-2 border-slate-100 dark:border-slate-800">
              <div className="space-y-4">
                {/* Changed FileShield (not in lucide-react) to ShieldCheck */}
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center"><ShieldCheck className="w-6 h-6 mr-3 text-emerald-600" /> 1. Digital Evidence Standards</h3>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-400 leading-relaxed">
                  BoxDefense Pro registries meet the technical standards required by major commercial insurance underwriters for "Visual Pre-transit Proof." This includes tamper-evident metadata and 4-point exterior box verification.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center"><ClipboardCheck className="w-6 h-6 mr-3 text-emerald-600" /> 2. Chain of Custody Registry</h3>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-400 leading-relaxed">
                  Our system maintains a verifiable chain of custody, recording the exact moment documentation was frozen and signed by both the customer and the logistics carrier.
                </p>
              </div>

              <div className="space-y-4">
                {/* Fixed missing Truck import on line 310 */}
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white flex items-center"><Truck className="w-6 h-6 mr-3 text-emerald-600" /> 3. Cargo Liability Protocol</h3>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-400 leading-relaxed">
                  The BoxDefense "Itemized Audit" is formatted to integrate directly with standard claim adjustment software used by industry-leading relocation insurance providers.
                </p>
              </div>
            </div>
          </section>
        )}

        {activePage === 'features' && (
          <section className="px-4 md:px-6 py-24 max-w-6xl mx-auto space-y-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="text-center space-y-4 max-w-4xl mx-auto">
                <Badge variant="emerald">Technical Infrastructure</Badge>
                <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight">The Registry <span className="text-emerald-600">Standard.</span></h2>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <div className="space-y-8">
                   <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-500/20 text-white">
                      <Camera className="w-8 h-8" />
                   </div>
                   <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic">Ultra-High Fidelity <br /><span className="text-emerald-600">Documentation.</span></h3>
                   <p className="text-lg text-slate-800 dark:text-slate-400 font-bold leading-relaxed">
                      Capture every detail. Our specialized photo protocol ensures 4 exterior angles for every box and 4 detail shots for every item. Every byte is timestamped and encrypted.
                   </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl"><img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" /></div>
                   <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden translate-y-12 shadow-2xl"><img src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" /></div>
                </div>
             </div>
          </section>
        )}

        {activePage === 'how-it-works' && (
           <section className="px-4 md:px-6 py-24 max-w-6xl mx-auto space-y-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="text-center space-y-4 max-w-4xl mx-auto">
                 <Badge variant="emerald">The Methodology</Badge>
                 <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight">Simple. <span className="text-emerald-600">Scientific.</span></h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                 <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 hidden md:block"></div>
                 {[
                    { step: "01", title: "Deploy Link", desc: "Dispatch a secure, private inventory link to your client via SMS/Email.", icon: Smartphone },
                    { step: "02", title: "Visual Catalog", desc: "Client or crew logs inventory with mandatory photo verification.", icon: Camera },
                    { step: "03", title: "Freeze & Seal", desc: "Digital signatures finalize the record. The ledger is immutable.", icon: Lock }
                 ].map((item, i) => (
                    <div key={i} className="relative z-10 bg-slate-50 dark:bg-slate-950 p-6 flex flex-col items-center text-center space-y-6">
                       <div className="w-20 h-20 bg-emerald-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30">
                          <item.icon className="w-10 h-10" />
                       </div>
                       <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic">{item.title}</h4>
                       <p className="text-slate-800 font-bold leading-relaxed">{item.desc}</p>
                       <span className="text-5xl font-black text-slate-200 dark:text-slate-900 absolute -bottom-10 opacity-50">{item.step}</span>
                    </div>
                 ))}
              </div>
           </section>
        )}
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t-2 border-slate-100 dark:border-slate-800 pt-20 pb-10 px-6 mt-32">
         <div className="max-w-6xl mx-auto space-y-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
               <div className="col-span-1 md:col-span-1 space-y-6">
                  <div className="flex items-center space-x-2">
                    <div className="bg-emerald-600 p-2 rounded-xl">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">BoxDefense</span>
                  </div>
                  <p className="text-xs font-black text-slate-500 leading-relaxed uppercase tracking-widest">Defending the world's inventory, one verified box at a time.</p>
               </div>
               <div className="space-y-6">
                  <h5 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Protocol</h5>
                  <ul className="space-y-4 text-xs font-black text-slate-700 dark:text-slate-400 uppercase tracking-widest">
                     <li><button onClick={() => navigateTo('features')} className="hover:text-emerald-600">Solutions</button></li>
                     <li><button onClick={() => navigateTo('how-it-works')} className="hover:text-emerald-600">Methodology</button></li>
                     <li><button onClick={() => navigateTo('pricing')} className="hover:text-emerald-600">Pricing</button></li>
                  </ul>
               </div>
               <div className="space-y-6">
                  <h5 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Legal</h5>
                  <ul className="space-y-4 text-xs font-black text-slate-700 dark:text-slate-400 uppercase tracking-widest">
                     <li><button onClick={() => navigateTo('terms')} className="hover:text-emerald-600">Terms of Service</button></li>
                     <li><button onClick={() => navigateTo('privacy')} className="hover:text-emerald-600">Privacy Policy</button></li>
                     <li><button onClick={() => navigateTo('compliance')} className="hover:text-emerald-600">Insurance Compliance</button></li>
                  </ul>
               </div>
               <div className="space-y-6">
                  <h5 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">System Status</h5>
                  <div className="flex items-center space-x-3 bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">All Systems Operational</span>
                  </div>
               </div>
            </div>
            <div className="pt-10 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">&copy; 2026 BOXDEFENSE LOGISTICS TECHNOLOGIES</p>
               <div className="flex space-x-6 text-slate-300">
                  <Smartphone className="w-4 h-4" />
                  <Lock className="w-4 h-4" />
                  <ShieldCheck className="w-4 h-4" />
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};
