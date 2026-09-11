import { Card } from "@/components/ui/card";
import { HOW_IT_WORKS } from "@/lib/brand";

export function HowItWorksRail() {
  return (
    <section id="how" className="scroll-mt-8">
      <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
        {HOW_IT_WORKS.heading}
      </h2>
      <ol className="mt-6 grid list-none gap-3 p-0 md:grid-cols-3">
        {HOW_IT_WORKS.steps.map((step, index) => (
          <li key={step.title}>
            <Card className="px-5 py-6">
              <p className="text-[11px] tabular-nums tracking-[0.14em] text-muted">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-4 text-[15px] font-medium tracking-tight">
                {step.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </Card>
          </li>
        ))}
      </ol>
    </section>
  );
}
