"use client";

import { useCallback, useMemo, useState } from "react";

import { FlagIcon } from "@heroicons/react/20/solid";
import type { Statement } from "@prisma/client";
import useHotkeys from "@reecelucas/react-use-hotkeys";
import clsx from "clsx";
import type { PanInfo } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { Key } from "ts-key-enum";

import Avatar from "@/components/Avatar";
import type { Choice } from "@/lib/api";
import { useAmplitude } from "@/providers/AmplitudeProvider";
import type { InteractionMode } from "@/providers/AmplitudeProvider/types";

import BorderedButton from "./BorderedButton";
import FlagStatement from "./FlagStatement";

// Setup
// -----------------------------------------------------------------------------

export const anonymousAvatar =
  "data:image/png;base64,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TUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE1LTAxLTEzVDEyOjAxOjQ1PC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5QaXhlbG1hdG9yIDMuMy4xPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjY0PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj42NDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgrqEyNgAAADlklEQVRoBe2Z624iMQyFF8qlrQq0Ban0/d+tohXiWijlul810iiaISaxg9iumB8oZGLnHNtxnEzlcDj8+c1P9TeD/8F+JXBpD149cPWA0QLXEDIa0Cx+9YDZhEYFNaO8T3y9Xq9Wq8/Pz/1+//DwcHt722w2K5WKb7y6v5K2FtrtdvP5fDabfX9/FzRDACadTqdWS2m1ZASAO51Ox+PxZrMRzHlzc/P4+Pj09FStpll+aQgA+uPjY7FYCNDdV3jj5eWFuHI7de0EBAj3t7c3fqMQ4IrX19f7+/soqfJgqx+JnPf391j04GC1DAaD7XZbxhTVYyVA2Hx9fUVNmQ8GPcsm/6trWAmQc3QTZ1Lk2UKyitVmIkCOJ9nHTumOJ/bkrOUOPto2ESAGeI7qDezE/Ir14yq3EjAGAFAu6QEyiWsMXduoxOQBu/l1nF0pE4FzFGcuuJC2iUCSssyoRE+A/DMajUKMJI9hJ7GkMj2BqOpN4MBGjiphgPxKSYDUoa4gyoDYDdW5SEmgDMLSY8lmSgIcR6iHLaBdWVSpzzdKAiTQVqvlgrC0UaXOyEoCwOVkmORIhRJUqfmbTmSsvOFwaKnpOeP3ej1LNOo9gM2YmOO52vsIIm5BDwYTAeTr9TondF0AIIi4TjaXshLAiu12O1cX1UBQ7b18IisBFJFDFIZEJEkeS0CAIO52u7lJAhuIGKM/mygBARQRDFwbBkJnGIPVgVeYJQ0BlIbftJH4GVzAof5r2gcKs1IVc1e1XC4L/e5fruL6/b7xDOAqTOYBlAIL0wqJhVcMSIieSVMSQB17s1Ba8oqrJNd+9nZiAicv6vh0YAftaki2Brif4uMA+AQPMHG28VFBNBoNF4e6nYAA0CeTCdDDw4PqnzRKEWqnYSLAqZJSNPsQpjAhNLKPTnd3dwrxTERDgCABNNAhIAdMCCyCCgLU1ZARMphPVRwBMj2hwmO8kT2KhnAirnii8mwoAaBna1R9fXAUdLkT9BR5rPJAGkEEWKPcYVmun8pA5R7QPz8/hxw1TxAgxPkERszI853pLeEkb+3Me2IjuyB6wGE4AMjWkQj8rNYL2T4HfRKDlwDBw6rNFV2wAQwhWXsJ8OXnHLlSYQhgCJ+hvAQQE3grcKhFgCGY0ksgvLBRIwsXFMD8vwT+kfjJvCSA8XpAUVeFh0TsSAGMl0CSS5tYoL7xQl3kJUCJq/7o4MOh6weGcI//F3harGNcIKRfAAAAAElFTkSuQmCC";

// Config
// -----------------------------------------------------------------------------

const X_SWIPE_THRESHOLD = 150;
const Y_SWIPE_THRESHOLD = 150;
const ANIMATION_DURATION = 0.2;

// Types
// -----------------------------------------------------------------------------

export type CardViewProps = {
  data: {
    card: Statement;
  };
  state: {
    isActive: boolean;
    isFlagging: boolean;
  };
  callbacks: {
    onAgree: () => void;
    onDisagree: () => void;
    onSkip: () => void;
    onItsComplicated: () => void;
    onFlag: (interactionMode?: InteractionMode) => void;
  };
};

export type CardProps = {
  card: Statement;
  isActive: boolean;
  onSwipe: (card: Statement, choice: Choice) => void;
  onStatementFlagged: (statementId: Statement["id"]) => void;
};

// View
// -----------------------------------------------------------------------------

const CardView = ({
  data: { card },
  state: { isActive, isFlagging },
  callbacks: { onAgree, onDisagree, onSkip, onItsComplicated, onFlag },
}: CardViewProps) => (
  <>
    <div className="flex flex-col w-full px-4 py-5 sm:p-6">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center w-full">
          <div className="mr-2 dark:shadow-sm">
            <Avatar
              url={card.author_avatar_url ?? anonymousAvatar}
              alt={card.author_name ?? "Anonymous"}
            />
          </div>
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {card.author_name ?? "Anonymous"}
          </div>
        </div>
        <div className="flex">
          <button
            type="button"
            className={clsx(
              "mr-1 p-1 hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:hover:text-red-300 dark:focus-visible:text-red-300",
              isFlagging ? "text-red-500" : "text-gray-400",
            )}
          >
            <FlagIcon
              onClick={() => onFlag("click")}
              className="w-5 h-5"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
      <div className="flex w-full text-lg text-gray-800 dark:text-gray-400 p-2 min-h-[70px]">
        {card.text}
      </div>
    </div>
    <div className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 sm:px-6">
      <div className="flex justify-between">
        <div>
          <BorderedButton
            onClick={() => onDisagree()}
            color="red"
            disabled={!isActive}
          >
            &larr; Disagree
          </BorderedButton>
        </div>
        <div>
          <BorderedButton
            onClick={() => onSkip()}
            color="yellow"
            disabled={!isActive}
          >
            <span className="hidden sm:inline">&uarr;</span>Skip
          </BorderedButton>
        </div>
        <div>
          <BorderedButton
            onClick={() => onItsComplicated()}
            color="orange"
            disabled={!isActive}
          >
            <span className="hidden sm:inline">&darr;</span> It&apos;s
            complicated
          </BorderedButton>
        </div>
        <div>
          <BorderedButton
            onClick={() => onAgree()}
            color="green"
            disabled={!isActive}
          >
            Agree &rarr;
          </BorderedButton>
        </div>
      </div>
    </div>
  </>
);

// Default export
// -----------------------------------------------------------------------------

const Card = ({ card, isActive, onSwipe, onStatementFlagged }: CardProps) => {
  const { track } = useAmplitude();

  // State

  const [leaveX, setLeaveX] = useState(0);
  const [leaveY, setLeaveY] = useState(0);

  const [isFlagging, setIsFlagging] = useState(false);

  // View state

  const animate = useMemo(() => {
    if (leaveX !== 0 || leaveY !== 0) {
      return "exit";
    }

    return "default";
  }, [leaveX, leaveY]);

  // Callbacks

  const onDragEnd = useCallback(
    (_e: unknown, info: PanInfo) => {
      track({
        type: "drag",
      });

      if (info.offset.x > X_SWIPE_THRESHOLD) {
        setLeaveX(1000);
        setTimeout(() => onSwipe(card, "agree"), ANIMATION_DURATION * 1000);
      }
      if (info.offset.x < -X_SWIPE_THRESHOLD) {
        setLeaveX(-1000);
        setTimeout(() => onSwipe(card, "disagree"), ANIMATION_DURATION * 1000);
      }
      if (info.offset.y < -Y_SWIPE_THRESHOLD) {
        setLeaveY(-1000);
        setTimeout(() => onSwipe(card, "skip"), ANIMATION_DURATION * 1000);
      }
      if (info.offset.y > Y_SWIPE_THRESHOLD) {
        setLeaveY(1000);
        setTimeout(
          () => onSwipe(card, "itsComplicated"),
          ANIMATION_DURATION * 1000,
        );
      }
    },
    [card, onSwipe, track],
  );

  const onAgree = useCallback(
    (interactionMode: InteractionMode = "click") => {
      if (!isActive) return;
      if (isFlagging) return;

      track({
        type: "votes.agree",
        pollId: card.poll_id,
        cardId: card.id,
        interactionMode,
      });

      setLeaveX(1000);
      setTimeout(() => onSwipe(card, "agree"), ANIMATION_DURATION * 1000);
    },
    [card, isActive, isFlagging, onSwipe, track],
  );

  const onDisagree = useCallback(
    (interactionMode: InteractionMode = "click") => {
      if (!isActive) return;
      if (isFlagging) return;

      track({
        type: "votes.disagree",
        pollId: card.poll_id,
        cardId: card.id,
        interactionMode,
      });

      setLeaveX(-1000);
      setTimeout(() => onSwipe(card, "disagree"), ANIMATION_DURATION * 1000);
    },
    [card, isActive, isFlagging, onSwipe, track],
  );

  const onSkip = useCallback(
    (interactionMode: InteractionMode = "click") => {
      if (!isActive) return;
      if (isFlagging) return;

      track({
        type: "votes.skip",
        pollId: card.poll_id,
        cardId: card.id,
        interactionMode,
      });

      setLeaveY(-1000);
      setTimeout(() => onSwipe(card, "skip"), ANIMATION_DURATION * 1000);
    },
    [card, isActive, isFlagging, onSwipe, track],
  );

  const onItsComplicated = useCallback(
    (interactionMode: InteractionMode = "click") => {
      if (!isActive) return;
      if (isFlagging) return;

      track({
        type: "votes.itsComplicated",
        pollId: card.poll_id,
        cardId: card.id,
        interactionMode,
      });

      setLeaveY(1000);
      setTimeout(
        () => onSwipe(card, "itsComplicated"),
        ANIMATION_DURATION * 1000,
      );
    },
    [card, isActive, isFlagging, onSwipe, track],
  );

  const onFlag = useCallback(
    (interactionMode: InteractionMode = "click") => {
      if (!isActive) return;

      track({
        type: "statement.flag.open",
        pollId: card.poll_id,
        cardId: card.id,
        interactionMode,
      });

      setIsFlagging(true);
    },
    [card.id, card.poll_id, isActive, track],
  );

  const onCancelFlag = useCallback(() => {
    if (!isActive) return;
    if (!isFlagging) return;

    track({
      type: "statement.flag.cancel",
      pollId: card.poll_id,
      cardId: card.id,
    });

    setIsFlagging(false);
  }, [card.id, card.poll_id, isActive, isFlagging, track]);

  const onSaveFlag = useCallback(() => {
    if (!isActive) return;
    if (!isFlagging) return;

    setIsFlagging(false);
    onStatementFlagged(card.id);
  }, [card.id, isActive, isFlagging, onStatementFlagged]);

  // Keyboard shortcuts

  useHotkeys(Key.ArrowLeft, () => onDisagree("keyboard"));
  useHotkeys(Key.ArrowRight, () => onAgree("keyboard"));
  useHotkeys(Key.ArrowUp, () => onSkip("keyboard"));
  useHotkeys(Key.ArrowDown, () => onItsComplicated("keyboard"));
  useHotkeys(["f", "shift+f"], () => onFlag("keyboard"));

  // Render

  return (
    <>
      <motion.div
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragEnd={onDragEnd}
        initial={{
          scale: 0.95,
        }}
        animate={animate}
        variants={{
          default: {
            scale: 1,
            x: Number(card.id) % 2 === 0 ? -5 : 5,
            rotate: `${Number(card.id) % 2 === 0 ? -1 : 1}deg`,
          },
          exit: {
            x: leaveX,
            y: leaveY,
            opacity: 0,
            scale: 0.5,
            transition: { duration: 0.2 },
          },
          edit: {
            scale: 1,
          },
        }}
        className={clsx(
          "absolute sm:w-[600px] flex flex-col justify-center items-center cursor-grab overflow-hidden border border-gray-300 bg-white rounded-lg shadow dark:bg-gray-700 dark:drop-shadow-lg dark:border dark:border-gray-800",
        )}
      >
        <CardView
          data={{ card }}
          state={{
            isActive,
            isFlagging,
          }}
          callbacks={{
            onAgree,
            onDisagree,
            onSkip,
            onItsComplicated,
            onFlag,
          }}
        />
      </motion.div>

      <AnimatePresence>
        {isActive && isFlagging && (
          <FlagStatement
            statement={card}
            onCreate={onSaveFlag}
            onCancel={onCancelFlag}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Card;
