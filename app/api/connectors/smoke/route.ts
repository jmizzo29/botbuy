import { NextResponse } from "next/server";
import { z } from "zod";
import { requireApiUser } from "@/lib/api-auth";
import { CONNECT_ACCOUNTS_HONESTY } from "@/lib/connectors/copy";
import { listConnectorReadiness } from "@/lib/connectors/keys";
import { smokeConnectorSearch } from "@/lib/connectors/smoke";
import { ConnectorError } from "@/lib/connectors/types";
import { isConnectorProvider } from "@/lib/connectors/vault";

export async function GET() {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const readiness = await listConnectorReadiness(gated.user.id);
  return NextResponse.json({
    honesty: CONNECT_ACCOUNTS_HONESTY,
    tool: "search",
    ...readiness,
    spend: false,
    live: false,
  });
}

const bodySchema = z.object({
  provider: z.string(),
  query: z.string().optional(),
});

export async function POST(request: Request) {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !isConnectorProvider(parsed.data.provider)) {
    return NextResponse.json(
      { ok: false, live: false, spend: false, error: "Invalid connector smoke" },
      { status: 400 },
    );
  }
  try {
    const result = await smokeConnectorSearch({
      userId: gated.user.id,
      provider: parsed.data.provider,
      query: parsed.data.query,
    });
    return NextResponse.json({ honesty: CONNECT_ACCOUNTS_HONESTY, ...result });
  } catch (error) {
    if (error instanceof ConnectorError) {
      const status = error.code === "approve" ? 409 : 400;
      return NextResponse.json(
        {
          ok: false,
          live: false,
          spend: false,
          result: "blocked",
          reason: error.message,
        },
        { status },
      );
    }
    return NextResponse.json(
      {
        ok: false,
        live: false,
        spend: false,
        result: "error",
        reason: "Read-only smoke failed closed.",
      },
      { status: 500 },
    );
  }
}
