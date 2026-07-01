'use client';

import { useState } from 'react';
import Nav from './Nav';
import Hero from './Hero';
import HowItWorks from './HowItWorks';
import LoanProducts from './LoanProducts';
import EMICalculator from './EMICalculator';
import AboutUs from './AboutUs';
import Support from './Support';
import Footer from './Footer';
import ApplyModal from './apply/ApplyModal';

export default function SafeTensorLanding() {
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <>
      <Nav onApply={() => setApplyOpen(true)} />
      <main>
        <Hero onApply={() => setApplyOpen(true)} />
        <HowItWorks />
        <LoanProducts onApply={() => setApplyOpen(true)} />
        <EMICalculator onApply={() => setApplyOpen(true)} />
        <AboutUs />
        <Support />
      </main>
      <Footer />
      <ApplyModal isOpen={applyOpen} onClose={() => setApplyOpen(false)} />
    </>
  );
}
