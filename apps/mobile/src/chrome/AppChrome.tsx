import type { ReactNode } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  PRODUCT_NAME,
  SETTINGS_LINK,
  TAB_DEALS,
  TAB_HOME,
  TAB_RUN,
  TAB_VAULT,
} from "../copy";
import { COLORS } from "../theme";

export const TABS = [
  { id: "home", label: TAB_HOME },
  { id: "run", label: TAB_RUN },
  { id: "deals", label: TAB_DEALS },
  { id: "vault", label: TAB_VAULT },
] as const;

export type TabId = (typeof TABS)[number]["id"];

export function AppChrome({
  tab,
  onTab,
  onSettings,
  children,
}: {
  tab: TabId;
  onTab: (id: TabId) => void;
  onSettings: () => void;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.shell}>
      <View style={[styles.chrome, { paddingTop: insets.top + 10 }]}>
        <View style={styles.chromeRow}>
          <View style={styles.brand}>
            <Image
              source={require("../../assets/mark.png")}
              style={styles.mark}
              accessibilityLabel="BotBuyer mark"
            />
            <Text style={styles.wordmark}>{PRODUCT_NAME}</Text>
          </View>
          <Pressable
            onPress={onSettings}
            accessibilityRole="button"
            accessibilityLabel={SETTINGS_LINK}
            hitSlop={8}
          >
            <Text style={styles.settings}>{SETTINGS_LINK}</Text>
          </Pressable>
        </View>
        <View style={styles.chromeHairline} />
        <View style={styles.tealHairlineWrap}>
          <View style={styles.tealHairline} />
        </View>
      </View>

      <View style={styles.body}>{children}</View>

      <View
        style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}
      >
        <View style={styles.tabHairline} />
        <View style={styles.tabRow}>
          {TABS.map((item) => {
            const active = item.id === tab;
            return (
              <Pressable
                key={item.id}
                onPress={() => onTab(item.id)}
                style={styles.tab}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={item.label}
              >
                <View
                  style={[styles.tabDot, active && styles.tabDotActive]}
                />
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },
  chrome: {
    backgroundColor: COLORS.navy,
  },
  chromeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mark: {
    width: 26,
    height: 26,
  },
  wordmark: {
    color: COLORS.reverse,
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  settings: {
    color: COLORS.muted,
    fontSize: 15,
    fontWeight: "500",
  },
  chromeHairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.line,
  },
  tealHairlineWrap: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  tealHairline: {
    width: 28,
    height: 1,
    backgroundColor: COLORS.tealHairline,
    alignSelf: "flex-start",
  },
  body: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: COLORS.navy,
  },
  tabHairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.line,
  },
  tabRow: {
    flexDirection: "row",
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    minHeight: 44,
    justifyContent: "center",
  },
  tabDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "rgba(255,255,255,0.28)",
  },
  tabDotActive: {
    backgroundColor: COLORS.reverse,
  },
  tabLabel: {
    color: COLORS.faint,
    fontSize: 12,
    fontWeight: "500",
  },
  tabLabelActive: {
    color: COLORS.reverse,
  },
});
