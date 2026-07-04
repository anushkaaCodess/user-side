'use client';

import { useState, useRef } from 'react';
import Toast from '../Toast';

import { extractPAN, sendOTP, verifyOTP, VerifyOTPResponse } from '@/lib/safetensor/mockApis';

export interface Step1Data {
  pan: string;
  panUserId: string;
  userId: string;
  mobile: string;
  employment: 'salaried' | 'self_employed';
  userName: string;
}

interface Props {
  onNext: (data: Step1Data) => void;
}

type ToastState = { message: string; type: 'error' | 'success' | 'info' } | null;
type PANStatus = 'idle' | 'extracting' | 'extracted' | 'error';

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

function formatDOB(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

export default function Step1({ onNext }: Props) {
  const [pan, setPan] = useState('');
  const [panStatus, setPanStatus] = useState<PANStatus>('idle');
  const [panError, setPanError] = useState('');
  const [panUserId, setPanUserId] = useState('');

  const [mobile, setMobile] = useState('');
  const [employment, setEmployment] = useState<'salaried' | 'self_employed'>('salaried');

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // After successful verify-otp, store the user profile and show identity card
  const [verifiedUser, setVerifiedUser] = useState<NonNullable<VerifyOTPResponse['data']> | null>(null);

  const [toast, setToast] = useState<ToastState>(null);

  const latestPanRef = useRef('');

  function showToast(message: string, type: NonNullable<ToastState>['type'] = 'error') {
    setToast({ message, type });
  }

  async function triggerPANExtract(panValue: string) {
    latestPanRef.current = panValue;
    setPanStatus('extracting');
    setPanError('');
    setPanUserId('');
    console.log('[PAN] Calling extractPAN API for:', panValue);
    try {
      const res = await extractPAN(panValue);
      console.log('[PAN] API response:', res);
      if (latestPanRef.current !== panValue) return;
      if (res.success && res.data) {
        setPanStatus('extracted');
        setPanUserId(res.data.id);
      } else {
        setPanStatus('error');
        setPanError(res.message ?? 'PAN verification failed. Please try again.');
      }
    } catch {
      if (latestPanRef.current !== panValue) return;
      setPanStatus('error');
      setPanError('Unable to verify PAN. Please check your connection.');
    }
  }

  function handlePANChange(raw: string) {
    const value = raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    setPan(value);
    if (panStatus !== 'idle') {
      setPanStatus('idle');
      setPanUserId('');
      setPanError('');
      setOtpSent(false);
      setOtp('');
      setVerifiedUser(null);
    }
    console.log('[PAN] length:', value.length, '| regex:', PAN_REGEX.test(value), '| value:', value);
    if (value.length === 10 && PAN_REGEX.test(value)) {
      console.log('[PAN] Triggering extract for', value);
      triggerPANExtract(value);
    }
  }

  async function handleSendOTP() {
    if (panStatus !== 'extracted') {
      showToast('Please wait for PAN verification to complete');
      return;
    }
    if (employment === 'self_employed') {
      showToast('Loans are currently available only to salaried individuals.');
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      showToast('Please enter a valid 10-digit mobile number');
      return;
    }
    setSending(true);
    try {
      const res = await sendOTP(mobile);
      if (!res.success) {
        showToast(res.message ?? 'Failed to send OTP. Please try again.');
        return;
      }
      setOtpSent(true);
      showToast('OTP sent to +91 ' + mobile, 'success');
    } catch {
      showToast('Failed to send OTP. Please check your connection.');
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
      const res = await verifyOTP({ phone: mobile, otp, pan_number: pan, account_type: employment });
      if (!res.success || !res.data) {
        showToast(res.message ?? 'OTP verification failed. Please try again.');
        return;
      }
      setVerifiedUser(res.data);
    } catch {
      showToast('Verification failed. Please check your connection.');
    } finally {
      setVerifying(false);
    }
  }

  function handleConfirm() {
    if (!verifiedUser) return;
    onNext({
      pan,
      panUserId,
      userId: verifiedUser.id,
      mobile,
      employment,
      userName: verifiedUser.full_name,
    });
  }

  const canSendOTP = panStatus === 'extracted' && mobile.length === 10 && employment === 'salaried';

  // ── Identity confirmed state ──────────────────────────────────────────────
  if (verifiedUser) {
    return (
      <div className="pt-2 pb-4 space-y-4">
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-bold text-green-800">Identity Verified</p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
            {[
              { label: 'Full Name', value: verifiedUser.full_name },
              { label: 'PAN', value: verifiedUser.pan_number },
              { label: 'Date of Birth', value: formatDOB(verifiedUser.date_of_birth) },
              { label: 'Gender', value: verifiedUser.gender },
              { label: 'Father\'s Name', value: verifiedUser.father_name },
              { label: 'Aadhaar (masked)', value: verifiedUser.masked_aadhaar_number },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-xs font-semibold text-gray-700 mt-0.5">{value || '—'}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center">
          Please confirm this is your identity before proceeding.
        </p>

        <button
          onClick={handleConfirm}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          Confirm & Continue →
        </button>
      </div>
    );
  }

  // ── Main form ────────────────
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
        <div className="relative">
          <input
            value={pan}
            onChange={(e) => handlePANChange(e.target.value)}
            placeholder="ABCDE1234F"
            maxLength={10}
            className={`w-full border rounded-xl px-4 py-3 pr-10 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all tracking-widest font-mono ${
              panStatus === 'extracted'
                ? 'border-green-400 focus:ring-green-200 bg-green-50'
                : panStatus === 'error'
                ? 'border-red-300 focus:ring-red-100'
                : 'border-blue-200 focus:ring-blue-300 focus:border-blue-400'
            }`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {panStatus === 'extracting' && (
              <svg className="w-4 h-4 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
            )}
            {panStatus === 'extracted' && (
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {panStatus === 'error' && (
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
        </div>
        {panStatus === 'idle' && (
          <p className="text-xs text-gray-400 mt-1">Format: 5 letters · 4 digits · 1 letter</p>
        )}
        {panStatus === 'extracting' && (
          <p className="text-xs text-blue-500 font-medium mt-1">Verifying PAN…</p>
        )}
        {panStatus === 'extracted' && (
          <p className="text-xs text-green-600 font-semibold mt-1">PAN verified successfully</p>
        )}
        {panStatus === 'error' && (
          <p className="text-xs text-red-500 font-medium mt-1">{panError}</p>
        )}
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
            onChange={(e) => {
              setMobile(e.target.value.replace(/\D/g, '').slice(0, 10));
              setOtpSent(false);
              setOtp('');
            }}
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
          disabled={sending || !canSendOTP}
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
