'use client';

import { useState, useEffect } from 'react';
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
  const [resumeAtAADone, setResumeAtAADone] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('aa') === 'done') {
      setResumeAtAADone(true);
      setApplyOpen(true);
      params.delete('aa');
      const query = params.toString();
      window.history.replaceState(null, '', window.location.pathname + (query ? `?${query}` : ''));
    }
  }, []);

  function closeApply() {
    setApplyOpen(false);
    setResumeAtAADone(false);
  }

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
      <ApplyModal isOpen={applyOpen} onClose={closeApply} resumeAtAADone={resumeAtAADone} />
    </>
  );
}
