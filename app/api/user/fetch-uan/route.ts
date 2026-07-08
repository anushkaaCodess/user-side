import { NextRequest } from 'next/server';
import { proxyToUpstream } from '../../_lib/proxy';

export async function GET(req: NextRequest) {
  return proxyToUpstream(req, '/api/user/fetch/uan', { method: 'GET' });
}
