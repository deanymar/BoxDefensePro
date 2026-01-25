
import React, { useState } from 'react';
import { Button, Input, Badge, Modal, Card, Select } from '../components/UI';
import { Shield, Smartphone, Box as BoxIcon, Building2, ArrowLeft, Sun, Moon, User, Check, Zap, Star, TrendingUp, Sparkles, Clock, ShieldCheck, Mail, UserPlus, Truck } from 'lucide-react';

interface AuthProps {
  onLoginCustomer: (phone: string) => void;
  onLoginCompany: (companyName: string, plan?: string) => void;
  onLoginDummyCompany: () => void;
  onBackToHome: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  onSuccess: () => void;
}

type AuthStep = 'role' | 'customer-phone' | 'verify' | 'company-signin' | 'company-signup-info';

export const Auth: React.FC<AuthProps> = ({ 
  onLoginCustomer, 
  onLoginCompany, 
  onLoginDummyCompany,
  onBackToHome,
  onToggleTheme,
  isDarkMode,
  onSuccess
}) => {
  const [step, setStep] = useState<AuthStep>('role');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  
  // Sign In State
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  
  // Sign Up State
  const [signupData, setSignupData] = useState({
    companyName: '',
    repName: '',
    email: '',
    phone: '',
    fleetSize: '1-5'
  });

  // Subscription state
  const [showUpsell, setShowUpsell] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length === 10) setStep('verify');
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 4) {
      onLoginCustomer(phone);
      onSuccess();
    }
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName && password) {
      onLoginCompany(companyName);
      onSuccess();
    }
  };

  const handleSignUpInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowUpsell(true);
  };

  const handlePlanSelection = (planName: string) => {
    setIsProvisioning(true);
    setTimeout(() => {
      setIsProvisioning(false);
      setShowUpsell(false);
      onLoginCompany(signupData.companyName || "New Carrier", planName);
      onSuccess();
    }, 2000);
  };

  const handleDemoLogin = () => {
    onLoginDummyCompany();
    onSuccess();
  };

  const commonFeatures = [
    "Unlimited Cargo Registry",
    "4-Point Photo Verification",
    "Certified Liability Ledgers",
    "Real-time Claim Auditing",
    "24/7 Enterprise Support"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 no-print transition-colors duration-500">
      <nav className="p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
           <button onClick={onBackToHome} className="flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
           </button>
           <button onClick={onToggleTheme} className="p-3 rounded-xl bg-white dark:bg-slate-800 text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700">
             {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
           </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto w-full space-y-12 pb-20">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-emerald-600 rounded-3xl shadow-xl shadow-emerald-500/20 mb-2">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic text-center">BOXDEFENSE <span className="text-emerald-600">PRO</span></h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] italic">Verified Carrier Logistics Protocol</p>
        </div>

        {step === 'role' && (
          <div className="grid grid-cols-1 gap-6 w-full animate-in slide-in-from-bottom-4">
             <div className="text-center mb-4">
               <h2 className="text-2xl font-black text-slate-800 dark:text-white">Enterprise Access</h2>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 italic">Select your authentication portal</p>
             </div>
            <button 
              onClick={() => setStep('company-signin')}
              className="p-10 bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 rounded-[3rem] text-left hover:border-emerald-500 hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 p-8 bg-emerald-600/5 rounded-full group-hover:bg-emerald-600/10 transition-colors">
                <Building2 className="w-16 h-16 text-emerald-600/20" />
              </div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <Building2 className="w-12 h-12 text-emerald-600" />
                <Badge variant="emerald">Logistics Partner</Badge>
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 relative z-10">Carrier Dashboard</h3>
              <p className="text-sm text-slate-500 font-bold leading-relaxed italic relative z-10">"Manage fleet protection and audit cargo registries."</p>
            </button>
            <button 
              onClick={() => setStep('customer-phone')}
              className="p-10 bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 rounded-[3rem] text-left hover:border-blue-500 hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 p-8 bg-blue-600/5 rounded-full group-hover:bg-blue-600/10 transition-colors">
                <User className="w-16 h-16 text-blue-600/20" />
              </div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <User className="w-12 h-12 text-blue-600" />
                <Badge variant="blue">Client Portal</Badge>
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 relative z-10">Client Inventory</h3>
              <p className="text-sm text-slate-500 font-bold leading-relaxed italic relative z-10">"Verify itemized boxes and track liability status."</p>
            </button>
          </div>
        )}

        {step === 'company-signin' && (
          <div className="w-full space-y-8 animate-in slide-in-from-right-4">
             <div className="space-y-2">
               <h2 className="text-3xl font-black text-slate-800 dark:text-white">Partner Sign-In</h2>
               <p className="text-slate-500 font-bold uppercase tracking-tight text-xs italic">Access Enterprise Cargo Management</p>
             </div>
             <form onSubmit={handleSignInSubmit} className="space-y-4">
               <Input label="Carrier ID / Username" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
               <Input label="Access Credential" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
               <Button fullWidth size="xl" variant="success" type="submit" disabled={!companyName || !password}>Enter Carrier Network</Button>
               
               <div className="pt-2">
                 <Button fullWidth variant="ghost" className="text-emerald-600 font-black" icon={UserPlus} onClick={() => setStep('company-signup-info')}>
                   New Carrier? Sign Up Now
                 </Button>
               </div>
             </form>
             <div className="relative py-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div><div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-slate-50 dark:bg-slate-950 px-4 text-slate-400">Quick Access</span></div></div>
             <Button fullWidth variant="secondary" onClick={handleDemoLogin}>Demo: Precision Movers</Button>
             <button onClick={() => setStep('role')} className="w-full text-center text-xs font-black uppercase tracking-widest text-slate-400 py-4">Switch Portal</button>
          </div>
        )}

        {step === 'company-signup-info' && (
          <div className="w-full space-y-8 animate-in slide-in-from-right-4">
             <div className="space-y-2">
               <h2 className="text-3xl font-black text-slate-800 dark:text-white">Carrier Registration</h2>
               <p className="text-slate-500 font-bold uppercase tracking-tight text-xs italic">Deploy your liability protection network</p>
             </div>
             <form onSubmit={handleSignUpInfoSubmit} className="space-y-4">
               <Input label="Company Name" placeholder="e.g. Precision Logistics" value={signupData.companyName} onChange={(e) => setSignupData({...signupData, companyName: e.target.value})} required />
               <Input label="Primary Representative" placeholder="Full Name" value={signupData.repName} onChange={(e) => setSignupData({...signupData, repName: e.target.value})} required />
               <Input label="Work Email" type="email" placeholder="contact@company.com" value={signupData.email} onChange={(e) => setSignupData({...signupData, email: e.target.value})} required />
               <Input label="Business Phone" placeholder="(555) 555-5555" value={signupData.phone} onChange={(e) => setSignupData({...signupData, phone: formatPhoneNumber(e.target.value)})} required />
               
               <div className="space-y-2">
                 <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">Fleet Size</label>
                 <div className="grid grid-cols-3 gap-2">
                    {['1-5', '6-20', '21+'].map(size => (
                      <button 
                        key={size}
                        type="button"
                        onClick={() => setSignupData({...signupData, fleetSize: size})}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${signupData.fleetSize === size ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'}`}
                      >
                        {size} Trucks
                      </button>
                    ))}
                 </div>
               </div>

               <Button fullWidth size="xl" variant="success" type="submit" className="mt-6">Next: Select Plan</Button>
               
               <Button fullWidth variant="ghost" className="text-slate-400 font-black" onClick={() => setStep('company-signin')}>
                 Already have an account? Sign In
               </Button>
             </form>
          </div>
        )}

        {step === 'customer-phone' && (
          <div className="w-full space-y-8 animate-in slide-in-from-right-4">
             <div className="space-y-2 text-center">
               <h2 className="text-3xl font-black text-slate-800 dark:text-white">Client Portal</h2>
               <p className="text-slate-500 font-bold text-xs uppercase italic tracking-widest">Phone ID Verification Required</p>
             </div>
             <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <Input 
                  label="Verified Cell Number" 
                  placeholder="(555) 555-5555" 
                  value={phone} 
                  onChange={(e) => setPhone(formatPhoneNumber(e.target.value))} 
                  required 
                  className="text-2xl text-center font-black"
                />
                <Button fullWidth size="xl" type="submit" disabled={phone.replace(/\D/g, '').length !== 10}>Dispatch Access Link</Button>
             </form>
             <button onClick={() => setStep('role')} className="w-full text-center text-xs font-black uppercase tracking-widest text-slate-400">Switch Portal</button>
          </div>
        )}

        {step === 'verify' && (
          <div className="w-full space-y-8 animate-in slide-in-from-right-4 text-center">
             <div className="space-y-2">
               <h2 className="text-3xl font-black text-slate-800 dark:text-white">Secure Identity</h2>
               <p className="text-slate-500 font-bold italic tracking-tight">Access code dispatched to {phone}</p>
             </div>
             <form onSubmit={handleVerifySubmit} className="space-y-6">
                <Input 
                  maxLength={4} 
                  value={code} 
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} 
                  required 
                  className="text-4xl text-center font-black py-6 tracking-[1rem]" 
                />
                <Button fullWidth size="xl" type="submit" disabled={code.length !== 4}>Authenticate Registry</Button>
             </form>
          </div>
        )}
      </div>

      <Modal 
        isOpen={showUpsell} 
        onClose={() => setShowUpsell(false)} 
        title="Enterprise Partner Licensing" 
        className="max-w-5xl"
      >
        <div className="space-y-10 py-4">
           <div className="text-center space-y-3">
              <div className="inline-flex p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl mb-2">
                <Sparkles className="w-8 h-8 text-emerald-600 animate-pulse" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white italic leading-tight">Elite Mover Protection</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px] bg-emerald-100 dark:bg-emerald-900/30 px-4 py-1 rounded-full inline-block">Every plan includes 1st Month Free & all Premium features</p>
           </div>

           {isProvisioning ? (
             <div className="py-20 flex flex-col items-center justify-center space-y-6 animate-in fade-in">
                <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-xs">Provisioning Enterprise Node...</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Monthly Plan */}
                <Card className="p-8 border-none bg-white dark:bg-slate-900 hover:ring-2 hover:ring-emerald-500 transition-all group flex flex-col justify-between shadow-xl">
                   <div>
                      <div className="mb-4">
                         <Badge variant="slate">Flexible</Badge>
                      </div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tighter">Logistics Basic</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest">Monthly + 1 Month Free</p>
                      
                      <div className="space-y-3 mb-10">
                         <div className="flex items-center text-[10px] font-black uppercase text-emerald-600 italic animate-bounce">
                           <Star className="w-3 h-3 mr-2" /> 1st Month Free
                         </div>
                         {commonFeatures.map((f, i) => (
                           <div key={i} className="flex items-center text-[11px] font-bold text-slate-800 dark:text-slate-300">
                             <Check className="w-3.5 h-3.5 mr-3 text-emerald-500 flex-shrink-0" /> {f}
                           </div>
                         ))}
                      </div>
                   </div>
                   
                   <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                      <div className="mb-4">
                         <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">$99</span>
                         <span className="text-xs font-bold text-slate-400 ml-1 uppercase">/month</span>
                      </div>
                      <Button fullWidth variant="success" size="lg" onClick={() => handlePlanSelection('Logistics Basic')} className="rounded-2xl">Deploy Basic</Button>
                   </div>
                </Card>

                {/* 6 Month Plan */}
                <Card className="p-8 border-none bg-white dark:bg-slate-900 ring-4 ring-emerald-500 shadow-2xl relative overflow-hidden group flex flex-col justify-between scale-105 z-10">
                   <div className="absolute top-0 right-0 bg-emerald-500 text-white px-6 py-2 font-black text-[10px] uppercase tracking-widest rounded-bl-3xl shadow-lg">Most Popular</div>
                   <div>
                      <div className="mb-6 mt-4">
                         <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600">
                            <ShieldCheck className="w-8 h-8" />
                         </div>
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tighter italic">Professional</h4>
                      <p className="text-[10px] font-black text-emerald-600 uppercase mb-6 tracking-widest italic font-bold">6 Months + 1 Month Free</p>
                      
                      <div className="space-y-3 mb-10">
                         <div className="flex items-center text-[10px] font-black uppercase text-emerald-600 italic animate-pulse mb-2">
                           <Star className="w-3 h-3 mr-2" /> 1st Month Free Included
                         </div>
                         {commonFeatures.map((f, i) => (
                           <div key={i} className="flex items-center text-[11px] font-bold text-slate-800 dark:text-slate-300">
                             <Check className="w-3.5 h-3.5 mr-3 text-emerald-500 flex-shrink-0" /> {f}
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                      <div className="mb-4">
                         <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">$540</span>
                         <span className="text-xs font-bold text-slate-400 ml-1 uppercase">/6 months</span>
                         <p className="text-[10px] font-black text-emerald-600 uppercase mt-2">EQUIV. $90/MO</p>
                      </div>
                      <Button fullWidth size="lg" variant="success" onClick={() => handlePlanSelection('Professional')} className="rounded-2xl shadow-xl shadow-emerald-500/20">Go Pro</Button>
                   </div>
                </Card>

                {/* 1 Year Plan */}
                <Card className="p-8 border-none bg-white dark:bg-slate-900 hover:ring-2 hover:ring-slate-900 transition-all group flex flex-col justify-between shadow-xl">
                   <div>
                      <div className="mb-4">
                         <Badge variant="emerald">Best Value</Badge>
                      </div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tighter">Enterprise</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest italic">1 Year + 1 Month Free</p>
                      
                      <div className="space-y-3 mb-10">
                         <div className="flex items-center text-[10px] font-black uppercase text-emerald-600 italic animate-bounce mb-2">
                           <Star className="w-3 h-3 mr-2" /> 1st Month Free Included
                         </div>
                         {commonFeatures.map((f, i) => (
                           <div key={i} className="flex items-center text-[11px] font-bold text-slate-800 dark:text-slate-300">
                             <Check className="w-3.5 h-3.5 mr-3 text-emerald-500 flex-shrink-0" /> {f}
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                      <div className="mb-4">
                         <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">$960</span>
                         <span className="text-xs font-bold text-slate-400 ml-1 uppercase">/year</span>
                         <p className="text-[10px] font-black text-emerald-600 uppercase mt-2">EQUIV. $80/MO</p>
                      </div>
                      <Button fullWidth variant="secondary" size="lg" onClick={() => handlePlanSelection('Enterprise')} className="rounded-2xl">Scale Enterprise</Button>
                   </div>
                </Card>
             </div>
           )}

           <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4 py-8 border-t-2 border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-4">
                 <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <Shield className="w-5 h-5 text-slate-400" />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure AES-256 Encryption • PCI Compliant</p>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-emerald-600">
                <TrendingUp className="w-4 h-4" /> Save $228 vs Monthly with Enterprise
              </div>
           </div>
        </div>
      </Modal>

      <div className="text-center p-10 text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">Carrier Node Alpha-9 Certified • Liability Shield Active</div>
    </div>
  );
};
