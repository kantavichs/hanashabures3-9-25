import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismadb';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.customer.findUnique({
      where: {
        CustomerEmail: email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'อีเมลนี้ถูกใช้งานแล้ว' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user with hashed password
    const newUser = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        CustomerEmail: email,
        password: hashedPassword,
      },
    });

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({
      message: 'ลงทะเบียนสำเร็จ',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลงทะเบียน' },
      { status: 500 }
    );
  }
}