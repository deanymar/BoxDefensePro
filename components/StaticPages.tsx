import React from 'react';

const PageWrapper: React.FC<{ title: string; children: React.ReactNode; onBack: () => void }> = ({ title, children, onBack }) => (
  <div className="min-h-screen bg-white">
    <nav className="border-b border-slate-100 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
      <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
        <div className="bg-blue-600 text-white p-1.5 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900 uppercase">BoxDefense</span>
      </div>
      <button onClick={onBack} className="text-sm font-bold text-slate-500 hover:text-blue-600">Back to Home</button>
    </nav>
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black text-slate-900 mb-8">{title}</h1>
      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
        {children}
      </div>
    </main>
  </div>
);

export const LegalPage: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <PageWrapper title="Legal Information" onBack={onBack}>
    <section>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Legal Admissibility</h2>
      <p>BoxDefense inventories are designed to meet the standards of the Uniform Commercial Code (UCC) for documented carrier liability. Each record is timestamped and cryptographically signed at the point of origin.</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Dispute Resolution</h2>
      <p>Our platform serves as a neutral evidence repository. In the event of a claim, BoxDefense provides deterministic data logs to both the customer and the carrier's insurance provider.</p>
    </section>
  </PageWrapper>
);

export const EnterprisePage: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <PageWrapper title="Enterprise Solutions" onBack={onBack}>
    <p>Scale your logistics operations with our API-first documentation engine. Designed for carriers managing 100+ moves monthly.</p>
    <ul className="list-disc pl-5 space-y-2">
      <li>White-labeled customer documentation portals</li>
      <li>Fleet-wide analytics and damage forecasting</li>
      <li>Automated insurance claim filing integrations</li>
      <li>Custom RBAC for sub-contractors and agents</li>
    </ul>
    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mt-8">
      <p className="font-bold text-blue-900">Contact our sales team at enterprise@boxdefense.io for a custom quote.</p>
    </div>
  </PageWrapper>
);

export const PrivacyPolicy: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <PageWrapper title="Privacy Policy" onBack={onBack}>
    <p>Last Updated: October 2024</p>
    <p>Your inventory data is yours. BoxDefense encrypts all photo metadata and personal identifiers using AES-256 standards. We do not sell data to third-party marketers.</p>
    <h2 className="text-xl font-bold text-slate-900">Data Storage</h2>
    <p>All photos are stored in localized encrypted buckets. Access is granted only to the move owner and the assigned verified carrier during the active move window.</p>
  </PageWrapper>
);

export const TermsOfService: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <PageWrapper title="Terms of Service" onBack={onBack}>
    <p>By using BoxDefense, you agree that the inventory documentation created represents the state of goods at the time of packing. BoxDefense is not an insurance carrier but an evidence provider.</p>
    <h2 className="text-xl font-bold text-slate-900">Usage Limits</h2>
    <p>Standard accounts are limited to 4 moves per year. Enterprise licenses allow for unlimited high-volume documentation.</p>
  </PageWrapper>
);

export const SafetyReport: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <PageWrapper title="Safety & Security Report" onBack={onBack}>
    <p>BoxDefense maintains a 99.9% uptime for inventory integrity. Our biometric-first auth prevents unauthorized access to private home documentation.</p>
    <div className="grid grid-cols-2 gap-4 mt-8">
      <div className="bg-slate-50 p-4 rounded-xl">
        <p className="text-xs font-bold text-slate-400 uppercase">Encryption</p>
        <p className="text-lg font-black text-slate-900">AES-256</p>
      </div>
      <div className="bg-slate-50 p-4 rounded-xl">
        <p className="text-xs font-bold text-slate-400 uppercase">Integrity</p>
        <p className="text-lg font-black text-slate-900">SHA-256</p>
      </div>
    </div>
  </PageWrapper>
);