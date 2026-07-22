import { NextRequest } from 'next/server';
import { proxyMultipartToUpstream } from '../../_lib/proxy';

export async function POST(req: NextRequest) {
  return proxyMultipartToUpstream(req, '/api/user/add/documents');
}
