"use client";

import { useState } from "react";
import { INTENT_HELD_NOTE } from "@/lib/intent-chat";

const approve =
  "inline-flex min-h-11 flex-1 items-center justify-center rounded-[8px] bg-[#2DD4BF] text-[14px] font-[650] text-[#042F2E] md:min-h-10";
const reject =
  "inline-flex min-h-11 flex-1 items-center justify-center rounded-[8px] border bg-transparent text-[14px] font-[600] text-white/[0.88] md:min-h-10";

/** EXAMPLE decision. Does not call spend, status, or approve APIs. Auto-approve OFF. */
export function IntentExampleDecision() {
  const [held, setHeld] = useState(false);

  return (
    <>
      <div className="mb-2.5 flex gap-2 md:mb-3 md:max-w-[320px] md:gap-2.5">
        <button
          type="button"
          className={approve}
          data-charge="false"
          data-auto-approve="off"
          onClick={() => setHeld(true)}
        >
          Approve
        </button>
        <button
          type="button"
          className={reject}
          data-intent-line="reject"
          data-charge="false"
          data-auto-approve="off"
          onClick={() => setHeld(true)}
        >
          Reject
        </button>
      </div>
      {held ? (
        <p className="mb-1 text-[11px] leading-[1.35] text-white/55 md:text-[12px] md:leading-[1.4]">
          {INTENT_HELD_NOTE}
        </p>
      ) : null}
    </>
  );
}
