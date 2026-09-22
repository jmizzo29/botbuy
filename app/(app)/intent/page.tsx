import { IntentForm } from "@/components/intent-form";
import { requireUser } from "@/lib/auth";
import {
  INTENT_H1,
  INTENT_SUB,
  hasReachableEmail,
} from "@/lib/john-ux";
import { formatUsd } from "@/lib/money";
import { listIntents } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "New hunt",
};

export default async function IntentPage() {
  const user = await requireUser();
  const intents = listIntents(user.id);

  return (
    <div className="space-y-6">
      <header>
        <p className="sr-only">{INTENT_H1}</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#9bb0c7]">
          Start
        </p>
        <h1 className="mt-1 text-[1.85rem] font-semibold tracking-tight text-white">
          New hunt
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#9bb0c7]">
          {INTENT_SUB}
        </p>
      </header>

      <div className="bb-hunt-form">
        <IntentForm emailMissing={!hasReachableEmail(user)} />
      </div>

      {intents.length ? (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-white/80">Recent</h2>
          <ul className="grid list-none gap-3 p-0">
            {intents.map((intent) => (
              <li
                key={intent.id}
                className="rounded-xl border border-white/15 bg-[#163556] px-4 py-4"
              >
                <p className="text-[15px] font-medium text-white">{intent.summary}</p>
                <p className="mt-1 font-mono text-xs text-white/55">
                  {intent.status} \u00b7 {formatUsd(intent.maxPriceUsd)} \u00b7{" "}
                  {formatDate(intent.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
