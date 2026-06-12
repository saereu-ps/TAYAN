// NextAuth disabled for in-memory demo
// All auth is handled via simple name-based login stored in memory
import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({ message: 'Auth not needed for demo mode' });
}

export function POST() {
  return NextResponse.json({ message: 'Auth not needed for demo mode' });
}
