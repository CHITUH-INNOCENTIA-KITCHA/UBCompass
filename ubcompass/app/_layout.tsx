import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { LaunchScreen } from '@/components/launch-screen';
import { UBTheme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useBuildingsStore } from '@/store/use-buildings-store';
import { useImagesStore } from '@/store/use-images-store';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);
  const { fetchBuildings } = useBuildingsStore();
  const { fetchImages } = useImagesStore();

  useEffect(() => {
    // Initialize data stores
    fetchBuildings();
    fetchImages();

    const timeout = setTimeout(() => {
      setShowLaunchScreen(false);
    }, 1800);

    return () => clearTimeout(timeout);
  }, [fetchBuildings, fetchImages]);

  if (showLaunchScreen) {
    return (
      <>
        <LaunchScreen />
        <StatusBar style="light" />
      </>
    );
  }

  return (
    <PaperProvider theme={UBTheme}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="building/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="directions/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </PaperProvider>
  );
}
