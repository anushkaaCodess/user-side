'use client';

import { useState, useEffect } from 'react';
import Toast from '../Toast';

export interface Step2Data {
  company: string;
  salaryDate: string; // ISO date string YYYY-MM-DD
  monthlySalary: string;
  pincode: string;
  location: { latitude: number; longitude: number } | null;
}

interface Props {
  onNext: (data: Step2Data) => void;
  onBack: () => void;
}

type ToastState = { message: string; type: 'error' | 'success' | 'info' } | null;

// ── Mini inline calendar ──────────────────────────────────────────────────────

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

function toISO(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function getMinDate() {
  const d = new Date();
  d.setMonth(d.getMonth() - 2);
  return d;
}

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface CalendarProps {
  selected: string;
  onChange: (iso: string) => void;
}

function SalaryDateCalendar({ selected, onChange }: CalendarProps) {
  const today = new Date();
  const minDate = getMinDate();

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const { firstDay, daysInMonth } = getMonthDays(viewYear, viewMonth);

  // Earliest viewable month = minDate's month/year
  const canGoPrev =
    viewYear > minDate.getFullYear() ||
    (viewYear === minDate.getFullYear() && viewMonth > minDate.getMonth());

  // Latest viewable month = current month
  const canGoNext =
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth < today.getMonth());

  function prevMonth() {
    if (!canGoPrev) return;
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (!canGoNext) return;
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  function isDisabled(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    return d > today || d < minDate;
  }

  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-sm select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-blue-500 hover:bg-blue-50 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          ‹
        </button>
        <span className="text-sm font-bold text-blue-900">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          disabled={!canGoNext}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-blue-500 hover:bg-blue-50 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          ›
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {blanks.map((_, i) => <div key={`b${i}`} />)}
        {days.map((day) => {
          const iso = toISO(viewYear, viewMonth, day);
          const disabled = isDisabled(day);
          const isSelected = iso === selected;
          const isToday = toISO(today.getFullYear(), today.getMonth(), today.getDate()) === iso;
          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => onChange(iso)}
              className={`w-8 h-8 mx-auto rounded-lg text-xs font-medium transition-all flex items-center justify-center ${
                isSelected
                  ? 'bg-blue-600 text-white font-bold shadow-md'
                  : isToday
                  ? 'border-2 border-blue-400 text-blue-700 font-bold'
                  : disabled
                  ? 'text-gray-200 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {selected && (
        <p className="text-center text-xs text-blue-600 font-semibold mt-3 pt-3 border-t border-blue-100">
          Selected: {new Date(selected + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

type LocationStatus = 'requesting' | 'granted' | 'denied' | 'unavailable';

export default function Step2({ onNext, onBack }: Props) {
  const [company, setCompany] = useState('');
  const [salaryDate, setSalaryDate] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [pincode, setPincode] = useState('');
  const [showCal, setShowCal] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('requesting');

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLocationStatus('granted');
      },
      () => setLocationStatus('denied'),
      { timeout: 10000 }
    );
  }, []);

  function showToast(message: string, type: NonNullable<ToastState>['type'] = 'error') {
    setToast({ message, type });
  }

  function handleSubmit() {
    if (!company.trim()) { showToast('Please enter your company name'); return; }
    if (!salaryDate) { showToast('Please select your last salary credit date'); return; }
    if (!monthlySalary || Number(monthlySalary) < 40000) {
      showToast('Monthly salary must be at least ₹40,000'); return;
    }
    if (!/^\d{6}$/.test(pincode)) { showToast('Please enter a valid 6-digit pincode'); return; }
    onNext({ company, salaryDate, monthlySalary, pincode, location });
  }

  function retryLocation() {
    setLocationStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLocationStatus('granted');
      },
      () => setLocationStatus('denied'),
      { timeout: 10000 }
    );
  }

  return (
    <div className="pt-2 pb-4 space-y-5">
      {toast && (
        <div className="sticky top-0 z-10 -mx-1">
          <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
        </div>
      )}

      {/* Company name */}
      <div>
        <label className="text-xs font-semibold text-blue-800 mb-1.5 block">Company Name *</label>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="e.g. Infosys Ltd."
          className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
        />
      </div>

      {/* Salary date */}
      <div>
        <label className="text-xs font-semibold text-blue-800 mb-1.5 block">
          Last Salary Credit Date *{' '}
          <span className="text-gray-400 font-normal">(within last 2 months)</span>
        </label>
        <button
          type="button"
          onClick={() => setShowCal(!showCal)}
          className={`w-full border-2 rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between transition-all ${
            salaryDate ? 'border-blue-400 text-blue-800 font-semibold bg-blue-50' : 'border-blue-200 text-gray-400 bg-white hover:border-blue-300'
          }`}
        >
          <span>
            {salaryDate
              ? new Date(salaryDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
              : 'Select date'}
          </span>
          <svg className={`w-4 h-4 transition-transform text-blue-400 ${showCal ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showCal && (
          <div className="mt-2">
            <SalaryDateCalendar
              selected={salaryDate}
              onChange={(d) => { setSalaryDate(d); setShowCal(false); }}
            />
          </div>
        )}
      </div>

      {/* Monthly salary */}
      <div>
        <label className="text-xs font-semibold text-blue-800 mb-1.5 block">Monthly Salary (₹) *</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-400">₹</span>
          <input
            type="number"
            value={monthlySalary}
            onChange={(e) => setMonthlySalary(e.target.value)}
            placeholder="e.g. 60000"
            min={40000}
            className="w-full border border-blue-200 rounded-xl pl-8 pr-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Minimum net monthly salary: ₹40,000</p>
      </div>

      {/* Pincode */}
      <div>
        <label className="text-xs font-semibold text-blue-800 mb-1.5 block">Pincode *</label>
        <input
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="6-digit pincode"
          maxLength={6}
          className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
        />
      </div>

      {/* Location */}
      <div className={`rounded-2xl border-2 px-4 py-3 flex items-center gap-3 transition-all ${
        locationStatus === 'granted'
          ? 'border-green-200 bg-green-50'
          : locationStatus === 'denied' || locationStatus === 'unavailable'
          ? 'border-orange-200 bg-orange-50'
          : 'border-blue-100 bg-blue-50'
      }`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          locationStatus === 'granted' ? 'bg-green-100' : locationStatus === 'requesting' ? 'bg-blue-100' : 'bg-orange-100'
        }`}>
          {locationStatus === 'requesting' ? (
            <svg className="w-4 h-4 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
          ) : locationStatus === 'granted' ? (
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold ${
            locationStatus === 'granted' ? 'text-green-800' : locationStatus === 'requesting' ? 'text-blue-700' : 'text-orange-700'
          }`}>
            {locationStatus === 'requesting' && 'Requesting location access…'}
            {locationStatus === 'granted' && 'Location captured'}
            {locationStatus === 'denied' && 'Location access denied'}
            {locationStatus === 'unavailable' && 'Location unavailable'}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5 truncate">
            {locationStatus === 'granted' && location
              ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
              : locationStatus === 'requesting'
              ? 'Please allow location in your browser'
              : 'Your application may take longer to process'}
          </p>
        </div>
        {(locationStatus === 'denied' || locationStatus === 'unavailable') && (
          <button
            type="button"
            onClick={retryLocation}
            className="text-xs font-semibold text-orange-600 hover:text-orange-800 shrink-0 transition-colors"
          >
            Retry
          </button>
        )}
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
          onClick={handleSubmit}
          className="flex-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
