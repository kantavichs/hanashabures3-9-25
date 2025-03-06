import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismadb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอกอีเมลและรหัสผ่าน' },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.customer.findUnique({
      where: {
        CustomerEmail: email,
      },
    });

    // Check if user exists and password matches
    if (!user) {
      return NextResponse.json(
        { error: 'ไม่พบบัญชีผู้ใช้นี้' },
        { status: 404 }
      );
    }

    // In a real application, you would use a proper password hashing library
    // like bcrypt to compare the hashed password
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'รหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      );
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
      { status: 500 }
    );
  }
}