
import React, { useState } from 'react';
import { api } from '../services/api';
import { User, UserRole } from '../types';

interface AuthProps {
  role: UserRole;
  onLogin: (user: User) => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ role, onLogin, onBack }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState('');

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 4) return setError('Invalid identifier');
    setError('');
    setStep('otp');
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '1234') return setError('Incorrect OTP. Try 1234');
    
    try {
      const user = await api.login(phone, role);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-sm space-y-8">
        <button onClick={onBack} className="text-slate-500 hover:text-white flex items-center gap-2 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        
        <div className="text-center">
          <h2 className="text-3xl font-black mb-1 capitalize">{role} Login</h2>
          <p className="text-slate-400 text-sm">Secure biometric authentication simulated.</p>
        </div>

        <form onSubmit={step === 'phone' ? handlePhoneSubmit : handleOtpSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-xs font-bold uppercase">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
              {step === 'phone' ? (role === 'admin' ? 'Admin ID' : 'Phone Number') : 'Verification Code'}
            </label>
            <input
              type={role === 'admin' ? 'text' : 'tel'}
              value={step === 'phone' ? phone : otp}
              onChange={(e) => step === 'phone' ? setPhone(e.target.value) : setOtp(e.target.value)}
              placeholder={step === 'phone' ? (role === 'admin' ? 'admin' : '555-0101') : '1234'}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-700"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-95"
          >
            {step === 'phone' ? 'Continue' : 'Verify Identity'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-8">
          Authorized use only. Session tokens are hardware-bound and legally traceable.
        </p>
      </div>
    </div>
  );
};
