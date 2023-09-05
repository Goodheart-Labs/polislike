import { auth } from "@clerk/nextjs";
import type { FlaggedStatement, Statement } from "@prisma/client";
import { notFound } from "next/navigation";

import PollAdminForm from "@/app/components/admin/PollAdminForm";
import type { Poll, Response } from "@/lib/api";
import prisma from "@/lib/prisma";
import { requirePollAdmin } from "@/utils/authutils";

type PollAdminPageProps = {
  params: {
    slug: string;
  };
};

type PollAdminPageViewProps = {
  data: {
    poll: Poll;
    statementsById: Record<string, Statement>;
    responsesBySession: Record<string, Response[]>;
    flaggedStatements: FlaggedStatement[];
  };
};

// Data
// -----------------------------------------------------------------------------

async function getData({ params }: PollAdminPageProps) {
  // Pull

  const poll = await prisma.polls.findUnique({
    where: {
      slug: params.slug,
    },
  });
  if (!poll) {
    notFound();
  }

  // Auth

  const { userId } = auth();
  requirePollAdmin(poll, userId);

  // More pull

  const statements = await prisma.statement.findMany({
    where: {
      poll_id: poll.id,
    },
  });

  const responses = await prisma.responses.findMany({
    where: {
      statementId: {
        in: statements.map((statement) => statement.id),
      },
    },
  });

  const flaggedStatements = await prisma.flaggedStatement.findMany({
    where: {
      statementId: {
        in: statements.map((statement) => statement.id),
      },
    },
    include: {
      statement: true,
    },
  });

  const statementsById = statements.reduce(
    (acc, statement) => ({
      ...acc,
      [statement.id]: statement,
    }),
    {} as Record<string, Statement>,
  );

  const responsesBySession = responses.reduce(
    (acc, response) => {
      const sessionId = response.session_id as keyof typeof acc;
      if (!acc[sessionId]) {
        acc[sessionId] = [];
      }
      acc[sessionId].push(response);
      return acc;
    },
    {} as Record<string, Response[]>,
  );

  return {
    poll,
    statements,
    statementsById,
    responses,
    responsesBySession,
    flaggedStatements,
  };
}

const PollAdminPageView = ({ data: { poll } }: PollAdminPageViewProps) => (
  <main className="flex flex-col w-full items-center min-h-screen px-4 gradient sm:px-0">
    <PollAdminForm poll={poll} />
  </main>
);

const PollAdminPage = async ({ params }: PollAdminPageProps) => {
  const { poll, statementsById, responsesBySession, flaggedStatements } =
    await getData({
      params,
    });

  return (
    <PollAdminPageView
      data={{
        poll,
        statementsById,
        responsesBySession,
        flaggedStatements,
      }}
    />
  );
};

export default PollAdminPage;
