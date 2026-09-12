const SECRET_KEY =
  /(api[_-]?key|auth[_-]?token|password|secret|ciphertext|oauth|refresh|authorization|cookie|sid)$/i;

export function looksLikeSecretKey(key: string) {
  return SECRET_KEY.test(key);
}

export function sanitizeAuditMetadata(
  metadata: Record<string, unknown> | undefined,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata ?? {})) {
    if (looksLikeSecretKey(key)) continue;
    if (typeof value === "string" && /bearer\s+|sk_|api[_-]?key/i.test(value)) {
      continue;
    }
    out[key] = value;
  }
  return out;
}

export function assertNoSecretsLogged(value: unknown) {
  const blob = JSON.stringify(value ?? {});
  if (/BOTBUY_VAULT_KEY|ApiKey=|AuthToken=|Bearer\s+[A-Za-z0-9._-]+/i.test(blob)) {
    throw new Error("Refusing to log connector secrets");
  }
}
