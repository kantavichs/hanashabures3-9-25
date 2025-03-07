import { NextResponse } from 'next/server';
import {prisma} from '../../../../lib/prismadb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { 
      customerName, 
      phoneNumber, 
      numberOfPeople, 
      tableNumber, 
      reservationDate, 
      reservationTime,
      status,
      customerID 
    } = body;

    // Validate required fields
    if (!customerName || !phoneNumber || !numberOfPeople || !tableNumber || !reservationDate || !reservationTime) {
      return NextResponse.json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
    }

    // Check if the table is already booked for the selected date and time
    const existingReservation = await prisma.reservations.findFirst({
      where: {
        AND: [
          { Tables_tabID: Number(tableNumber) },
          { resDate: reservationDate },
          { resTime: reservationTime },
          { resStatus: { not: 'cancelled' } }
        ]
      }
    });

    if (existingReservation) {
      return NextResponse.json({ 
        message: 'โต๊ะนี้ถูกจองแล้วสำหรับเวลาที่เลือก กรุณาเลือกโต๊ะอื่นหรือเวลาอื่น' 
      }, { status: 409 });
    }

    // If customerID is provided (user is logged in), use that
    // Otherwise, check if customer exists or create a new one
    let customerId = customerID;
    
    if (!customerId) {
      // Changed: No longer finding customer by phone number
      // Instead, create a new customer without storing the phone number
      const customer = await prisma.customer.create({
        data: {
          firstName: customerName,
          lastName: '', // Provide a default or actual last name
          CustomerEmail: '', // Provide a default or actual email
          password: '', // Provide a default or actual password
          cusCreatedAt: new Date()
        }
      });
      
      customerId = customer.customerID;
    }

    // Create the reservation
    const newReservation = await prisma.reservations.create({
      data: {
        resDate: reservationDate,
        resTime: reservationTime,
        numberOfPeople: parseInt(numberOfPeople.toString()),
        resStatus: status || 'pending',
        resCreatedAt: new Date(),
        Customer_customerID: customerId,
        Tables_tabID: parseInt(tableNumber.toString()),
        resPhone: phoneNumber.toString(), // Phone number is only stored here now
      }
    });
    return NextResponse.json({ 
      success: true, 
      message: 'จองโต๊ะเรียบร้อยแล้ว', 
      reservationId: newReservation.resID 
    });
    
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาดในการสร้างการจอง' }, { status: 500 });
  }
}