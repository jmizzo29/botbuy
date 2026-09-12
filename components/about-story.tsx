import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ABOUT_ARC_SRC,
  ABOUT_CONTROL,
  ABOUT_CONTROL_SRC,
  ABOUT_ENTITY,
  ABOUT_H1,
  ABOUT_HOW_HEADING,
  ABOUT_MARK_SRC,
  ABOUT_META_LINE,
  ABOUT_SIGNUP_HREF,
  ABOUT_STEPS,
  ABOUT_SUPPORT,
} from "@/lib/about-story";
import { BRAND } from "@/lib/brand";

export function AboutStory() {
  return (
    <div
      data-surface="about-story"
      className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(22rem,28rem)] lg:items-start lg:gap-16 xl:gap-20"
    >
      <section className="pt-6 lg:pt-4">
        <p className="text-sm text-muted">{ABOUT_ENTITY}</p>
        <Image
          src={ABOUT_MARK_SRC}
          alt="BotBuy mark"
          width={88}
          height={88}
          unoptimized
          priority
          className="mt-8 h-[4.5rem] w-[4.5rem] lg:h-[5.5rem] lg:w-[5.5rem]"
        />
        <h1 className="mt-8 max-w-xl text-[2.5rem] font-semibold leading-[1.08] tracking-tight md:text-6xl">
          {ABOUT_H1}
        </h1>
        <div
          aria-hidden="true"
          className="mt-5 h-[2px] w-14 rounded-full bg-[#2DD4BF]"
        />
        <p className="mt-5 max-w-lg text-xl font-semibold tracking-tight">
          {ABOUT_SUPPORT}
        </p>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
          {ABOUT_META_LINE}
        </p>
        <Image
          src={ABOUT_ARC_SRC}
          alt="Find Decide Buy"
          width={320}
          height={72}
          unoptimized
          className="mt-10 h-auto w-full max-w-sm"
        />
        <ControlBlock className="mt-12 hidden lg:block" />
      </section>

      <aside className="mt-14 lg:mt-4">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted lg:sr-only">
          {ABOUT_HOW_HEADING}
        </h2>
        <ol className="mt-5 list-none space-y-4 p-0 lg:mt-0">
          {ABOUT_STEPS.map((step) => (
            <li
              key={step.caption}
              className="lg:flex lg:items-center lg:gap-5"
            >
              <Image
                src={step.art}
                alt=""
                width={280}
                height={160}
                unoptimized
                className="h-auto w-full lg:w-[13.5rem] lg:shrink-0"
              />
              <p className="mt-3 text-[17px] font-semibold tracking-tight lg:mt-0">
                <span className="mr-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                  <span className="lg:hidden">{step.n}</span>
                  <span className="hidden lg:inline">STEP {step.n}</span>
                </span>
                {step.caption}
              </p>
            </li>
          ))}
        </ol>
      </aside>

      <ControlBlock className="mt-12 lg:hidden" />
    </div>
  );
}

function ControlBlock({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="hidden text-base font-semibold tracking-tight lg:block">
        {ABOUT_CONTROL}
      </p>
      <Image
        src={ABOUT_CONTROL_SRC}
        alt={ABOUT_CONTROL}
        width={280}
        height={120}
        unoptimized
        className="mt-4 h-auto w-full max-w-sm lg:mt-5"
      />
      <p className="mt-4 text-base font-semibold tracking-tight lg:hidden">
        {ABOUT_CONTROL}
      </p>
      <div className="mt-6">
        <Button asChild size="lg">
          <Link href={ABOUT_SIGNUP_HREF} data-cta="about-signup">
            {BRAND.primaryCta}
          </Link>
        </Button>
      </div>
    </div>
  );
}
