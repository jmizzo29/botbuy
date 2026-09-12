import { NextResponse } from "next/server";
import { z } from "zod";
import { requireApiUser } from "@/lib/api-auth";
import { invokeConnectorTool, isConnectorTool } from "@/lib/connectors/runtime";
import { ConnectorError } from "@/lib/connectors/types";
import { isConnectorProvider } from "@/lib/connectors/vault";

const bodySchema = z.object({
  provider: z.string(),
  tool: z.string(),
  dealId: z.string().optional(),
  query: z.string().optional(),
  domain: z.string().optional(),
  country: z.string().optional(),
  phoneNumber: z.string().optional(),
  years: z.number().int().positive().optional(),
});

export async function POST(request: Request) {
  const gated = await requireApiUser();
  if (gated.error) return gated.error;
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (
    !parsed.success ||
    !isConnectorProvider(parsed.data.provider) ||
    !isConnectorTool(parsed.data.tool)
  ) {
    return NextResponse.json({ error: "Invalid connector tool" }, { status: 400 });
  }
  try {
    const result = await invokeConnectorTool({
      userId: gated.user.id,
      provider: parsed.data.provider,
      tool: parsed.data.tool,
      dealId: parsed.data.dealId,
      payload: {
        query: parsed.data.query,
        domain: parsed.data.domain,
        country: parsed.data.country,
        phoneNumber: parsed.data.phoneNumber,
        years: parsed.data.years,
      },
    });
    return NextResponse.json({ ...result, live: false });
  } catch (error) {
    if (error instanceof ConnectorError) {
      const status = error.code === "approve" ? 409 : 400;
      return NextResponse.json(
        {
          ok: false,
          live: false,
          result: "blocked",
          reason: error.message,
        },
        { status },
      );
    }
    return NextResponse.json(
      { ok: false, live: false, result: "error", reason: "Tool failed closed." },
      { status: 500 },
    );
  }
}
