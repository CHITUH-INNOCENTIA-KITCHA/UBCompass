import { ScrollView, StyleSheet } from 'react-native';
import { Button, Chip, List, Portal, SegmentedButtons, Snackbar, Surface, Switch, Text } from 'react-native-paper';
import { useState } from 'react';

import { Colors } from '@/constants/theme';
import { useAppStore, type MapStyle } from '@/store/app-store';

export default function SettingsScreen() {
  const {
    accessibilityMode,
    setAccessibilityMode,
    showBuildingLabels,
    setShowBuildingLabels,
    autoCenterOnLocation,
    setAutoCenterOnLocation,
    mapStyle,
    setMapStyle,
    recentSearches,
    clearRecentSearches,
  } = useAppStore();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleAccessibilityToggle = (value: boolean) => {
    setAccessibilityMode(value);
    setSnackbarMessage(
      value
        ? 'Accessibility mode enabled - Routes will avoid stairs'
        : 'Accessibility mode disabled'
    );
    setSnackbarVisible(true);
  };

  const handleShowLabelsToggle = (value: boolean) => {
    setShowBuildingLabels(value);
    setSnackbarMessage(value ? 'Building labels will be shown' : 'Building labels hidden');
    setSnackbarVisible(true);
  };

  const handleAutoCenterToggle = (value: boolean) => {
    setAutoCenterOnLocation(value);
    setSnackbarMessage(
      value
        ? 'Map will auto-center on your location'
        : 'Auto-center disabled'
    );
    setSnackbarVisible(true);
  };

  const handleMapStyleChange = (value: string) => {
    setMapStyle(value as MapStyle);
    const styleNames: Record<string, string> = {
      standard: 'Standard',
      satellite: 'Satellite',
      highContrast: 'High Contrast',
    };
    setSnackbarMessage(`Map style set to ${styleNames[value]}`);
    setSnackbarVisible(true);
  };

  const handleClearSearches = () => {
    clearRecentSearches();
    setSnackbarMessage('Search history cleared');
    setSnackbarVisible(true);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        Preferences
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Customize your UBCompass navigation experience.
      </Text>

      <Surface style={styles.sectionCard} elevation={1}>
        <Text variant="titleMedium">Navigation Preferences</Text>
        <List.Item
          title="Accessibility Mode"
          description="Avoid stairs and prefer ramps for easier routes."
          right={() => (
            <Switch
              value={accessibilityMode}
              onValueChange={handleAccessibilityToggle}
            />
          )}
        />
        <List.Item
          title="Show Building Labels"
          description="Display building names on the outdoor map."
          right={() => (
            <Switch
              value={showBuildingLabels}
              onValueChange={handleShowLabelsToggle}
            />
          )}
        />
        <List.Item
          title="Auto-center on Location"
          description="Keep the map centered on your current position."
          right={() => (
            <Switch
              value={autoCenterOnLocation}
              onValueChange={handleAutoCenterToggle}
            />
          )}
        />
        {accessibilityMode && (
          <Chip icon="wheelchair-accessibility" style={styles.statusChip}>
            Accessibility mode is active
          </Chip>
        )}
      </Surface>

      <Surface style={styles.sectionCard} elevation={1}>
        <Text variant="titleMedium">Map Style</Text>
        <Text variant="bodyMedium" style={styles.helperText}>
          Choose how the outdoor campus map appears.
        </Text>
        <SegmentedButtons
          value={mapStyle}
          onValueChange={handleMapStyleChange}
          buttons={[
            { value: 'standard', label: 'Standard' },
            { value: 'satellite', label: 'Satellite' },
            { value: 'highContrast', label: 'High Contrast' },
          ]}
        />
      </Surface>

      <Surface style={styles.sectionCard} elevation={1}>
        <Text variant="titleMedium">Search History</Text>
        <Text variant="bodyMedium" style={styles.helperText}>
          {recentSearches.length > 0
            ? `You have ${recentSearches.length} recent search${recentSearches.length === 1 ? '' : 'es'}.`
            : 'No recent searches yet.'}
        </Text>
        {recentSearches.length > 0 && (
          <>
            <Surface style={styles.recentSearches} elevation={0}>
              {recentSearches.map((search, index) => (
                <Chip key={`${search}-${index}`} compact icon="history">
                  {search}
                </Chip>
              ))}
            </Surface>
            <Button
              mode="outlined"
              icon="delete-outline"
              onPress={handleClearSearches}
              style={styles.clearButton}>
              Clear Search History
            </Button>
          </>
        )}
      </Surface>

      <Surface style={styles.sectionCard} elevation={1}>
        <Text variant="titleMedium">About UBCompass</Text>
        <List.Item
          title="Version"
          description="v1.0.0 (Phase 3, 5, 6 Complete)"
          left={() => <List.Icon icon="tag-outline" />}
        />
        <List.Item
          title="Institution"
          description="University of Buea, Cameroon"
          left={() => <List.Icon icon="school-outline" />}
        />
        <List.Item
          title="Supervisor"
          description="Dr. Mougnol Romeo"
          left={() => <List.Icon icon="account-tie-outline" />}
        />
        <List.Item
          title="Team"
          description="Group 5"
          left={() => <List.Icon icon="account-group-outline" />}
        />
        <List.Item
          title="Tech Stack"
          description="React Native, Expo, Supabase, OpenStreetMap"
          left={() => <List.Icon icon="code-braces" />}
        />
      </Surface>

      <Surface style={styles.sectionCard} elevation={1}>
        <Text variant="titleMedium">Features Status</Text>
        <List.Item
          title="Outdoor Navigation"
          description="GPS tracking, OSRM routing, building markers"
          left={() => <List.Icon icon="check-circle" color={Colors.brand.primary} />}
        />
        <List.Item
          title="Indoor Navigation"
          description="SVG floor plans, Dijkstra pathfinding"
          left={() => <List.Icon icon="check-circle" color={Colors.brand.primary} />}
        />
        <List.Item
          title="Accessibility Routing"
          description="Stairs avoidance, ramp-aware navigation"
          left={() => <List.Icon icon="check-circle" color={Colors.brand.primary} />}
        />
        <List.Item
          title="Settings Persistence"
          description="Preferences saved in memory (session only)"
          left={() => <List.Icon icon="clock-outline" color={Colors.brand.textMuted} />}
        />
      </Surface>

      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
          action={{
            label: 'OK',
            onPress: () => setSnackbarVisible(false),
          }}>
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.brand.background,
  },
  content: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 120,
    gap: 18,
  },
  title: {
    color: Colors.brand.primaryDark,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.brand.textMuted,
    lineHeight: 24,
  },
  sectionCard: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  helperText: {
    color: Colors.brand.textMuted,
    lineHeight: 20,
  },
  statusChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    marginTop: 8,
  },
  recentSearches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
  },
  clearButton: {
    alignSelf: 'flex-start',
  },
});
