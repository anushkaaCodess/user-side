'use client';

import { useState, useEffect } from 'react';
import Toast from '../Toast';
import { createAAConsent, processAAConsent } from '@/lib/safetensor/mockApis';

export interface Step4Data {
  aaConsent: boolean;
}

interface Props {
  loanId?: string;
  onNext: (data: Step4Data) => void;
  onBack: () => void;
  /** True when we've just been redirected back from Setu with ?aa=done. */
  resumeAtAADone?: boolean;
}

type ToastState = { message: string; type: 'error' | 'success' | 'info' } | null;

type AAStage = 'idle' | 'launching' | 'verifying' | 'done';

export default function Step4({ loanId, onNext, onBack, resumeAtAADone = false }: Props) {
  const [aaStage, setAAStage] = useState<AAStage>(resumeAtAADone ? 'verifying' : 'idle');
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!resumeAtAADone) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await processAAConsent(loanId);
        if (cancelled) return;
        if (!res.success) {
          setToast({ message: res.message || 'Could not verify Account Aggregator consent. Please try again.', type: 'error' });
          setAAStage('idle');
          return;
        }
        setAAStage('done');
      } catch {
        if (cancelled) return;
        setToast({ message: 'Something went wrong while verifying your consent. Please try again.', type: 'error' });
        setAAStage('idle');
      }
    })();
    return () => { cancelled = true; };
    // Only run once, when we resume from the Setu redirect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeAtAADone]);

  async function handleOpenAA() {
    setAAStage('launching');
    try {
      const res = await createAAConsent();
      if (!res.success || !res.data?.url) {
        setToast({ message: res.message || 'Could not start Account Aggregator. Please try again.', type: 'error' });
        setAAStage('idle');
        return;
      }
      window.location.href = res.data.url;
    } catch {
      setToast({ message: 'Something went wrong. Please check your connection and try again.', type: 'error' });
      setAAStage('idle');
    }
  }

  function handleContinue() {
    if (aaStage !== 'done') { setToast({ message: 'Please complete the Account Aggregator consent first', type: 'error' }); return; }
    onNext({ aaConsent: true });
  }

  return (
    <div className="pt-2 pb-4 space-y-5">
      {toast && (
        <div className="sticky top-0 z-10 -mx-1">
          <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
        </div>
      )}

      {/* Account Aggregator */}
      <div className="rounded-2xl border-2 border-blue-100 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-50 px-5 py-4 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900">Account Aggregator</p>
              <p className="text-xs text-gray-400">RBI-regulated financial data sharing</p>
            </div>
            {aaStage === 'done' && (
              <div className="ml-auto flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                Consent Given
              </div>
            )}
          </div>
        </div>

        <div className="p-5">
          {aaStage === 'idle' && (
            <>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                We use the Account Aggregator framework to securely fetch your bank statements for income verification.
                You&apos;ll choose your bank and confirm consent on the next screen. Your consent is required and can be revoked anytime.
              </p>
              <ul className="space-y-2 mb-5">
                {[
                  'Read-only access to your bank data',
                  'No credentials shared with us',
                  'Revocable consent at any time',
                  'Regulated by RBI under AA framework',
                ].map((p) => (
                  <li key={p} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleOpenAA}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Open Account Aggregator →
              </button>
            </>
          )}

          {(aaStage === 'launching' || aaStage === 'verifying') && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-sm font-semibold text-blue-900">
                  {aaStage === 'launching' ? 'Redirecting to Account Aggregator…' : 'Verifying your consent…'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {aaStage === 'launching' ? "You'll come back here once you're done" : 'This will only take a moment'}
                </p>
              </div>
            </div>
          )}

          {aaStage === 'done' && (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-green-700">Bank Data Fetched Successfully</p>
                <p className="text-xs text-gray-400 mt-1">Your account data has been securely shared</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border-2 border-blue-200 text-blue-600 font-semibold py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-sm"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={aaStage !== 'done'}
          className="flex-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          Submit Application →
        </button>
      </div>
    </div>
  );
}
