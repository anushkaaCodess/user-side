'use client';

import { useState } from 'react';

const steps = [
  {
    n: 1,
    title: 'Apply Online',
    short: 'Fill out our simple 2-minute application form with basic personal and income information.',
    detail:
      'Start by filling out our simple online application form. It takes just 2 minutes to complete and requires basic personal and income information.',
    bullets: ['Complete the application in just 2 minutes', 'Your data is protected with bank-grade encryption'],
    stats: [
      { value: '2 min', label: 'Application Time' },
      { value: '24 hrs', label: 'Approval Time' },
      { value: '100%', label: 'Digital Process' },
    ],
  },
  {
    n: 2,
    title: 'Quick Verification',
    subTitle: 'Verify your identity, income, and bank details securely using trusted third-party APIs.',
    short: 'We verify your identity, income, and bank details securely using trusted third-party APIs.',
    detail:
      'Our intelligent system verifies your PAN, employment, and bank account details instantly using RBI-approved data sources, with zero manual paperwork.',
    bullets: ['Real-time PAN and mobile verification', 'Bank account verified via Account Aggregator'],
    stats: [
      { value: '< 5 min', label: 'Verification Time' },
      { value: '0', label: 'Manual Documents' },
      { value: 'AA', label: 'Powered By' },
    ],
  },
  {
    n: 3,
    title: 'Get Funds',
    short: 'Once approved, funds are transferred directly to your bank account within minutes.',
    detail:
      'Upon successful verification and approval, loan funds are disbursed directly to your salary account. No cheques, no branch visits — purely digital.',
    bullets: ['Direct bank transfer to your account', 'Instant disbursal on approval'],
    stats: [
      { value: 'Instant', label: 'Disbursal' },
      { value: '₹1L', label: 'Max Amount' },
      { value: '0 visit', label: 'Branch Visits' },
    ],
  },
  {
    n: 4,
    title: 'Easy Repayment',
    short: 'Repay comfortably with auto-debit EMIs and zero pre-closure charges.',
    detail:
      'Set up auto-debit from your salary account and never miss a payment. Pre-close anytime with zero penalty charges and improve your credit score.',
    bullets: ['Auto-debit EMI setup in seconds', 'Zero pre-closure or prepayment charges'],
    stats: [
      { value: '0%', label: 'Pre-closure Fee' },
      { value: 'Auto', label: 'EMI Debit' },
      { value: '↑', label: 'Credit Score' },
    ],
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Loan Process</p>
          <h2 className="text-4xl font-bold text-blue-900 mb-4">How SafeTensor Works</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Our simple, transparent process makes getting a loan quick and hassle-free.
          </p>
        </div>

        {/* Step tabs */}
        <div className="flex gap-2 sm:gap-4 mb-10 overflow-x-auto no-scrollbar pb-1">
          {steps.map((s, i) => (
            <button
              key={s.n}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all border ${
                i === active
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                  : 'bg-white text-gray-500 border-blue-100 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                  i === active ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
                }`}
              >
                {s.n}
              </span>
              {s.title}
            </button>
          ))}
        </div>

        {/* Active step card */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: info */}
          <div className="bg-blue-50 rounded-3xl p-8 sm:p-10 border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-md shadow-blue-200">
                {step.n}
              </div>
              <h3 className="text-2xl font-bold text-blue-900">Step {step.n}: {step.title}</h3>
            </div>
            <p className="text-gray-500 leading-relaxed mb-6">{step.detail}</p>
            <ul className="space-y-3">
              {step.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-sm text-gray-600 font-medium">{b}</span>
                </li>
              ))}
            </ul>

            {/* Nav buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setActive(0)}
                disabled={active === 0}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-blue-200 text-blue-600 hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ⏮ First
              </button>
              <button
                onClick={() => setActive((a) => Math.max(0, a - 1))}
                disabled={active === 0}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-blue-200 text-blue-600 hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              <button
                onClick={() => setActive((a) => Math.min(steps.length - 1, a + 1))}
                disabled={active === steps.length - 1}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
              <button
                onClick={() => setActive(steps.length - 1)}
                disabled={active === steps.length - 1}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Last ⏭
           </button>
              
            </div>
          </div>

          {/* Right: stats */}
          <div className="grid grid-cols-3 gap-4">
            {step.stats.map((s) => (
              <div key={s.label} className="bg-white border border-blue-100 rounded-2xl p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-blue-600 mb-1">{s.value}</p>
                <p className="text-xs text-gray-400 font-medium leading-tight">{s.label}</p>
              </div>
            ))}
            
            {/* Visual step indicator */}
            <div className="col-span-3 bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
              <p className="text-xs text-gray-400 font-medium mb-4 uppercase tracking-wide">Your progress</p>
              <div className="flex items-center gap-0">
                {steps.map((s, i) => (
                  <div key={s.n} className="flex items-center flex-1 last:flex-none">
                    <button
                      onClick={() => setActive(i)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${
                        i < active
                          ? 'bg-green-500 border-green-500 text-white'
                          : i === active
                          ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-md shadow-blue-200'
                          : 'bg-white border-blue-200 text-gray-400'
                      }`}
                    >
                      {i < active ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : s.n}
                    </button>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 rounded transition-colors ${i < active ? 'bg-green-400' : 'bg-blue-100'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
