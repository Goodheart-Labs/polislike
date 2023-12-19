"use client";

import { Button } from "@/app/components/shadcn/ui/button";
import { Link } from "lucide-react";
import { useMemo } from "react";

export const EmptyMessage = ({ slug }: { slug: string }) => {
  const href = useMemo(
    () =>
      typeof window === "undefined"
        ? `https://viewpoints.xyz/polls/${slug}/results`
        : `${window.location.protocol}//${window.location.host}/polls/${slug}/results`,
    [slug],
  );

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <p className="mt-48">
        <Link href={href} target="_blank">
          <Button
            variant="pill"
            size="pill"
            className="pr-5 text-sm dark:bg-white dark:text-gray-800 hover:dark:bg-white/80"
          >
            View results
          </Button>
        </Link>
      </p>
    </div>
  );
};
