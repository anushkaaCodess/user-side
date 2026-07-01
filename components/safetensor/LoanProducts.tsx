'use client';

import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  amount: string;
  rate: string;
  tenure: string;
  description: string;
  features: string[];
  available: boolean;
  emoji: string;
}

const products: Product[] = [
  {
    id: 'personal',
    name: 'Personal Loan',
    amount: '₹5,000 – ₹5,00,000',
    rate: '12% – 24% p.a.',
    tenure: '3 – 24 months',
    description: 'Quick personal loans for any purpose — medical emergencies, education, travel, or home renovation.',
    features: [
      'Minimal documentation',
      'Quick approval within 24 hours',
      'Flexible repayment options',
      'No collateral required',
      'Pre-closure available after 3 months',
    ],
    available: true,
    emoji: '💼',
  },
  {
    id: 'business',
    name: 'Business Loan',
    amount: '₹50,000 – ₹10,00,000',
    rate: '14% – 20% p.a.',
    tenure: '6 – 36 months',
    description: 'Flexible business financing solutions for entrepreneurs and small businesses to fuel growth.',
    features: [
      'Minimal documentation',
      'No collateral up to ₹30 lakhs',
      'Flexible repayment terms',
      'Tax benefits under Section 80C',
      'Business advisory support',
    ],
    available: false,
    emoji: '🏢',
  },
  {
    id: 'education',
    name: 'Education Loan',
    amount: '₹50,000 – ₹20,00,000',
    rate: '10% – 14% p.a.',
    tenure: '12 – 84 months',
    description: 'Fund your education dreams with affordable loans for studies in India and abroad.',
    features: [
      '100% financing for approved courses',
      'Moratorium period during study',
      'Tax benefits under Section 80E',
      'Flexible repayment options',
      'No prepayment penalties',
    ],
    available: false,
    emoji: '🎓',
  },
  {
    id: 'home',
    name: 'Home Renovation Loan',
    amount: '₹1,00,000 – ₹30,00,000',
    rate: '11% – 16% p.a.',
    tenure: '12 – 60 months',
    description: 'Transform your living space with quick approval and minimal documentation.',
    features: [
      'No collateral required up to ₹10 lakhs',
      'Quick disbursement',
      'Flexible repayment options',
      'Minimal documentation',
      'Tax benefits available',
    ],
    available: false,
    emoji: '🏠',
  },
  {
    id: 'wedding',
    name: 'Wedding Loan',
    amount: '₹1,00,000 – ₹15,00,000',
    rate: '13% – 18% p.a.',
    tenure: '12 – 48 months',
    description: 'Make your special day memorable without financial stress. Easy application and quick approval.',
    features: [
      'No security or collateral required',
      'Flexible repayment options',
      'Quick approval and disbursement',
      'Minimal documentation',
      'Special rates for existing customers',
    ],
    available: false,
    emoji: '💍',
  },
];

interface Props {
  onApply: () => void;
}

export default function LoanProducts({ onApply }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section id="loan-products" className="py-24 bg-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Products</p>
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Our Loan Products</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Explore our range of flexible loan options designed to meet your various financial needs.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <div
              key={p.id}
              className={`relative bg-white rounded-3xl border-2 transition-all duration-200 overflow-hidden ${
                p.available
                  ? 'border-blue-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 cursor-pointer'
                  : 'border-blue-100 opacity-70'
              } ${selected === p.id && p.available ? 'border-blue-500 shadow-lg shadow-blue-100' : ''}`}
              onClick={() => p.available && setSelected(selected === p.id ? null : p.id)}
            >
              {!p.available && (
                <div className="absolute top-4 right-4 bg-blue-100 text-blue-500 text-xs font-bold px-2.5 py-1 rounded-full">
                  Coming Soon
                </div>
              )}
              {p.available && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  Available
                </div>
              )}

              <div className="p-6">
                <div className="text-3xl mb-4">{p.emoji}</div>
                <h3 className="text-lg font-bold text-blue-900 mb-3">{p.name}</h3>

                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-medium">Amount</span>
                    <span className="font-bold text-blue-800">{p.amount}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-medium">Interest Rate</span>
                    <span className="font-bold text-blue-800">{p.rate}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-medium">Tenure</span>
                    <span className="font-bold text-blue-800">{p.tenure}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed mb-4">{p.description}</p>

                {/* Expandable features */}
                {(selected === p.id || !p.available) && (
                  <div className="border-t border-blue-100 pt-4">
                    <p className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wide">Key Features</p>
                    <ul className="space-y-1.5">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-gray-500">
                          <span className="mt-0.5 w-3.5 h-3.5 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                            <svg className="w-2 h-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {p.available && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onApply(); }}
                    className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    Apply Now →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
