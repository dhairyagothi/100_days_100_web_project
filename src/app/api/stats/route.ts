import { NextResponse } from 'next/server';
import { getRepoStats, getContributors } from '@/lib/github';

export async function GET() {
  try {
    const stats = await getRepoStats();
    const contributors = await getContributors();
    
    return NextResponse.json({ stats, contributors });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
