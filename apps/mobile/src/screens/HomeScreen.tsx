import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AppChrome, type TabId } from "../chrome/AppChrome";
import type { HomeAuth } from "../auth/clerk";
import {
  AGENTS_EMPTY_BODY,
  AGENTS_EMPTY_TITLE,
  BLOCK_PWA_LINE,
  CTA_RUN,
  HOLD_ONELINER,
  HONESTY_FLAGS,
  PRODUCT_H1,
  PRODUCT_SUPPORT,
  SOFT_HOLD,
} from "../copy";
import { COLORS } from "../theme";
import { SettingsScreen } from "./SettingsScreen";
import { useState } from "react";

export type { HomeAuth };

export function HomeScreen({ auth }: { auth: HomeAuth }) {
  const [tab, setTab] = useState<TabId>("home");
  const [settingsOpen, setSettingsOpen] = useState(false);

  function openTab(id: TabId) {
    setSettingsOpen(false);
    setTab(id);
  }

  return (
    <View style={styles.shell}>
      <StatusBar style="light" />
      <AppChrome
        tab={settingsOpen ? "home" : tab}
        onTab={openTab}
        onSettings={() => {
          setSettingsOpen(true);
          setTab("home");
        }}
      >
        {settingsOpen ? (
          <SettingsScreen auth={auth} />
        ) : tab === "home" ? (
          <HomeFold onRun={() => openTab("run")} />
        ) : (
          <HoldStub />
        )}
      </AppChrome>
    </View>
  );
}

function HomeFold({ onRun }: { onRun: () => void }) {
  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.h1}>{PRODUCT_H1}</Text>
      <Text style={styles.support}>{PRODUCT_SUPPORT}</Text>

      <View style={styles.flagRow}>
        {HONESTY_FLAGS.map((flag) => (
          <View key={flag} style={styles.flag}>
            <Text style={styles.flagText}>{flag}</Text>
          </View>
        ))}
        <View style={styles.flag}>
          <Text style={styles.flagText}>{SOFT_HOLD}</Text>
        </View>
      </View>

      <Pressable
        onPress={onRun}
        style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={CTA_RUN}
      >
        <Text style={styles.ctaLabel}>{CTA_RUN}</Text>
      </Pressable>

      <Text style={styles.holdLine}>{HOLD_ONELINER}</Text>

      <View style={styles.emptyCard}>
        <Text style={styles.emptyTitle}>{AGENTS_EMPTY_TITLE}</Text>
        <Text style={styles.emptyBody}>{AGENTS_EMPTY_BODY}</Text>
        <Pressable
          onPress={onRun}
          accessibilityRole="button"
          accessibilityLabel={CTA_RUN}
          hitSlop={6}
        >
          <Text style={styles.emptyVerb}>{CTA_RUN}</Text>
        </Pressable>
      </View>

      <Text style={styles.blockLine}>{BLOCK_PWA_LINE}</Text>
    </ScrollView>
  );
}

function HoldStub() {
  return (
    <View style={styles.stub}>
      <Text style={styles.holdLine}>{HOLD_ONELINER}</Text>
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
    paddingTop: 20,
    paddingBottom: 28,
    gap: 14,
  },
  h1: {
    color: COLORS.reverse,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "600",
    letterSpacing: -0.6,
    marginTop: 4,
  },
  support: {
    color: COLORS.muted,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "500",
  },
  flagRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 6,
    marginTop: 2,
  },
  flag: {
    borderColor: COLORS.chipLine,
    borderWidth: 1,
    backgroundColor: COLORS.chip,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  flagText: {
    color: COLORS.muted,
    fontSize: 11,
    fontVariant: ["tabular-nums"],
  },
  cta: {
    marginTop: 4,
    backgroundColor: COLORS.teal,
    borderRadius: 8,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaLabel: {
    color: COLORS.tealLabel,
    fontSize: 16,
    fontWeight: "700",
  },
  holdLine: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  emptyCard: {
    marginTop: 2,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  emptyTitle: {
    color: COLORS.reverse,
    fontSize: 16,
    fontWeight: "600",
  },
  emptyBody: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  emptyVerb: {
    color: COLORS.reverse,
    fontSize: 15,
    fontWeight: "600",
  },
  blockLine: {
    color: COLORS.faint,
    fontSize: 12,
    lineHeight: 18,
  },
  stub: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  pressed: {
    opacity: 0.85,
  },
});
