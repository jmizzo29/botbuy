import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  type AdapterCatalogResponse,
  type ApiResult,
  createBotBuyerClient,
} from "../api/botbuyer";
import { apiBase } from "../config";
import {
  APPROVE_MICRO,
  AUTO_APPROVE_OFF,
  BLOCK_PWA,
  CLERK_KEYS_MISSING,
  CLERK_KEYS_READY,
  FOOTER_HOLD,
  HONESTY_FLAGS,
  NO_LIVE_BUY,
  ONE_LINER,
  POC_BANNER,
  PRODUCT_H1,
  PRODUCT_NAME,
  PRODUCT_SUPPORT,
  SAME_PRODUCT,
  SIGNAL_HOLD,
  STAGE_APPS_FIRST,
  STORE_HOLD,
  STORE_TARGETS,
  TRUST_LINE,
} from "../copy";
import { COLORS } from "../theme";

export type HomeAuth = {
  keysConfigured: boolean;
  isLoaded?: boolean;
  isSignedIn?: boolean;
  email?: string | null;
  busy?: boolean;
  message?: string | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
};

type DealsProbe = {
  status: number;
  detail: string;
};

export function HomeScreen({ auth }: { auth: HomeAuth }) {
  const insets = useSafeAreaInsets();
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
    <View style={[styles.shell, { paddingTop: insets.top + 12 }]}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 28 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandRow}>
          <Image
            source={require("../../assets/mark.png")}
            style={styles.mark}
            accessibilityLabel="BotBuyer mark"
          />
          <Text style={styles.wordmark}>{PRODUCT_NAME}</Text>
        </View>

        <Text style={styles.h1}>{PRODUCT_H1}</Text>
        <Text style={styles.support}>{PRODUCT_SUPPORT}</Text>
        <Text style={styles.oneLiner}>{ONE_LINER}</Text>

        <View style={styles.flagRow}>
          {HONESTY_FLAGS.map((flag) => (
            <View key={flag} style={styles.flag}>
              <Text style={styles.flagText}>{flag}</Text>
            </View>
          ))}
          <View style={styles.flag}>
            <Text style={styles.flagText}>{AUTO_APPROVE_OFF}</Text>
          </View>
        </View>

        <Text style={styles.hold}>{SIGNAL_HOLD}</Text>
        <Text style={styles.support}>{STORE_TARGETS}</Text>
        <Text style={styles.micro}>{APPROVE_MICRO}</Text>
        <Text style={styles.micro}>{TRUST_LINE}</Text>
        <Text style={styles.muted}>{BLOCK_PWA}</Text>
        <Text style={styles.muted}>{STAGE_APPS_FIRST}</Text>
        <Text style={styles.muted}>{STORE_HOLD}</Text>
        <Text style={styles.muted}>{NO_LIVE_BUY}</Text>
        <Text style={styles.muted}>{SAME_PRODUCT}</Text>

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
                styles.cta,
                !auth.keysConfigured && styles.ctaDisabled,
                pressed && auth.keysConfigured && styles.pressed,
              ]}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.ctaLabel,
                  !auth.keysConfigured && styles.ctaLabelDisabled,
                ]}
              >
                {auth.busy ? "Opening Clerk…" : "Sign in"}
              </Text>
            </Pressable>
          )}
          {auth.message ? (
            <Text style={styles.warn}>{auth.message}</Text>
          ) : null}
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
          <Text style={styles.muted}>
            live={String(client.honesty.live)} · spend=
            {String(client.honesty.spend)} · autoApprove=
            {String(client.honesty.autoApprove)}
          </Text>
        </View>

        <Text style={styles.footer}>
          {POC_BANNER} · {FOOTER_HOLD}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },
  scroll: {
    paddingHorizontal: 24,
    gap: 12,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  mark: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  wordmark: {
    color: COLORS.reverse,
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  h1: {
    color: COLORS.reverse,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "600",
    letterSpacing: -0.6,
    marginTop: 12,
  },
  support: {
    color: COLORS.teal,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
  },
  oneLiner: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  flagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  flag: {
    borderColor: COLORS.line,
    borderWidth: 1,
    backgroundColor: COLORS.chip,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  flagText: {
    color: COLORS.teal,
    fontSize: 12,
    fontVariant: ["tabular-nums"],
  },
  hold: {
    color: COLORS.reverse,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  micro: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  muted: {
    color: COLORS.faint,
    fontSize: 13,
    lineHeight: 19,
  },
  card: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  cardKicker: {
    color: COLORS.teal,
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
    color: COLORS.teal,
    fontSize: 14,
    lineHeight: 20,
  },
  warn: {
    color: COLORS.danger,
    fontSize: 13,
    lineHeight: 19,
  },
  cta: {
    marginTop: 4,
    backgroundColor: COLORS.teal,
    borderRadius: 999,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaDisabled: {
    backgroundColor: "rgba(45,212,191,0.28)",
  },
  ctaLabel: {
    color: COLORS.tealLabel,
    fontSize: 16,
    fontWeight: "700",
  },
  ctaLabelDisabled: {
    color: COLORS.navy,
  },
  ghostButton: {
    marginTop: 4,
    borderRadius: 999,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.line,
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
