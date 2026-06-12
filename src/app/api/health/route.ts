import { NextResponse } from 'next/server';

export async function GET() {
  // Basic health check
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'paper-plane-web',
    version: '0.1.0',
  };

  return NextResponse.json(health);
}
