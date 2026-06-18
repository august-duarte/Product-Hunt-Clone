import sql from "@/lib/db";
import { NextResponse } from "next/server";
import verifyToken from "@/lib/auth/verify-token";
import { comparePassword, hashPassword } from "@/lib/auth/hash-password";

export const PATCH = async (req: Request) => {
  try {
    const decoded = await verifyToken(req);
    const id = (decoded as { id: number }).id;
    const { oldPassword, newPassword } = await req.json();

    const [user] = await sql`
      SELECT * FROM users WHERE id = ${id}
    `;
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const validOldPassword = await comparePassword(oldPassword, user.password);
    if (!validOldPassword) {
      return NextResponse.json({ error: 'Invalid old password' }, { status: 400 });
    }

    const hashedNewPassword = await hashPassword(newPassword);
    await sql`
      UPDATE users SET password = ${hashedNewPassword}
      WHERE id = ${id}
    `;

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && ['Access denied', 'Invalid token', 'Token already used'].includes(error.message)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Password update failed', error);
    return NextResponse.json({ error: 'Something went wrong, please try again later' }, { status: 500 });
  }
};
