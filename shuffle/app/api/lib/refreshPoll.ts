import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

export const refreshPoll = async (id: number) => {
  const poll = await prisma.polls.findUnique({
    where: {
      id,
    },
  });

  if (!poll) {
    return;
  }

  revalidatePath(`/polls/${poll.slug}`);
};
