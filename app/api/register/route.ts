// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // --- 1. Validation ---
    if (!email || !password) {
      return NextResponse.json(
        // ✅ Đã dịch
        { error: "Please provide both email and password" },
        { status: 400 }
      );
    }

    // --- 2. Kiểm tra user đã tồn tại? ---
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        // ✅ Đã dịch
        { error: "This email is already in use" },
        { status: 409 } // 409 Conflict
      );
    }

    // --- 3. Mã hóa mật khẩu ---
    const hashedPassword = await hash(password, 12);

    // --- 4. Tạo user mới ---
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    return NextResponse.json(
      { id: user.id, email: user.email },
      { status: 201 } // 201 Created
    );
  } catch (error) {
    console.error("REGISTER_ERROR", error);
    return NextResponse.json(
      // ✅ Đã dịch
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}