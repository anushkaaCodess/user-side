'use client';

import { useState, useEffect } from 'react';
import Step1, { Step1Data } from './Step1';
import Step2, { Step2Data } from './Step2';
import Step3, { Step3Data } from './Step3';
import Step4, { Step4Data } from './Step4';
import SuccessScreen from './SuccessScreen';
import { updateEmployeeDetails, updateEmails } from '@/lib/safetensor/mockApis';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  resumeAtAADone?: boolean;
}

const STEPS = [
  { n: 1, label: 'Identity' },
  { n: 2, label: 'Employment' },
  { n: 3, label: 'Emails' },
  { n: 4, label: 'AA' },
];

function genRefId() {
  return 'ST-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function ApplyModal({ isOpen, onClose, resumeAtAADone }: Props) {
  const [step, setStep] = useState(1);
  const [step1, setStep1] = useState<Step1Data | null>(null);
  const [step2, setStep2] = useState<Step2Data | null>(null);
  const [step3, setStep3] = useState<Step3Data | null>(null);
  const [step4, setStep4] = useState<Step4Data | null>(null);
  const [done, setDone] = useState(false);
  const [refId] = useState(genRefId);
  const [savingDetails, setSavingDetails] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && resumeAtAADone) setStep(4);
  }, [isOpen, resumeAtAADone]);

  async function handleStep2Next(data: Step2Data) {
    setStep2(data);
    setSavingDetails(true);
    setSaveError('');
    try {
      const res = await updateEmployeeDetails({
        employement_company_name: data.company,
        prev_salary_date: data.salaryDate,
        monthly_salary: Number(data.monthlySalary),
        pincode: data.pincode,
        location: data.location,
      });
      if (!res.success) {
        setSaveError(res.message || 'Failed to save your details. Please try again.');
        return;
      }
      setStep(3);
    } catch {
      setSaveError('Something went wrong. Please check your connection and try again.');
    } finally {
      setSavingDetails(false);
    }
  }

  async function handleStep3Next(data: Step3Data) {
    setStep3(data);
    setSavingDetails(true);
    setSaveError('');
    try {
      const res = await updateEmails(data.personalEmail, data.workEmail);
      if (!res.success) {
        setSaveError(res.message || 'Failed to save your details. Please try again.');
        return;
      }
      setStep(4);
    } catch {
      setSaveError('Something went wrong. Please check your connection and try again.');
    } finally {
      setSavingDetails(false);
    }
  }

  function reset() {
    setStep(1);
    setStep1(null);
    setStep2(null);
    setStep3(null);
    setStep4(null);
    setDone(false);
    setSavingDetails(false);
    setSaveError('');
  }

  function handleClose() {
    onClose();
    setTimeout(reset, 300);
  }

  if (!isOpen) return null;

  const STEP_TITLES: Record<number, string> = {
    1: 'Verify Identity',
    2: 'Employment Details',
    3: 'Email Verification',
    4: 'Account Aggregator',
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-blue-950/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-white sm:rounded-3xl shadow-2xl shadow-blue-200 flex flex-col max-h-[96dvh] sm:max-h-[92vh] overflow-hidden border border-blue-100">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-blue-600 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-blue-200 text-xs">SafeTensor</p>
              <p className="text-white font-bold text-sm">{done ? 'Application Submitted' : STEP_TITLES[step]}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step indicator */}
        {!done && !savingDetails && (
          <div className="px-6 pt-5 pb-2 shrink-0 bg-white border-b border-blue-50">
            <div className="flex items-center">
              {STEPS.map((s, i) => {
                const isActive = s.n === step;
                const isDone = s.n < step;
                return (
                  <div key={s.n} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isDone
                            ? 'bg-green-500 text-white'
                            : isActive
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                            : 'bg-blue-50 text-blue-300 border-2 border-blue-100'
                        }`}
                      >
                        {isDone ? (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : s.n}
                      </div>
                      <span className={`text-[10px] font-semibold ${isActive ? 'text-blue-600' : isDone ? 'text-green-500' : 'text-gray-300'}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-1 mb-4 rounded transition-colors ${i + 1 < step ? 'bg-green-400' : 'bg-blue-100'}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {done ? (
            <SuccessScreen referenceId={refId} onClose={handleClose} />
          ) : savingDetails ? (
            <div className="flex flex-col items-center gap-4 py-16">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-sm font-semibold text-blue-900">Saving your details…</p>
                <p className="text-xs text-gray-400 mt-1">This will only take a moment</p>
              </div>
            </div>
          ) : step === 1 ? (
            <Step1 onNext={(d) => { setStep1(d); setStep(2); }} />
          ) : step === 2 ? (
            <>
              {saveError && (
                <div className="sticky top-0 z-10 -mx-1 mb-4 pt-2">
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-xs font-medium">
                    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {saveError}
                  </div>
                </div>
              )}
              <Step2 onNext={handleStep2Next} onBack={() => { setStep(1); setSaveError(''); }} />
            </>
          ) : step === 3 ? (
            <>
              {saveError && (
                <div className="sticky top-0 z-10 -mx-1 mb-4 pt-2">
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-xs font-medium">
                    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {saveError}
                  </div>
                </div>
              )}
              <Step3 onNext={handleStep3Next} onBack={() => { setStep(2); setSaveError(''); }} />
            </>
          ) : (
            <Step4
              onNext={(d) => { setStep4(d); setDone(true); void step1; void step2; void step3; }}
              onBack={() => setStep(3)}
              initialAAStage={resumeAtAADone ? 'done' : 'idle'}
            />
          )}
        </div>

        {/* Secure footer */}
        {!done && (
          <div className="flex items-center justify-center gap-2 py-3 border-t border-blue-50 shrink-0 bg-white">
            <svg className="w-3.5 h-3.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-xs text-gray-400">256-bit SSL encrypted · RBI regulated</span>
          </div>
        )}
      </div>
    </div>
  );
}
