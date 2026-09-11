import { HOW_IT_WORKS } from "@/lib/brand";

export function HowItWorksRail() {
  return (
    <section id="how" className="scroll-mt-8">
      <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
        {HOW_IT_WORKS.heading}
      </h2>
      <ol className="mt-5 list-none space-y-3 p-0">
        {HOW_IT_WORKS.steps.map((step, index) => (
          <li
            key={step.title}
            className="flex items-start gap-3 rounded-[1.35rem] bg-surface px-4 py-4 ring-1 ring-[var(--bb-line)]"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-xs tabular-nums">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-medium tracking-tight">
                {step.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
