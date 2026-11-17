import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const cookieName = "zuki_admin";

function getSecret() {
  const secret = process.env.JWT_SECRET || process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === "production" && (!secret || secret.length < 32)) {
    throw new Error("JWT_SECRET de 32+ caracteres es obligatorio en produccion.");
  }
  return new TextEncoder().encode(secret || "dev-secret-change-me-32-bytes-min");
}

export async function createAdminSession(email: string) {
  const token = await new SignJWT({ email, role: "ADMIN" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());

  const store = await cookies();
  store.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function destroyAdminSession() {
  const store = await cookies();
  store.delete(cookieName);
}

export async function getAdminSession() {
  const store = await cookies();
  const token = store.get(cookieName)?.value;
  if (!token) return null;
  try {
    const verified = await jwtVerify(token, getSecret());
    return verified.payload as { email: string; role: string };
  } catch {
    return null;
  }
}

export async function verifyAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@zukizone.store";
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (email !== adminEmail) return false;
  if (!hash) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_PASSWORD_HASH es obligatorio en produccion.");
    }
    return password === "ZukiAdmin2002!";
  }
  return bcrypt.compare(password, hash);
}
