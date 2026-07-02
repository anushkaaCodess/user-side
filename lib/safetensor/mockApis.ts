const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

// ── Real APIs ─────────────────────────────────────────────────────────────────

export interface PANExtractResponse {
  success: boolean;
  message: string;
  data: { id: string; pan_number: string } | null;
  errors: string[] | null;
  timestamp: string;
}

/** Auto-triggered when PAN reaches 10 valid characters. Proxied via /api/pan/extract — key stays server-side. */
export async function extractPAN(pan: string): Promise<PANExtractResponse> {
  if (DEV_BYPASS) {
    await delay(600);
    return { success: true, message: 'PAN extracted', data: { id: 'dev-pan-id-001', pan_number: pan }, errors: null, timestamp: new Date().toISOString() };
  }
  const res = await fetch('/api/pan/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pan_number: pan }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<PANExtractResponse>;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    company_id: string;
    phone: string;
    full_name: string;
    pan_number: string;
    father_name: string;
    gender: string;
    date_of_birth: string;
    masked_aadhaar_number: string;
    personal_email: string | null;
    official_email: string | null;
    employement_company_name: string | null;
    prev_salary_date: string | null;
    monthly_salary: number | null;
    pincode: string | null;
    location: { latitude: number; longitude: number } | null;
  } | null;
  errors: string[] | null;
  timestamp: string;
}

export async function sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
  if (DEV_BYPASS) {
    await delay(800);
    return { success: true, message: 'OTP sent successfully' };
  }
  const res = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function verifyOTP(payload: {
  phone: string;
  otp: string;
  pan_number: string;
  account_type: 'salaried' | 'self_employed';
}): Promise<VerifyOTPResponse> {
  if (DEV_BYPASS) {
    await delay(1000);
    return {
      success: true,
      message: 'OTP verified successfully',
      data: {
        id: 'dev-user-id-001',
        company_id: 'dev-company-id',
        phone: payload.phone,
        full_name: 'DEMO USER',
        pan_number: payload.pan_number,
        father_name: 'DEMO FATHER',
        gender: 'Male',
        date_of_birth: '1998-06-15T00:00:00.000Z',
        masked_aadhaar_number: '12XXXXXXXX34',
        personal_email: null,
        official_email: null,
        employement_company_name: null,
        prev_salary_date: null,
        monthly_salary: null,
        pincode: null,
        location: null,
      },
      errors: null,
      timestamp: new Date().toISOString(),
    };
  }
  const res = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function updateEmployeeDetails(payload: {
  user_id: string;
  employement_company_name: string;
  prev_salary_date: string;
  monthly_salary: number;
  pincode: string;
  personal_email: string;
  work_email: string;
  location: { latitude: number; longitude: number } | null;
}): Promise<{ success: boolean; message: string }> {
  if (DEV_BYPASS) {
    await delay(1000);
    return { success: true, message: 'Details saved successfully' };
  }
  const res = await fetch('/api/user/employee-details', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ── Mock APIs (email OTP + Account Aggregator — replace when real APIs are ready) ──

/** Send OTP to email address */
export async function mockSendEmailOTP(email: string): Promise<{ success: boolean }> {
  await delay(1200);
  console.log('[MOCK] Sending email OTP to', email);
  return { success: true };
}

/** Verify email OTP — any 6-digit code passes in mock */
export async function mockVerifyEmailOTP(
  email: string,
  otp: string
): Promise<{ success: boolean; message?: string }> {
  await delay(1000);
  console.log('[MOCK] Verifying email OTP', otp, 'for', email);
  if (otp.length !== 6) return { success: false, message: 'OTP must be 6 digits' };
  return { success: true };
}

/** Open Account Aggregator consent flow */
export async function mockOpenAccountAggregator(
  bank: string
): Promise<{ consentGiven: boolean }> {
  await delay(2500);
  console.log('[MOCK] AA consent for bank', bank);
  return { consentGiven: true };
}
