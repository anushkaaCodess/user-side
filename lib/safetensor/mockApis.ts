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
    /** Present on the real backend; absent under DEV_BYPASS-era mocks — read defensively. */
    loan?: Loan | null;
  } | null;
  errors: string[] | null;
  timestamp: string;
}

export interface Loan {
  id: string;
  status: string;
}

export async function sendOTP(
  phone: string,
  pan_number: string,
  account_type: 'salaried' | 'self_employed'
): Promise<{ success: boolean; message: string }> {
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

/**
 * Saves employment + email details in one call — the upstream /employee/details
 * endpoint validates personal_email, work_email, employment fields and loan_id
 * together in a single schema; there is no separate emails endpoint.
 */
export async function updateEmployeeDetails(payload: {
  employement_company_name: string;
  prev_salary_date: string; // ISO YYYY-MM-DD, converted to DD-MM-YYYY here
  monthly_salary: number;
  pincode: string;
  location: { latitude: number; longitude: number } | null;
  personal_email: string;
  work_email: string;
  loan_id?: string;
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
  if (!res.ok && res.status !== 400) throw new Error(`HTTP ${res.status}`);
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

export interface SetuConsentResponse {
  success: boolean;
  message: string;
  data: { url: string } | null;
  errors: string[] | null;
  timestamp: string;
}

/** Creates a Setu Account Aggregator consent request; caller should redirect the browser to data.url. */
export async function createAAConsent(): Promise<SetuConsentResponse> {
  const res = await fetch('/api/user/setu-consent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export interface ProcessAAConsentResponse {
  success: boolean;
  message: string;
  data: unknown;
  errors: string[] | null;
  timestamp: string;
}

/**
 * Confirms the Setu AA consent after the browser redirects back with `?aa=done`.
 * Rejects (success: false) if the consent isn't active yet or more than one
 * account was linked — the caller must not treat `aa=done` alone as success.
 */
export async function processAAConsent(loan_id?: string): Promise<ProcessAAConsentResponse> {
  const res = await fetch('/api/user/process-setu-consent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loan_id ? { loan_id } : {}),
  });
  return res.json();
}

export interface UploadDocumentsResponse {
  success: boolean;
  message: string;
  data: unknown;
  errors: string[] | null;
  timestamp: string;
}

/** One selected file tagged with the document slot it fills (becomes the multipart fieldname → document_type upstream). */
export interface DocumentUploadEntry {
  documentType: string;
  file: File;
}

/**
 * Uploads KYC/loan documents (images or PDFs) to /api/user/add/documents.
 * Each file's fieldname becomes its `document_type` upstream (see Common-Server
 * `documentsUpload`), and `loan_id` must be a valid UUID for the user's active loan.
 */
export async function uploadDocuments(
  loan_id: string,
  entries: DocumentUploadEntry[]
): Promise<UploadDocumentsResponse> {
  if (DEV_BYPASS) {
    await delay(1000);
    return { success: true, message: 'Documents uploaded successfully', data: null, errors: null, timestamp: new Date().toISOString() };
  }
  const formData = new FormData();
  formData.append('loan_id', loan_id);
  for (const { documentType, file } of entries) {
    formData.append(documentType, file, file.name);
  }

  const res = await fetch('/api/user/add-documents', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok && res.status !== 400) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export interface RelationEntry {
  name: string;
  phone: string;
  relationship_type: string;
}

export interface AddRelationsResponse {
  success: boolean;
  message: string;
  data: unknown;
  errors: string[] | null;
  timestamp: string;
}

/** Upstream requires exactly 3 relations (see addUserRelationsSchema in Common-Server). */
export async function addRelations(relations: RelationEntry[]): Promise<AddRelationsResponse> {
  if (DEV_BYPASS) {
    await delay(800);
    return { success: true, message: 'Relations added successfully', data: null, errors: null, timestamp: new Date().toISOString() };
  }
  const res = await fetch('/api/user/add-relations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ relations }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
