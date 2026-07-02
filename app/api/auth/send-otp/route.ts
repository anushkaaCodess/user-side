import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const upstream = await fetch('https://common-server-1.onrender.com/api/auth/user/send-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.PAN_API_KEY ?? '',
    },
    body: JSON.stringify(body),
  });
  const data = await upstream.json();
  console.log('[send-otp] upstream status:', upstream.status, '| body:', JSON.stringify(data));
  return NextResponse.json(data, { status: upstream.status });
}
