import Image from "next/image";
import { HOW_IT_WORKS } from "@/lib/brand";

export function HowItWorksRail() {
  return (
    <section id="how" className="scroll-mt-8">
      <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
        {HOW_IT_WORKS.heading}
      </h2>
      <ol className="mt-5 list-none space-y-5 p-0">
        {HOW_IT_WORKS.steps.map((step, index) => (
          <li key={step.title} className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
              Step {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-1 text-[15px] font-medium tracking-tight">
              {step.title}
            </p>
            <div className="mt-3 overflow-hidden rounded-[1rem]">
              <Image
                src={step.graphic}
                alt={step.title}
                width={320}
                height={140}
                unoptimized
                className="h-auto w-full"
              />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
