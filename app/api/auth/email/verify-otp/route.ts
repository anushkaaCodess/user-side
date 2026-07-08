import { NextRequest } from 'next/server';
import { proxyToUpstream } from '../../../_lib/proxy';

export async function POST(req: NextRequest) {
  return proxyToUpstream(req, '/api/auth/user/email/verify-otp');
}
