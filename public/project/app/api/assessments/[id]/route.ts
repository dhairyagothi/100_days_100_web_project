import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id: params.id },
      include: {
        interview: true,
        questions: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!assessment) {
      return new NextResponse('Assessment not found', { status: 404 });
    }

    return NextResponse.json(assessment);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}