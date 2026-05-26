import { prisma } from "../../lib/prisma.js";
import { sanitizeText } from "../../lib/sanitize.js";

export async function getProfile(username: string, viewerId?: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { username },
    select: {
      id: true,
      username: true,
      bio: true,
      avatarUrl: true,
      themeUrl: true,
      createdAt: true,
      posts: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { likes: true, comments: true } }
        }
      }
    }
  });

  const [followers, following, viewerFollow] = await Promise.all([
    prisma.follow.count({ where: { followingId: user.id } }),
    prisma.follow.count({ where: { followerId: user.id } }),
    viewerId
      ? prisma.follow.findUnique({
          where: { followerId_followingId: { followerId: viewerId, followingId: user.id } }
        })
      : null
  ]);

  return {
    ...user,
    followers,
    following,
    isFollowing: Boolean(viewerFollow)
  };
}

export async function updateProfile(userId: string, input: {
  username?: string;
  bio?: string;
  avatarUrl?: string;
  themeUrl?: string;
}) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      username: input.username ? sanitizeText(input.username) : undefined,
      bio: input.bio ? sanitizeText(input.bio) : undefined,
      avatarUrl: input.avatarUrl,
      themeUrl: input.themeUrl
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      bio: true,
      avatarUrl: true,
      themeUrl: true
    }
  });
}

export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) {
    throw new Error("Users cannot follow themselves");
  }

  return prisma.follow.upsert({
    where: { followerId_followingId: { followerId, followingId } },
    update: {},
    create: { followerId, followingId }
  });
}

export async function unfollowUser(followerId: string, followingId: string) {
  await prisma.follow.deleteMany({ where: { followerId, followingId } });
  return { ok: true };
}

