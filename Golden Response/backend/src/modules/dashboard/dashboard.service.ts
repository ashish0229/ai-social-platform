import { subHours, startOfHour } from "./time.js";
import { prisma } from "../../lib/prisma.js";

export async function getDashboardStats() {
  const since = subHours(new Date(), 1000);

  const [posts, flaggedYellow, flaggedRed, rejected, onlineUsers, inactiveUsers, abandonedUsers] =
    await Promise.all([
      prisma.post.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true, status: true, flagSeverity: true }
      }),
      prisma.post.count({ where: { flagSeverity: "YELLOW", createdAt: { gte: since } } }),
      prisma.post.count({ where: { flagSeverity: "RED", createdAt: { gte: since } } }),
      prisma.post.count({ where: { status: "REJECTED", createdAt: { gte: since } } }),
      prisma.user.count({ where: { isOnline: true } }),
      prisma.user.count({
        where: {
          isOnline: false,
          lastSeenAt: { gte: subHours(new Date(), 168) }
        }
      }),
      prisma.user.count({
        where: {
          OR: [{ lastSeenAt: null }, { lastSeenAt: { lt: subHours(new Date(), 720) } }]
        }
      })
    ]);

  const postsOverTime = new Map<string, number>();
  for (const post of posts) {
    const key = startOfHour(post.createdAt).toISOString();
    postsOverTime.set(key, (postsOverTime.get(key) ?? 0) + 1);
  }

  return {
    totalPostsLast1000Hours: posts.length,
    postsOverTime: Array.from(postsOverTime.entries()).map(([hour, count]) => ({ hour, count })),
    flaggedPosts: {
      yellow: flaggedYellow,
      red: flaggedRed
    },
    rejectedByModeration: rejected,
    users: {
      online: onlineUsers,
      inactive: inactiveUsers,
      abandoned: abandonedUsers
    }
  };
}

