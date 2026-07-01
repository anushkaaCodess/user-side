'use client';

import { useState } from 'react';

export default function Support() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', consent: false });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setForm({ name: '', email: '', phone: '', subject: '', message: '', consent: false });
  }

  const contacts = [
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Call Us',
      line1: 'Customer Support:',
      line2: '9217846746',
      sub: 'Available 9 AM – 9 PM, Monday to Saturday',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email Us',
      line1: 'Customer Support:',
      line2: 'support@safetensor.in',
      sub: 'We typically respond within 24 hours on business days',
    },
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Visit Us',
      line1: 'SafeTensor',
      line2: 'Plot No. 112, Udyog Vihar, Phase 1, Gurgaon, India',
      sub: 'NBFC Partner: GAGANDEEP SERVICES PVT LTD, 77B, PKT-A, Vikaspuri, New Delhi – 110018',
    },
  ];

  return (
    <section id="support" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Support</p>
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Contact Our Support Team</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Have questions? Our dedicated support team is here to help with any queries related to loans, applications, or account management.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid sm:grid-cols-3 gap-5 mb-12">
          {contacts.map((c) => (
            <div key={c.title} className="bg-blue-50 rounded-3xl border border-blue-100 p-6 text-center">
              <div className="w-12 h-12 bg-white border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                {c.icon}
              </div>
              <p className="font-bold text-blue-900 mb-2">{c.title}</p>
              <p className="text-xs text-gray-400 mb-1">{c.line1}</p>
              <p className="text-sm font-semibold text-blue-700 mb-2 break-all">{c.line2}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="bg-blue-50 rounded-3xl border border-blue-100 p-8 sm:p-10 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-blue-900 mb-6">Get in Touch</h3>

          {submitted && (
            <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Your message has been sent. We&apos;ll get back to you within 24 hours.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-blue-800 mb-1.5 block">Full Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-blue-800 mb-1.5 block">Email *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-blue-800 mb-1.5 block">Phone Number *</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-blue-800 mb-1.5 block">Subject *</label>
                <input
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Enter subject"
                  className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-blue-800 mb-1.5 block">Message *</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Enter your message"
                className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all resize-none"
              />
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                className="mt-1 accent-blue-600"
              />
              <span className="text-xs text-gray-400 leading-relaxed">
                I authorize SafeTensor to send notifications via SMS / Email / WhatsApp for promotional and informative messages.
              </span>
            </label>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm shadow-md shadow-blue-200"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
