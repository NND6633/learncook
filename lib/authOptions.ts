// lib/authOptions.ts
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt"; // Import hàm compare

export const authOptions: AuthOptions = {
  // Cấu hình session, sử dụng JWT (JSON Web Tokens)
  session: {
    strategy: "jwt",
  },
  // Các nhà cung cấp (providers) - ở đây chúng ta chỉ dùng Credentials
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@test.com" },
        password: { label: "Password", type: "password" },
      },
      // Hàm 'authorize' này sẽ được gọi khi bạn gọi 'signIn'
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null; // Không có email hoặc password
        }

        // 1. Tìm user trong database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null; // Không tìm thấy user
        }

        // 2. So sánh mật khẩu đã mã hóa
        const isPasswordValid = await compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordValid) {
          return null; // Mật khẩu sai
        }

        // 3. Đăng nhập thành công, trả về user
        // (chỉ trả về các trường an toàn)
        return {
          id: user.id.toString(), // Chuyển id sang string
          email: user.email,
        };
      },
    }),
  ],
  // Cấu hình trang đăng nhập
  pages: {
    signIn: "/login",
  },
};