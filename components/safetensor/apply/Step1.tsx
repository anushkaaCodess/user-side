'use client';

import { useState } from 'react';
import Toast from '../Toast';
import {
  mockSendMobileOTP,
  mockVerifyMobileOTP,
  mockCheckPANLinkage,
  mockCheckEmploymentEligibility,
} from '@/lib/safetensor/mockApis';

export interface Step1Data {
  pan: string;
  mobile: string;
  employment: 'salaried' | 'self_employed';
}

interface Props {
  onNext: (data: Step1Data) => void;
}

type ToastState = { message: string; type: 'error' | 'success' | 'info' } | null;

function validatePAN(pan: string) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
}

export default function Step1({ onNext }: Props) {
  const [pan, setPan] = useState('');
  const [mobile, setMobile] = useState('');
  const [employment, setEmployment] = useState<'salaried' | 'self_employed'>('salaried');

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  function showToast(message: string, type: NonNullable<ToastState>['type'] = 'error') {
    setToast({ message, type });
  }

  async function handleSendOTP() {
    if (!validatePAN(pan)) {
      showToast('Please enter a valid PAN (e.g. ABCDE1234F)');
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      showToast('Please enter a valid 10-digit mobile number');
      return;
    }
    setSending(true);
    try {
      await mockSendMobileOTP(mobile);
      setOtpSent(true);
      showToast('OTP sent to +91 ' + mobile, 'success');
    } finally {
      setSending(false);
    }
  }

  async function handleVerify() {
    if (otp.length !== 6) {
      showToast('Please enter the 6-digit OTP');
      return;
    }
    setVerifying(true);
    try {
      // 1. Verify OTP
      const otpRes = await mockVerifyMobileOTP(mobile, otp);
      if (!otpRes.success) {
        showToast(otpRes.message ?? 'Incorrect OTP. Please try again.');
        return;
      }

      // 2. Check employment eligibility
      const empRes = await mockCheckEmploymentEligibility(employment);
      if (!empRes.eligible) {
        showToast(empRes.reason ?? 'You are not eligible for a loan at this time.');
        return;
      }

      // 3. Check PAN–mobile linkage
      const linkRes = await mockCheckPANLinkage(pan, mobile);
      if (!linkRes.linked) {
        showToast('This phone number is not linked to the provided PAN. Please use the registered mobile number.');
        return;
      }

      onNext({ pan: pan.toUpperCase(), mobile, employment });
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="pt-2 pb-4 space-y-5">
      {toast && (
        <div className="sticky top-0 z-10 -mx-1">
          <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
        </div>
      )}

      {/* PAN */}
      <div>
        <label className="text-xs font-semibold text-blue-800 mb-1.5 block">PAN Number *</label>
        <input
          value={pan}
          onChange={(e) => setPan(e.target.value.toUpperCase().slice(0, 10))}
          placeholder="ABCDE1234F"
          maxLength={10}
          className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 tracking-widest font-mono transition-all"
        />
        <p className="text-xs text-gray-400 mt-1">Format: 5 letters · 4 digits · 1 letter</p>
      </div>

      {/* Mobile */}
      <div>
        <label className="text-xs font-semibold text-blue-800 mb-1.5 block">Mobile Number *</label>
        <div className="flex gap-2">
          <div className="flex items-center bg-blue-50 border border-blue-200 rounded-xl px-3 text-sm text-blue-700 font-semibold shrink-0">
            +91
          </div>
          <input
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="9876543210"
            maxLength={10}
            className="flex-1 border border-blue-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      {/* Employment type */}
      <div>
        <label className="text-xs font-semibold text-blue-800 mb-2 block">Employment Type *</label>
        <div className="grid grid-cols-2 gap-3">
          {(['salaried', 'self_employed'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setEmployment(type)}
              className={`flex items-center gap-2.5 border-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                employment === type
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-blue-100 text-gray-400 hover:border-blue-300'
              }`}
            >
              <span className="text-lg">{type === 'salaried' ? '💼' : '🏢'}</span>
              <span>{type === 'salaried' ? 'Salaried' : 'Self Employed'}</span>
            </button>
          ))}
        </div>
        {employment === 'self_employed' && (
          <p className="text-xs text-orange-500 font-medium mt-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Loans are currently available only to salaried individuals.
          </p>
        )}
      </div>

      {/* OTP section */}
      {!otpSent ? (
        <button
          onClick={handleSendOTP}
          disabled={sending || pan.length < 10 || mobile.length < 10}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
        >
          {sending ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
              Sending OTP…
            </>
          ) : (
            'Send OTP'
          )}
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-blue-800 mb-1.5 block">
              Enter OTP sent to +91 {mobile}
            </label>
            <div className="flex gap-2">
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit OTP"
                maxLength={6}
                className="flex-1 border border-blue-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 tracking-widest text-center font-mono text-lg transition-all"
              />
              <button
                onClick={() => { setOtp(''); setOtpSent(false); }}
                className="text-xs text-blue-500 hover:text-blue-700 font-medium px-3 shrink-0 transition-colors"
              >
                Resend
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Use any 6-digit code (demo mode)</p>
          </div>

          <button
            onClick={handleVerify}
            disabled={verifying || otp.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
          >
            {verifying ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
                Verifying…
              </>
            ) : (
              'Verify & Continue →'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
