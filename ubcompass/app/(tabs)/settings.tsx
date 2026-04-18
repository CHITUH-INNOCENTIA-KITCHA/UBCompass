import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { List, SegmentedButtons, Surface, Switch, Text } from 'react-native-paper';

import { Colors } from '@/constants/theme';

export default function SettingsScreen() {
  const [accessibilityMode, setAccessibilityMode] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [autoCenter, setAutoCenter] = useState(false);
  const [mapStyle, setMapStyle] = useState('standard');

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        Preferences
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Shape the UBCompass experience while the backend and live navigation layer are still ahead.
      </Text>

      <Surface style={styles.sectionCard} elevation={1}>
        <Text variant="titleMedium">Navigation Preferences</Text>
        <List.Item
          title="Accessibility Mode"
          description="Avoid stairs and prefer easier routes where possible."
          right={() => <Switch value={accessibilityMode} onValueChange={setAccessibilityMode} />}
        />
        <List.Item
          title="Show Building Labels"
          description="Keep key locations visible on the outdoor map."
          right={() => <Switch value={showLabels} onValueChange={setShowLabels} />}
        />
        <List.Item
          title="Auto-center on Location"
          description="Snap the map back to your current position."
          right={() => <Switch value={autoCenter} onValueChange={setAutoCenter} />}
        />
      </Surface>

      <Surface style={styles.sectionCard} elevation={1}>
        <Text variant="titleMedium">Map Style</Text>
        <SegmentedButtons
          value={mapStyle}
          onValueChange={setMapStyle}
          buttons={[
            { value: 'standard', label: 'Standard' },
            { value: 'satellite', label: 'Satellite' },
            { value: 'contrast', label: 'High Contrast' },
          ]}
        />
      </Surface>

      <Surface style={styles.sectionCard} elevation={1}>
        <Text variant="titleMedium">About UBCompass</Text>
        <List.Item title="Version" description="Frontend prototype v0.1" left={() => <List.Icon icon="tag-outline" />} />
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
      </Surface>
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
    paddingTop: 32,
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
});
