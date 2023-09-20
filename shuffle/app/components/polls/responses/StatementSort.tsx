"use client";

import type { FC } from "react";
import React, { useCallback } from "react";

import { usePathname, useRouter } from "next/navigation";

import type { SortKey } from "@/lib/pollResults/constants";
import { sortOptions } from "@/lib/pollResults/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/select";

type Props = {
  value?: SortKey;
};

export const StatementSort: FC<Props> = ({ value = "consensus" }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = useCallback(
    (newValue: SortKey) => {
      router.push(`${pathname}?sort=${newValue}`);
    },
    [pathname, router],
  );

  return (
    <Select defaultValue={value} onValueChange={handleChange}>
      <SelectTrigger>
        Sort by: <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.key} value={option.key}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
