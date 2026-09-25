import Link from "next/link";
import type { ReactNode } from "react";
import {
  GOLIVE_AUTO_OFF,
  GOLIVE_EXAMPLE_CHIP,
  GOLIVE_HONESTY_APPROVE,
  GOLIVE_HONESTY_CHARGE,
  GOLIVE_RECAP_LABEL,
  GOLIVE_RUNNING_STATUS,
  GOLIVE_VIEW_SEARCHES,
  type GoliveModel,
  type GoliveRow,
} from "@/lib/golive-quiet";

function Check() {
  return (
    <span className="bb-golive-check" data-golive="check" aria-label="Complete">
      ✓
    </span>
  );
}

function Row({ row, recap }: { row: GoliveRow; recap: boolean }) {
  return (
    <div className={recap ? "bb-golive-row bb-golive-row-recap" : "bb-golive-row"} data-golive="row">
      <div className="bb-golive-row-copy">
        <p className="bb-golive-row-label">{row.label}</p>
        <p className="bb-golive-row-meta">{row.meta}</p>
      </div>
      {row.done ? (
        <Check />
      ) : row.href && row.hrefLabel ? (
        <Link href={row.href} className="bb-golive-row-link">
          {row.hrefLabel}
        </Link>
      ) : null}
    </div>
  );
}

function ExampleChip() {
  return (
    <span className="bb-golive-chip" data-intent-chip="example">
      {GOLIVE_EXAMPLE_CHIP}
    </span>
  );
}

function Honesty({ panel }: { panel: GoliveModel["panel"] }) {
  if (panel === "running") {
    return (
      <p className="bb-golive-micro bb-golive-micro-running">
        <span>{GOLIVE_HONESTY_APPROVE}</span>
        <span>{GOLIVE_AUTO_OFF}</span>
      </p>
    );
  }
  return (
    <p className="bb-golive-micro">
      {GOLIVE_HONESTY_APPROVE}
      <br />
      {GOLIVE_HONESTY_CHARGE}
      {panel === "ready" ? (
        <>
          <br />
          {GOLIVE_AUTO_OFF}
        </>
      ) : null}
    </p>
  );
}

export function GoliveQuiet({
  model,
  runControl,
  runLabel,
  runHref,
  searchesHref,
  note,
}: {
  model: GoliveModel;
  /** Signed-in Run BotBuyer control. Craft omits this and uses runHref. */
  runControl?: ReactNode;
  runLabel?: string;
  runHref?: string;
  searchesHref: string;
  note?: string | null;
}) {
  const recap = model.panel === "ready";

  if (model.panel === "running") {
    return (
      <>
        <div className="bb-golive-running" data-golive="card">
          <p className="bb-golive-status">
            <span className="bb-golive-pulse" aria-hidden="true" />
            {GOLIVE_RUNNING_STATUS}
          </p>
          <h1 className="bb-golive-head">{model.title}</h1>
          <p className="bb-golive-copy">{model.sub}</p>
          <Link href={searchesHref} className="bb-golive-cta bb-golive-cta-inline" data-golive="run">
            {GOLIVE_VIEW_SEARCHES}
          </Link>
          <div className="bb-golive-recap">
            {model.recap.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
        <Honesty panel="running" />
        {note ? <p className="bb-golive-note">{note}</p> : null}
        <ExampleChip />
      </>
    );
  }

  const control =
    runControl ??
    (model.panel === "ready" && runHref && runLabel ? (
      <Link href={runHref} className="bb-golive-cta" data-golive="run">
        {runLabel}
      </Link>
    ) : (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className="bb-golive-cta bb-golive-cta-muted"
        data-golive="run-muted"
      >
        {runLabel}
      </button>
    ));

  return (
    <>
      <h1 className="bb-golive-head">{model.title}</h1>
      <p className="bb-golive-sub">{model.sub}</p>
      <div className="bb-golive-list" data-golive="card">
        {recap ? <div className="bb-golive-kicker">{GOLIVE_RECAP_LABEL}</div> : null}
        {model.rows.map((row) => (
          <Row key={row.label} row={row} recap={recap} />
        ))}
      </div>
      <div className="bb-golive-actions">
        {control}
        {model.panel === "incomplete" && model.secondaryHref && model.secondaryLabel ? (
          <Link
            href={model.secondaryHref}
            className="bb-golive-cta bb-golive-cta-secondary"
            data-golive="secondary"
          >
            {model.secondaryLabel}
          </Link>
        ) : null}
      </div>
      <Honesty panel={model.panel} />
      {note ? <p className="bb-golive-note">{note}</p> : null}
      <ExampleChip />
    </>
  );
}
