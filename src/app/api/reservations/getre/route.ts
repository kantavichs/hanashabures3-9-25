import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prismadb';

export async function GET() {
    try {
        const reservations = await prisma.reservations.findMany({
            include: {
                customer: true,
                tables: true
            },
            orderBy: {
                resCreatedAt: 'desc'
            }
        });

        return NextResponse.json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return NextResponse.json(
            { message: 'เกิดข้อผิดพลาดในการโหลดข้อมูล' },
            { status: 500 }
        );
    }
}