import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { colors } from "@theme/color";

type Slide = {
  id: string;
  imageUrl: string;
  onPress?: () => void;
};

type Props = {
  slides: Slide[];
  height?: number; // default 160
  intervalMs?: number; // default 3000
  borderRadius?: number; // default 20
};

const { width: SCREEN_W } = Dimensions.get("window");

export default function PromoCarousel({
  slides,
  height = 200, // Increased height
  intervalMs = 3000,
  borderRadius = 16, // Slightly sharper radius
}: Props) {
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);
  const total = slides.length;

  // ensure we have at least 1 slide
  const data = useMemo(() => (total > 0 ? slides : []), [slides, total]);

  // Autoplay (only if more than 1 slide)
  useEffect(() => {
    if (total <= 1) return; // No autoplay for single slide
    const id = setInterval(() => {
      const next = (index + 1) % total;
      listRef.current?.scrollToIndex({ index: next, animated: true });
      setIndex(next);
    }, intervalMs);
    return () => clearInterval(id);
  }, [index, total, intervalMs]);

  // Keep index in sync with manual swipes
  const onMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const i = Math.round(x / SCREEN_W);
      if (i !== index) setIndex(i);
    },
    [index]
  );

  const keyExtractor = useCallback((item: Slide) => item.id, []);
  // Calculate item width for centering
  const ITEM_WIDTH = SCREEN_W;
  const CARD_WIDTH = SCREEN_W - 32; // 16px padding on each side (Wider)

  const renderItem = useCallback(
    ({ item }: { item: Slide }) => (
      <View
        style={{
          width: ITEM_WIDTH,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pressable
          onPress={item.onPress}
          style={{
            width: CARD_WIDTH,
            height,
            borderRadius,
            overflow: "hidden",
            // Enhanced Shadow / "Stand Out"
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "rgba(131, 102, 204, 0.2)", // Subtle primary stroke
            shadowColor: "#8366CC", // Primary colored shadow
            shadowOpacity: 0.15,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 8,
          }}
        >
          <Image
            source={{ uri: item.imageUrl }}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: colors.bg,
            }}
            contentFit="contain"
            transition={300}
          />
        </Pressable>
      </View>
    ),
    [borderRadius, height, CARD_WIDTH, ITEM_WIDTH]
  );

  if (data.length === 0) return null;

  return (
    <View>
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        // Important for nested vertical scroll: allow horizontal swipes to pass
        nestedScrollEnabled={false}
      />

      {/* Dots (only show if more than 1 slide) */}
      {total > 1 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          {data.map((_, i) => {
            const active = i === index;
            return (
              <View
                key={i}
                style={{
                  width: active ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  marginHorizontal: 4,
                  backgroundColor: active
                    ? colors.headerEnd
                    : "rgba(0,0,0,0.15)",
                }}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}
