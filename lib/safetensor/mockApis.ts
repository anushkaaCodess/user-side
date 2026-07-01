// All API calls are mocked. Replace these with real implementations when APIs are ready.

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

/** Send OTP to mobile number */
export async function mockSendMobileOTP(mobile: string): Promise<{ success: boolean }> {
  await delay(1500);
  console.log('[MOCK] Sending OTP to', mobile);
  return { success: true };
}

/** Verify mobile OTP — any 6-digit code passes in mock */
export async function mockVerifyMobileOTP(
  mobile: string,
  otp: string
): Promise<{ success: boolean; message?: string }> {
  await delay(1000);
  console.log('[MOCK] Verifying OTP', otp, 'for', mobile);
  if (otp.length !== 6) return { success: false, message: 'OTP must be 6 digits' };
  return { success: true };
}

/**
 * Check if PAN is linked to the given mobile number.
 * Mock rule: PAN starting with "XXXXX" is considered unlinked.
 */
export async function mockCheckPANLinkage(
  pan: string,
  mobile: string
): Promise<{ linked: boolean }> {
  await delay(1200);
  console.log('[MOCK] Checking PAN linkage', pan, mobile);
  const unlinked = pan.toUpperCase().startsWith('XXXXX');
  return { linked: !unlinked };
}

/**
 * Check employment eligibility.
 * Self-employed → hard reject.
 */
export async function mockCheckEmploymentEligibility(
  type: 'salaried' | 'self_employed'
): Promise<{ eligible: boolean; reason?: string }> {
  await delay(800);
  if (type === 'self_employed') {
    return { eligible: false, reason: 'We currently only offer loans to salaried individuals.' };
  }
  return { eligible: true };
}

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
