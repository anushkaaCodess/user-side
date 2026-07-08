const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true';
// Separate bypass for email OTP so it can be tested against the real service
// while mobile OTP (no SMS service available) stays mocked via DEV_BYPASS.
const EMAIL_DEV_BYPASS = process.env.NEXT_PUBLIC_EMAIL_DEV_BYPASS === 'true';

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
    uan_number: string | null;
    uan_establishment_name: string | null;
    uan_date_of_joining: string | null;
    uan_date_of_exit: string | null;
  } | null;
  errors: string[] | null;
  timestamp: string;
}

export async function sendOTP(
  phone: string,
  pan_number: string,
  account_type: 'salaried' | 'self_employed'
): Promise<{ success: boolean; message: string }> {
  if (DEV_BYPASS) {
    await delay(800);
    return { success: true, message: 'OTP sent successfully' };
  }
  const res = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, pan_number, account_type }),
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
  // No SMS service available right now — bypass real verification regardless of DEV_BYPASS.
  if (true) {
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
        uan_number: '100252570498',
        uan_establishment_name: 'DEMO ESTABLISHMENT',
        uan_date_of_joining: '2020-01-01',
        uan_date_of_exit: null,
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

/** prev_salary_date must be sent as DD-MM-YYYY per upstream contract. */
function toUpstreamDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}

export async function updateEmployeeDetails(payload: {
  employement_company_name: string;
  prev_salary_date: string; // ISO YYYY-MM-DD, converted to DD-MM-YYYY here
  monthly_salary: number;
  pincode: string;
  location: { latitude: number; longitude: number } | null;
}): Promise<{ success: boolean; message: string }> {
  if (DEV_BYPASS) {
    await delay(1000);
    return { success: true, message: 'Details saved successfully' };
  }
  const res = await fetch('/api/user/employee-details', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, prev_salary_date: toUpstreamDate(payload.prev_salary_date) }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function updateEmails(
  personal_email: string,
  work_email: string
): Promise<{ success: boolean; message: string }> {
  if (DEV_BYPASS) {
    await delay(800);
    return { success: true, message: 'User emails updated successfully' };
  }
  const res = await fetch('/api/user/update-emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ personal_email, work_email }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export interface UANResponse {
  success: boolean;
  message: string;
  data: { uan_number?: string; uan_establishment_name?: string } | null;
  errors: string[] | null;
  timestamp: string;
}

/** Called right after verify-otp succeeds. No UAN record => user cannot proceed. */
export async function fetchUAN(): Promise<UANResponse> {
  if (DEV_BYPASS) {
    await delay(600);
    return { success: true, message: 'UAN fetched successfully', data: { uan_number: '100252570498' }, errors: null, timestamp: new Date().toISOString() };
  }
  const res = await fetch('/api/user/fetch-uan');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export interface CRIFResponse {
  success: boolean;
  message: string;
  data: Record<string, unknown> | null;
  errors: string[] | null;
  timestamp: string;
}

/** Called once the work email is verified in Step3. */
export async function fetchCRIF(): Promise<CRIFResponse> {
  if (DEV_BYPASS) {
    await delay(1000);
    return { success: true, message: 'CRIF report fetched successfully', data: null, errors: null, timestamp: new Date().toISOString() };
  }
  const res = await fetch('/api/user/fetch-crif');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function sendEmailOTP(email: string): Promise<{ success: boolean; message: string }> {
  if (EMAIL_DEV_BYPASS) {
    await delay(1200);
    return { success: true, message: 'OTP sent successfully' };
  }
  const res = await fetch('/api/auth/email/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function verifyEmailOTP(
  email: string,
  otp: string
): Promise<{ success: boolean; message?: string }> {
  if (EMAIL_DEV_BYPASS) {
    await delay(1000);
    if (otp.length !== 6) return { success: false, message: 'OTP must be 6 digits' };
    return { success: true, message: 'OTP verified successfully' };
  }
  const res = await fetch('/api/auth/email/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Mock Account Aggregator — no real API given yet. */

/** Open Account Aggregator consent flow */
export async function mockOpenAccountAggregator(
  bank: string
): Promise<{ consentGiven: boolean }> {
  await delay(2500);
  console.log('[MOCK] AA consent for bank', bank);
  return { consentGiven: true };
}
