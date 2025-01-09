import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const interviews = await prisma.interview.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        company: true,
        difficulty: true,
        duration: true,
      },
    });

    return NextResponse.json({ interviews });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}