interface HeroProps {
  onApply: () => void;
}

const features = [
  {
    icon: (
      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Funds in Minutes*',
    subtitle: 'Quick disbursals',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: '100% Secure',
    subtitle: 'Safe & encrypted',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Clear Fees',
    subtitle: 'No hidden charges',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'RBI Regulated',
    subtitle: 'Trusted partner',
  },
];

export default function Hero({ onApply }: HeroProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F7FF 40%, #DBEAFE 100%)' }}
    >
      {/* Decorative circles */}
      <div className="absolute top-24 left-0 w-80 h-80 bg-blue-100 rounded-full opacity-40 blur-3xl -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-50 rounded-full opacity-60 blur-2xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-4 py-2 mb-8 shadow-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-blue-700 tracking-wide uppercase">
            Proudly partnered with RBI-Regulated NBFCs
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-blue-900 leading-tight mb-2">
          Transparent
          <br />
          <span className="text-blue-600">Personal Loans</span>
        </h1>
        <p className="text-3xl sm:text-4xl font-semibold text-blue-400 mt-3 mb-6">up to ₹5 Lakhs</p>

        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
          Get the funds you need with a simple digital process, clear terms, and no hidden surprises.
        </p>

        {/* Feature grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-12">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white/70 backdrop-blur-sm border border-blue-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                {f.icon}
              </div>
              <p className="text-xs font-bold text-blue-900 leading-tight">{f.title}</p>
              <p className="text-xs text-gray-400">{f.subtitle}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onApply}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-blue-200/60 transition-all duration-200 group"
        >
          Apply Now
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
        <p className="text-xs text-gray-400 mt-4">*Subject to eligibility and verification</p>
      </div>
    </section>
  );
}
