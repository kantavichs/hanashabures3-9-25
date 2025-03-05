import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, phone, date, time, peopleCount, table } = body;

    // Validate input
    if (!name || !phone || !date || !time || !peopleCount || !table) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // Find the table by ID
    const tableRecord = await prisma.tables.findUnique({
      where: {
        tabID: Number(table),
      },
    });

    if (!tableRecord) {
      return NextResponse.json(
        { error: 'ไม่พบโต๊ะที่เลือก' },
        { status: 404 }
      );
    }

    // Check if table is already reserved for the given date and time
    const resDate = date; // Use the date string directly since resDate is stored as String in the schema
    const existingReservation = await prisma.reservations.findFirst({
      where: {
        Tables_tabID: Number(table),
        resDate: resDate,
        resTime: time,
        resStatus: 'confirmed',
      },
    });

    if (existingReservation) {
      return NextResponse.json(
        { error: 'โต๊ะนี้ถูกจองแล้วในเวลาดังกล่าว กรุณาเลือกโต๊ะหรือเวลาอื่น' },
        { status: 409 }
      );
    }

    // Create new reservation
    // If user is logged in, associate with their account
    // Otherwise, create a reservation without customer association
    let newReservation;

    if (id) {
      // User is logged in
      newReservation = await prisma.reservations.create({
        data: {
          resName: name,
          resDate: resDate,
          resTime: time,
          numberOfPeople: peopleCount,
          resStatus: 'pending',
          Customer_customerID: id,
          Tables_tabID: Number(table),
        },
      });
    } else {
      // Guest reservation - find or create customer first
      // Use Prisma transaction to ensure atomicity
      newReservation = await prisma.$transaction(async (tx) => {
        const customer = await tx.customer.findFirst({
          where: {
            customerPhone: phone,
          },
        });

        let customerId;

        if (customer) {
          customerId = customer.customerID;
        } else {
          // Create a new customer record
          const newCustomer = await tx.customer.create({
            data: {
              firstName: name,
              lastName: '',
              customerPhone: phone,
              CustomerEmail: `guest_${phone}_${Date.now()}@example.com`, // Temporary email for guest
              password: '', // No password for guest
            },
          });
          customerId = newCustomer.customerID;
        }

        const reservation = await tx.reservations.create({
          data: {
            resName: name,
            resDate: resDate,
            resTime: time,
            numberOfPeople: peopleCount,
            resStatus: 'pending',
            Customer_customerID: customerId,
            Tables_tabID: Number(table),
          },
        });

        return reservation;
      });
    }

    return NextResponse.json({
      message: 'จองโต๊ะเรียบร้อยแล้ว',
      reservation: newReservation,
    });
  } catch (error: any) {
    console.error('Reservation error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการจองโต๊ะ: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get customer ID from query parameter
    const url = new URL(request.url);
    const customerId = url.searchParams.get('customerId');

    // Pagination parameters
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    let reservations;

    if (customerId) {
      // Get reservations for a specific customer
      reservations = await prisma.reservations.findMany({
        where: {
          Customer_customerID: Number(customerId),
        },
        include: {
          table: true,
        },
        orderBy: {
          resCreatedAt: 'desc',
        },
        skip: skip,
        take: limit,
      });
    } else {
      // Get all reservations with pagination
      reservations = await prisma.reservations.findMany({
        include: {
          table: true,
          customer: {
            select: {
              firstName: true,
              lastName: true,
              customerPhone: true,
              CustomerEmail: true,
            },
          },
        },
        orderBy: {
          resCreatedAt: 'desc',
        },
        skip: skip,
        take: limit,
      });
    }

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง' },
      { status: 500 }
    );
  }
}