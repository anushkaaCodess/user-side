'use client';

import { useState } from 'react';

const values = [
  {
    title: 'Transparency',
    desc: 'Every fee, rate, and term is disclosed upfront. No hidden charges, ever.',
    icon: '👁️',
  },
  {
    title: 'Trust',
    desc: 'Regulated by RBI-registered NBFCs, your funds and data are always secure.',
    icon: '🛡️',
  },
  {
    title: 'Technology',
    desc: 'Fully digital. AI-powered verification that cuts paperwork to zero.',
    icon: '⚡',
  },
  {
    title: 'Inclusion',
    desc: 'Making financial services accessible to every salaried Indian professional.',
    icon: '🤝',
  },
];

export default function AboutUs() {
  const [tab, setTab] = useState<'story' | 'values'>('story');

  return (
    <section id="about" className="py-24 bg-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Company</p>
          <h2 className="text-4xl font-bold text-blue-900 mb-4">About SafeTensor</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            We&apos;re on a mission to transform lending in India through transparency, technology, and trust.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white border border-blue-100 rounded-2xl p-1 gap-1 shadow-sm">
            {(['story', 'values'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${
                  tab === t ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                Our {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {tab === 'story' ? (
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Story text */}
            <div>
              <h3 className="text-2xl font-bold text-blue-900 mb-5">Our Story</h3>
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>
                  SafeTensor was founded with a clear and ambitious mission: to make personal lending in India
                  transparent, fast, and truly customer-focused.
                </p>
                <p>
                  Our founders, having worked in the financial sector, understood how frustrating traditional loan
                  processes can be — long paperwork, unclear terms, and slow disbursals. They set out to build a
                  fully digital lending platform that removes these barriers and empowers individuals to access the
                  funds they need, when they need them.
                </p>
                <p>
                  By partnering with top RBI-registered NBFCs, we ensure regulatory compliance while delivering a
                  smooth, tech-driven experience that puts the customer first. Our commitment to transparency,
                  innovation, and customer satisfaction drives everything we do.
                </p>
                <p>
                  As we continue to grow, SafeTensor&apos;s mission remains unchanged: to make financial services
                  more inclusive and accessible for every Indian.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                {[
                  { value: '2024', label: 'Founded' },
                  { value: 'RBI', label: 'Regulated' },
                  { value: '100%', label: 'Digital' },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-blue-100 p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-blue-600">{s.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Illustration placeholder */}
            <div className="bg-white rounded-3xl border border-blue-100 p-10 shadow-sm flex flex-col items-center justify-center gap-6 min-h-72">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-200">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-center text-blue-900 font-bold text-xl">SafeTensor</p>
              <p className="text-center text-gray-400 text-sm max-w-xs">
                Securing your financial future with transparent, technology-first lending.
              </p>
              <div className="flex gap-3">
                {['🔒', '🚀', '🇮🇳'].map((e) => (
                  <span key={e} className="text-2xl">{e}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-3xl border border-blue-100 p-7 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">{v.title}</h3>
                <p className="text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
