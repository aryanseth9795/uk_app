// OrderStatusTimeline — animated vertical status timeline for an order.
// Driven by the order's current status and (optionally) a statusHistory[] of
// { status, timestamp } entries. Handles the happy path
// (Placed -> Confirmed -> Packed -> Shipped -> Out for Delivery -> Delivered)
// as well as the terminal Cancelled / Returned states.
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { colors } from "@theme/color";

// ---- Public types ----------------------------------------------------------

export type StatusHistoryEntry = {
  status: string;
  // Accept a few common key names for the timestamp.
  timestamp?: string;
  at?: string;
  date?: string;
  updatedAt?: string;
};

type Props = {
  currentStatus: string;
  statusHistory?: StatusHistoryEntry[];
};

// ---- Canonical flow --------------------------------------------------------

const FLOW = [
  "Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
] as const;

type CanonicalStatus =
  | (typeof FLOW)[number]
  | "Cancelled"
  | "Returned";

const ICONS: Record<CanonicalStatus, keyof typeof Ionicons.glyphMap> = {
  Placed: "receipt-outline",
  Confirmed: "checkmark-circle-outline",
  Packed: "cube-outline",
  Shipped: "car-outline",
  "Out for Delivery": "bicycle-outline",
  Delivered: "home-outline",
  Cancelled: "close-circle-outline",
  Returned: "arrow-undo-outline",
};

const DONE = colors.tint; // purple
const ACTIVE = colors.tint;
const TODO = "#D1D5DB";
const DANGER = colors.danger;
const SUCCESS = colors.success;

// Normalize any backend casing ("delivered", "CANCELLED", ...) to canonical.
function normalize(status: string | undefined): CanonicalStatus | null {
  if (!status) return null;
  const all: CanonicalStatus[] = [...FLOW, "Cancelled", "Returned"];
  const found = all.find((s) => s.toLowerCase() === status.toLowerCase());
  return found ?? null;
}

function getTimestamp(entry: StatusHistoryEntry | undefined): string | undefined {
  if (!entry) return undefined;
  return entry.timestamp || entry.at || entry.date || entry.updatedAt;
}

function formatTime(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return undefined;
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

type StepState = "done" | "current" | "todo" | "terminal";

type Step = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  time?: string;
  state: StepState;
  color: string;
  // whether the connector BELOW this row should appear "filled"
  connectorFilled: boolean;
  isLast: boolean;
};

// ---- Build the visible steps -----------------------------------------------

function buildSteps(
  currentStatus: string,
  statusHistory?: StatusHistoryEntry[]
): Step[] {
  const historyMap = new Map<string, string | undefined>();
  (statusHistory || []).forEach((e) => {
    const c = normalize(e.status);
    if (c) historyMap.set(c, getTimestamp(e));
  });

  const current = normalize(currentStatus);
  const isCancelled = current === "Cancelled";
  const isReturned = current === "Returned";

  // How far along the normal flow we got (based on history + current).
  let reachedIndex = -1;
  FLOW.forEach((s, i) => {
    if (historyMap.has(s)) reachedIndex = Math.max(reachedIndex, i);
  });
  if (current && (FLOW as readonly string[]).includes(current)) {
    reachedIndex = Math.max(reachedIndex, FLOW.indexOf(current as any));
  }
  if (reachedIndex < 0) reachedIndex = 0; // always show at least "Placed"

  const steps: Step[] = [];

  if (isReturned) {
    // Full happy path is done, then a Returned terminal node.
    FLOW.forEach((label, i) => {
      steps.push({
        key: label,
        label,
        icon: ICONS[label],
        time: formatTime(historyMap.get(label)),
        state: "done",
        color: i === FLOW.length - 1 ? SUCCESS : DONE,
        connectorFilled: true,
        isLast: false,
      });
    });
    steps.push({
      key: "Returned",
      label: "Returned",
      icon: ICONS.Returned,
      time: formatTime(historyMap.get("Returned")),
      state: "terminal",
      color: DANGER,
      connectorFilled: false,
      isLast: true,
    });
    return steps;
  }

  if (isCancelled) {
    // Show whatever was reached, then a Cancelled terminal node.
    for (let i = 0; i <= reachedIndex; i++) {
      const label = FLOW[i];
      steps.push({
        key: label,
        label,
        icon: ICONS[label],
        time: formatTime(historyMap.get(label)),
        state: "done",
        color: DONE,
        connectorFilled: true,
        isLast: false,
      });
    }
    steps.push({
      key: "Cancelled",
      label: "Cancelled",
      icon: ICONS.Cancelled,
      time: formatTime(historyMap.get("Cancelled")),
      state: "terminal",
      color: DANGER,
      connectorFilled: false,
      isLast: true,
    });
    return steps;
  }

  // Normal flow.
  FLOW.forEach((label, i) => {
    let state: StepState;
    if (i < reachedIndex) state = "done";
    else if (i === reachedIndex) state = "current";
    else state = "todo";

    const isDelivered = label === "Delivered" && state !== "todo";
    steps.push({
      key: label,
      label,
      icon: ICONS[label],
      time: formatTime(historyMap.get(label)),
      state,
      color:
        state === "todo" ? TODO : isDelivered ? SUCCESS : state === "current" ? ACTIVE : DONE,
      connectorFilled: i < reachedIndex,
      isLast: i === FLOW.length - 1,
    });
  });

  return steps;
}

// ---- Row -------------------------------------------------------------------

function TimelineRow({ step, index }: { step: Step; index: number }) {
  const enter = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    enter.value = withDelay(
      index * 110,
      withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) })
    );
    if (step.state === "current") {
      pulse.value = withDelay(
        index * 110 + 300,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 900, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        )
      );
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ scale: 0.5 + enter.value * 0.5 }],
  }));

  const haloStyle = useAnimatedStyle(() => ({
    opacity: pulse.value * 0.35,
    transform: [{ scale: 1 + pulse.value * 0.6 }],
  }));

  const connectorStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: enter.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ translateX: (1 - enter.value) * 8 }],
  }));

  const isMuted = step.state === "todo";

  return (
    <View style={styles.row}>
      {/* Left rail: dot + connector */}
      <View style={styles.rail}>
        {step.state === "current" && (
          <Animated.View
            style={[
              styles.halo,
              { backgroundColor: step.color },
              haloStyle,
            ]}
          />
        )}
        <Animated.View
          style={[
            styles.dot,
            {
              backgroundColor: isMuted ? "#fff" : step.color,
              borderColor: step.color,
            },
            dotStyle,
          ]}
        >
          <Ionicons
            name={step.icon}
            size={16}
            color={isMuted ? TODO : "#fff"}
          />
        </Animated.View>

        {!step.isLast && (
          <View style={styles.connectorTrack}>
            <Animated.View
              style={[
                styles.connectorFill,
                {
                  backgroundColor: step.connectorFilled ? DONE : TODO,
                },
                connectorStyle,
              ]}
            />
          </View>
        )}
      </View>

      {/* Right: label + time */}
      <Animated.View style={[styles.labelWrap, textStyle]}>
        <Text
          style={[
            styles.label,
            isMuted && styles.labelMuted,
            step.state === "current" && styles.labelActive,
            step.state === "terminal" && { color: step.color },
          ]}
        >
          {step.label}
        </Text>
        {step.time ? (
          <Text style={styles.time}>{step.time}</Text>
        ) : step.state === "current" ? (
          <Text style={styles.time}>In progress</Text>
        ) : null}
      </Animated.View>
    </View>
  );
}

// ---- Main ------------------------------------------------------------------

export default function OrderStatusTimeline({
  currentStatus,
  statusHistory,
}: Props) {
  const steps = buildSteps(currentStatus, statusHistory);

  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <TimelineRow key={step.key} step={step} index={index} />
      ))}
    </View>
  );
}

const DOT = 34;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  row: {
    flexDirection: "row",
  },
  rail: {
    width: DOT,
    alignItems: "center",
  },
  halo: {
    position: "absolute",
    top: 0,
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  connectorTrack: {
    flex: 1,
    minHeight: 26,
    width: 3,
    borderRadius: 2,
    marginVertical: 2,
    backgroundColor: "#F1ECFA",
    overflow: "hidden",
  },
  connectorFill: {
    flex: 1,
    width: 3,
    borderRadius: 2,
    // animate the fill growing downward from the dot
    transformOrigin: "top",
  },
  labelWrap: {
    flex: 1,
    paddingLeft: 14,
    paddingBottom: 22,
    paddingTop: 5,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  labelActive: {
    color: colors.tint,
    fontWeight: "800",
  },
  labelMuted: {
    color: "#9CA3AF",
    fontWeight: "600",
  },
  time: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
    fontWeight: "500",
  },
});
