'use client';

import { useState, useMemo } from 'react';

interface Props {
  onApply: () => void;
}

function formatINR(n: number) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export default function EMICalculator({ onApply }: Props) {
  const [amount, setAmount] = useState(100000);
  const [tenure, setTenure] = useState(12);
  const [rate, setRate] = useState(18);

  const { emi, totalPayable, totalInterest } = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure;
    const emi = n === 0 ? 0 : (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - amount;
    return { emi, totalPayable, totalInterest };
  }, [amount, tenure, rate]);

  const interestPct = totalPayable > 0 ? (totalInterest / totalPayable) * 100 : 0;
  const principalPct = 100 - interestPct;

  return (
    <section id="emi-calculator" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Calculator</p>
          <h2 className="text-4xl font-bold text-blue-900 mb-4">EMI Calculator</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Plan your loan repayment. Adjust the sliders to see how different amounts and tenures affect your monthly payments.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Sliders */}
          <div className="bg-blue-50 rounded-3xl border border-blue-100 p-8 space-y-8">
            {/* Loan Amount */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-blue-900">Loan Amount</label>
                <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-lg">{formatINR(amount)}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={500000}
                step={5000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>₹10,000</span>
                <span>₹5,00,000</span>
              </div>
            </div>

            {/* Tenure */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-blue-900">Tenure</label>
                <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-lg">{tenure} months</span>
              </div>
              <input
                type="range"
                min={3}
                max={24}
                step={1}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>3 months</span>
                <span>24 months</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-blue-900">Interest Rate (p.a.)</label>
                <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-lg">{rate}%</span>
              </div>
              <input
                type="range"
                min={12}
                max={24}
                step={0.5}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>12% p.a.</span>
                <span>24% p.a.</span>
              </div>
            </div>

            {/* Rates info */}
            <div className="bg-white rounded-2xl border border-blue-100 p-4 space-y-1.5 text-xs">
              <p className="font-semibold text-blue-800 mb-2">Rates & Charges</p>
              {[
                ['Loan Amount', '₹5,000 to ₹5,00,000'],
                ['Tenure', '3 to 24 months'],
                ['No Pre-closure Charges', '—'],
                ['No Prepayment Charges', '—'],
                ['Processing Fee', 'Up to 2%'],
                ['Min. Net Monthly Salary', '≥ ₹40,000'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-gray-500">
                  <span>• {k}</span>
                  <span className="text-blue-700 font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-5">
            {/* Monthly EMI card */}
            <div className="bg-blue-600 text-white rounded-3xl p-8 shadow-xl shadow-blue-200">
              <p className="text-blue-200 text-sm font-medium mb-1">Monthly EMI</p>
              <p className="text-5xl font-bold mb-1">{formatINR(emi)}</p>
              <p className="text-blue-300 text-sm">per month for {tenure} months</p>
            </div>

            {/* Breakdown */}
            <div className="bg-blue-50 rounded-3xl border border-blue-100 p-6 space-y-4">
              <p className="text-sm font-semibold text-blue-900 uppercase tracking-wide">Loan Summary</p>

              <div className="space-y-3">
                {[
                  { label: 'Principal Amount', value: formatINR(amount), color: 'text-blue-600' },
                  { label: 'Total Interest', value: formatINR(totalInterest), color: 'text-orange-500' },
                  { label: 'Total Payable', value: formatINR(totalPayable), color: 'text-blue-900', bold: true },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className={`text-sm ${row.bold ? 'font-bold text-blue-900' : 'text-gray-500'}`}>{row.label}</span>
                    <span className={`text-sm font-bold ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Visual bar */}
              <div className="mt-4">
                <div className="flex rounded-full overflow-hidden h-3">
                  <div
                    className="bg-blue-600 transition-all duration-500"
                    style={{ width: `${principalPct}%` }}
                  />
                  <div
                    className="bg-orange-300 transition-all duration-500"
                    style={{ width: `${interestPct}%` }}
                  />
                </div>
                <div className="flex gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full" /> Principal
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-2.5 h-2.5 bg-orange-300 rounded-full" /> Interest
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onApply}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl transition-colors shadow-md shadow-blue-200 text-sm"
            >
              Apply Now — Get {formatINR(amount)}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
