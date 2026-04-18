import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Text } from 'react-native-paper';

import { Colors } from '@/constants/theme';

type TabIconName = 'map-search-outline' | 'magnify' | 'floor-plan' | 'cog-outline';

function getIconName(routeName: string): TabIconName {
  switch (routeName) {
    case 'index':
      return 'map-search-outline';
    case 'search':
      return 'magnify';
    case 'indoor':
      return 'floor-plan';
    case 'settings':
      return 'cog-outline';
    default:
      return 'map-search-outline';
  }
}

function AnimatedTabItem({
  label,
  icon,
  isFocused,
  onPress,
  onLongPress,
}: {
  label: string;
  icon: TabIconName;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const progress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(isFocused ? 1 : 0, {
      damping: 16,
      stiffness: 180,
      mass: 0.8,
    });
  }, [isFocused, progress]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ['rgba(255,255,255,0)', Colors.brand.primarySoft]
      ),
      transform: [
        {
          translateY: interpolate(progress.value, [0, 1], [0, -4]),
        },
        {
          scale: interpolate(progress.value, [0, 1], [1, 1.04]),
        },
      ],
      shadowOpacity: interpolate(progress.value, [0, 1], [0, 0.12]),
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(progress.value, [0, 1], [1, 1.12]),
        },
      ],
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 1], [0.7, 1]),
      transform: [
        {
          translateY: interpolate(progress.value, [0, 1], [2, 0]),
        },
      ],
    };
  });

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.pressable}>
      <Animated.View style={[styles.tabItem, containerStyle]}>
        <Animated.View style={iconStyle}>
          <MaterialCommunityIcons
            name={icon}
            size={22}
            color={isFocused ? Colors.brand.primary : '#6C806D'}
          />
        </Animated.View>
        <Animated.View style={labelStyle}>
          <Text
            variant="labelMedium"
            style={[styles.label, isFocused ? styles.labelFocused : styles.labelDefault]}>
            {label}
          </Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

export function AnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.title === 'string'
                ? options.title
                : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            if (Platform.OS === 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <AnimatedTabItem
              key={route.key}
              label={label}
              icon={getIconName(route.name)}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 28,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: '#143015',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  pressable: {
    flex: 1,
  },
  tabItem: {
    minHeight: 52,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: '#143015',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 18,
    elevation: 0,
  },
  label: {
    fontWeight: '700',
  },
  labelDefault: {
    color: '#6C806D',
  },
  labelFocused: {
    color: Colors.brand.primary,
  },
});
