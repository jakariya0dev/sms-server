import type { Prisma } from "../generated/prisma-client/client";

export const generateUniqueUsername = async (
  tx: Prisma.TransactionClient,
  schoolId: string,
  name: string,
  fallback = "user",
): Promise<string> => {
  const normalizedName = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
  const baseUsername = normalizedName || fallback;

  for (let suffix = 0; ; suffix += 1) {
    const username = suffix === 0 ? baseUsername : `${baseUsername}.${suffix + 1}`;
    const existingUser = await tx.user.findUnique({
      where: { schoolId_username: { schoolId, username } },
      select: { id: true },
    });

    if (!existingUser) return username;
  }
};
