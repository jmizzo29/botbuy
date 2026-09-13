const SECRET_KEY =
  /(api[_-]?key|auth[_-]?token|password|secret|ciphertext|oauth|refresh|authorization|cookie|sid|pan|cvv|cvc)$/i;

/** 13–19 digit runs look like card PAN. Never log them. */
const PAN_LIKE = /\b(?:\d[ -]?){13,19}\b/;

export function looksLikeSecretKey(key: string) {
  return SECRET_KEY.test(key);
}

export function looksLikePan(value: string) {
  return PAN_LIKE.test(value.replace(/\s+/g, " ").trim());
}

export function sanitizeAuditMetadata(
  metadata: Record<string, unknown> | undefined,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata ?? {})) {
    if (looksLikeSecretKey(key)) continue;
    if (
      typeof value === "string" &&
      (/bearer\s+|sk_|rk_|pk_|whsec_|api[_-]?key/i.test(value) || looksLikePan(value))
    ) {
      continue;
    }
    out[key] = value;
  }
  return out;
}

export function assertNoSecretsLogged(value: unknown) {
  const blob = JSON.stringify(value ?? {});
  if (
    /BOTBUY_VAULT_KEY|ApiKey=|AuthToken=|Bearer\s+[A-Za-z0-9._-]+|(?:sk|rk|pk|whsec)_[A-Za-z0-9]+/i.test(
      blob,
    )
  ) {
    throw new Error("Refusing to log connector secrets");
  }
  if (PAN_LIKE.test(blob)) {
    throw new Error("Refusing to log card PAN");
  }
}
