'use client';

import { useState } from 'react';
import Toast from '../Toast';
import { mockSendEmailOTP, mockVerifyEmailOTP } from '@/lib/safetensor/mockApis';

export interface Step3Data {
  personalEmail: string;
  workEmail: string;
}

interface Props {
  onNext: (data: Step3Data) => void;
  onBack: () => void;
}

type ToastState = { message: string; type: 'error' | 'success' | 'info' } | null;

interface EmailFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  verified: boolean;
  onVerified: () => void;
  disabled?: boolean;
}

function EmailField({ label, value, onChange, verified, onVerified, disabled }: EmailFieldProps) {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [fieldError, setFieldError] = useState('');

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  async function sendOTP() {
    if (!isValidEmail) { setFieldError('Please enter a valid email address'); return; }
    setFieldError('');
    setSending(true);
    try {
      await mockSendEmailOTP(value);
      setOtpSent(true);
    } finally {
      setSending(false);
    }
  }

  async function verifyOTP() {
    if (otp.length !== 6) { setFieldError('OTP must be 6 digits'); return; }
    setFieldError('');
    setVerifying(true);
    try {
      const res = await mockVerifyEmailOTP(value, otp);
      if (!res.success) { setFieldError(res.message ?? 'Invalid OTP'); return; }
      onVerified();
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className={`rounded-2xl border-2 p-4 transition-all ${verified ? 'border-green-300 bg-green-50' : 'border-blue-100 bg-white'}`}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-blue-800">{label} *</label>
        {verified && (
          <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            Verified
          </span>
        )}
      </div>

      {/* Email input */}
      <div className="flex gap-2">
        <input
          type="email"
          value={value}
          onChange={(e) => { onChange(e.target.value); setOtpSent(false); setOtp(''); }}
          placeholder="you@example.com"
          disabled={verified || disabled}
          className="flex-1 border border-blue-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400 transition-all"
        />
        {!verified && !otpSent && (
          <button
            type="button"
            onClick={sendOTP}
            disabled={sending || !isValidEmail || disabled}
            className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 px-3 py-2.5 rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
          >
            {sending ? (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
            ) : null}
            Send OTP
          </button>
        )}
      </div>

      {/* OTP input */}
      {!verified && otpSent && (
        <div className="mt-3 flex gap-2">
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="6-digit OTP"
            maxLength={6}
            className="flex-1 border border-blue-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-center font-mono tracking-widest transition-all"
          />
          <button
            type="button"
            onClick={verifyOTP}
            disabled={verifying || otp.length !== 6}
            className="text-xs font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-40 px-3 py-2.5 rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
          >
            {verifying ? (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
            ) : null}
            Verify
          </button>
          <button
            type="button"
            onClick={() => { setOtpSent(false); setOtp(''); }}
            className="text-xs text-blue-500 hover:text-blue-700 font-medium px-2 transition-colors"
          >
            Resend
          </button>
        </div>
      )}

      {fieldError && (
        <p className="text-xs text-red-500 font-medium mt-1.5">{fieldError}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Step3({ onNext, onBack }: Props) {
  const [personalEmail, setPersonalEmail] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [personalVerified, setPersonalVerified] = useState(false);
  const [workVerified, setWorkVerified] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  function handleContinue() {
    if (!personalVerified) { setToast({ message: 'Please verify your personal email', type: 'error' }); return; }
    if (!workVerified) { setToast({ message: 'Please verify your work email', type: 'error' }); return; }
    if (personalEmail.toLowerCase() === workEmail.toLowerCase()) {
      setToast({ message: 'Personal email and work email cannot be the same', type: 'error' }); return;
    }
    onNext({ personalEmail, workEmail });
  }

  const sameEmailWarning =
    personalEmail &&
    workEmail &&
    personalEmail.toLowerCase() === workEmail.toLowerCase();

  return (
    <div className="pt-2 pb-4 space-y-4">
      {toast && (
        <div className="sticky top-0 z-10 -mx-1">
          <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
        </div>
      )}

      <p className="text-xs text-gray-400 leading-relaxed">
        We need to verify both your personal and work email addresses. These must be different.
      </p>

      <EmailField
        label="Personal Email"
        value={personalEmail}
        onChange={(v) => { setPersonalEmail(v); setPersonalVerified(false); }}
        verified={personalVerified}
        onVerified={() => setPersonalVerified(true)}
      />

      <EmailField
        label="Work Email"
        value={workEmail}
        onChange={(v) => { setWorkEmail(v); setWorkVerified(false); }}
        verified={workVerified}
        onVerified={() => setWorkVerified(true)}
        disabled={!personalVerified}
      />

      {sameEmailWarning && (
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 rounded-xl px-4 py-2.5 text-xs font-medium">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Personal and work email cannot be the same address.
        </div>
      )}

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
          disabled={!personalVerified || !workVerified || !!sameEmailWarning}
          className="flex-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
