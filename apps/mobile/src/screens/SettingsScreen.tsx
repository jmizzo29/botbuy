import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  type AdapterCatalogResponse,
  type ApiResult,
  createBotBuyerClient,
} from "../api/botbuyer";
import { apiBase } from "../config";
import {
  CLERK_KEYS_MISSING,
  CLERK_KEYS_READY,
  FOOTER_HOLD,
  POC_BANNER,
} from "../copy";
import type { HomeAuth } from "../auth/clerk";
import { COLORS } from "../theme";

type DealsProbe = {
  status: number;
  detail: string;
};

export function SettingsScreen({ auth }: { auth: HomeAuth }) {
  const client = createBotBuyerClient(apiBase());
  const [catalog, setCatalog] = useState<ApiResult<AdapterCatalogResponse> | null>(
    null,
  );
  const [dealsProbe, setDealsProbe] = useState<DealsProbe | null>(null);

  useEffect(() => {
    let cancelled = false;
    const api = createBotBuyerClient(apiBase());

    void api.adapters().then((result) => {
      if (!cancelled) setCatalog(result);
    });

    void api.deals().then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setDealsProbe({
          status: result.status,
          detail: `${result.data.deals.length} deal row(s) · read-only list`,
        });
        return;
      }
      setDealsProbe({
        status: result.status,
        detail:
          result.status === 401
            ? "401 Unauthorized · fail-closed without a Clerk session (expected in M0)"
            : result.error,
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.cardKicker}>Clerk Expo · fail-closed</Text>
        <Text style={styles.cardTitle}>
          keysConfigured={String(auth.keysConfigured)}
        </Text>
        <Text style={styles.cardBody}>
          {auth.keysConfigured ? CLERK_KEYS_READY : CLERK_KEYS_MISSING}
        </Text>
        {auth.keysConfigured && auth.isLoaded === false ? (
          <ActivityIndicator color={COLORS.teal} style={styles.spinner} />
        ) : auth.isSignedIn ? (
          <>
            <Text style={styles.cardBody}>
              Signed in{auth.email ? ` · ${auth.email}` : ""}. Session is
              identity only — spend stays false.
            </Text>
            <Pressable
              onPress={auth.onSignOut}
              style={({ pressed }) => [
                styles.ghostButton,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
            >
              <Text style={styles.ghostLabel}>Sign out</Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            onPress={auth.keysConfigured ? auth.onSignIn : undefined}
            disabled={!auth.keysConfigured || auth.busy}
            style={({ pressed }) => [
              styles.ghostButton,
              !auth.keysConfigured && styles.ghostDisabled,
              pressed && auth.keysConfigured && styles.pressed,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.ghostLabel}>
              {auth.busy ? "Opening Clerk…" : "Sign in"}
            </Text>
          </Pressable>
        )}
        {auth.message ? <Text style={styles.warn}>{auth.message}</Text> : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardKicker}>Stage API · read-only</Text>
        <Text style={styles.cardTitle}>GET /api/adapters</Text>
        <Text style={styles.cardBody}>{client.base}</Text>
        {!catalog ? (
          <ActivityIndicator color={COLORS.teal} style={styles.spinner} />
        ) : catalog.ok ? (
          <>
            <Text style={styles.ok}>
              {catalog.status} · {catalog.data.adapters.length} adapter
              stub{catalog.data.adapters.length === 1 ? "" : "s"} ·
              merchantAllowlist={String(catalog.data.merchantAllowlist)}
            </Text>
            <Text style={styles.cardBody}>
              {catalog.data.adapters.map((item) => item.label).join(" · ") ||
                "Empty catalog stub"}
            </Text>
          </>
        ) : (
          <Text style={styles.warn}>
            {catalog.status || "offline"} · {catalog.error}
          </Text>
        )}
        <Text style={[styles.cardTitle, styles.spaced]}>GET /api/deals</Text>
        {dealsProbe ? (
          <Text
            style={dealsProbe.status === 401 ? styles.ok : styles.cardBody}
          >
            {dealsProbe.status} · {dealsProbe.detail}
          </Text>
        ) : (
          <ActivityIndicator color={COLORS.teal} style={styles.spinner} />
        )}
        <Text style={styles.cardBody}>
          live={String(client.honesty.live)} · spend=
          {String(client.honesty.spend)} · autoApprove=
          {String(client.honesty.autoApprove)}
        </Text>
      </View>

      <Text style={styles.footer}>
        {POC_BANNER} · {FOOTER_HOLD}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  cardKicker: {
    color: COLORS.muted,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  cardTitle: {
    color: COLORS.reverse,
    fontSize: 16,
    fontWeight: "600",
  },
  cardBody: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  spaced: {
    marginTop: 8,
  },
  ok: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  warn: {
    color: COLORS.danger,
    fontSize: 13,
    lineHeight: 19,
  },
  ghostButton: {
    marginTop: 4,
    borderRadius: 8,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  ghostDisabled: {
    opacity: 0.5,
  },
  ghostLabel: {
    color: COLORS.reverse,
    fontSize: 15,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.85,
  },
  spinner: {
    marginVertical: 8,
    alignSelf: "flex-start",
  },
  footer: {
    color: COLORS.faint,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
});
