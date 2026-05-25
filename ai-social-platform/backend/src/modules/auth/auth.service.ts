import { Role } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { hashPassword, verifyPassword } from "../../lib/password.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../lib/jwt.js";

function tokensForUser(user: { id: string; role: Role; email: string; username: string }) {
  const payload = {
    sub: user.id,
    role: user.role,
    email: user.email,
    username: user.username
  };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload)
  };
}

export async function registerUser(input: {
  username: string;
  email: string;
  password: string;
  role: Role;
}) {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: input.email }, { username: input.username }]
    }
  });

  if (existing) {
    throw new Error("Username or email already exists");
  }

  const user = await prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      role: input.role,
      passwordHash: await hashPassword(input.password)
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true
    }
  });

  return { user, ...tokensForUser(user) };
}

export async function loginUser(input: { username: string; email: string; password: string }) {
  const user = await prisma.user.findFirst({
    where: {
      username: input.username,
      email: input.email
    }
  });

  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new Error("Invalid credentials");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isOnline: true, lastSeenAt: new Date() }
  });

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    ...tokensForUser(user)
  };
}

export async function refreshAccessToken(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: payload.sub },
    select: { id: true, username: true, email: true, role: true }
  });

  return tokensForUser(user);
}

