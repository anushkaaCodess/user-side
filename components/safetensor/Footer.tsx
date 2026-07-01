const navLinks = [
  { label: 'Loan Products', href: '#loan-products' },
  { label: 'EMI Calculator', href: '#emi-calculator' },
  { label: 'About Us', href: '#about' },
  { label: 'Support', href: '#support' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Fair Practices Code', href: '#' },
  { label: 'Grievance Redressal', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-bold text-lg">SafeTensor</span>
            </div>
            <p className="text-blue-300 text-sm leading-relaxed max-w-xs">
              Transparent, fast, and customer-focused personal loans. Powered by RBI-registered NBFCs and trusted technology.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <span className="bg-blue-800 border border-blue-700 text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full">
                🇮🇳 Make in India
              </span>
              <span className="bg-blue-800 border border-blue-700 text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full">
                🔒 RBI Regulated
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-semibold text-sm uppercase tracking-wider text-blue-400 mb-4">Quick Links</p>
            <ul className="space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-blue-300 hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="font-semibold text-sm uppercase tracking-wider text-blue-400 mb-4">Legal</p>
            <ul className="space-y-2.5">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-blue-300 hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* NBFC disclosure */}
        <div className="border-t border-blue-800 pt-8 mb-8">
          <p className="text-xs text-blue-400 leading-relaxed">
            <strong className="text-blue-300">NBFC Partner:</strong> GAGANDEEP SERVICES PRIVATE LIMITED · 77B, PKT-A, Vikaspuri, New Delhi – 110018, India.
            SafeTensor is a technology platform that facilitates loans issued by RBI-registered NBFCs. Loan approval and disbursement are subject to eligibility criteria, KYC norms, and lender discretion.
            Interest rates and fees vary based on your profile and are displayed transparently before acceptance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-blue-800 pt-6">
          <p className="text-xs text-blue-500">© 2024 SafeTensor. All rights reserved.</p>
          <p className="text-xs text-blue-500">Plot No. 112, Udyog Vihar, Phase 1, Gurgaon, India</p>
        </div>
      </div>
    </footer>
  );
}
