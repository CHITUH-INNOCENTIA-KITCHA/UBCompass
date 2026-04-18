import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Card, Chip, Divider, Surface, Text } from 'react-native-paper';

import { campusBuildings } from '@/constants/mock-campus-data';
import { Colors } from '@/constants/theme';

export default function BuildingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const building = campusBuildings.find((item) => item.id === id) ?? campusBuildings[0];

  return (
    <View style={styles.screen}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Building Details" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.heroCard}>
          <Card.Cover source={{ uri: building.image }} />
          <Card.Content style={styles.heroContent}>
            <View style={styles.titleRow}>
              <View style={styles.titleCopy}>
                <Text variant="headlineSmall">{building.name}</Text>
                <Text variant="bodyMedium" style={styles.mutedText}>
                  {building.shortName} · {building.openingHours}
                </Text>
              </View>
              <Chip>{building.category}</Chip>
            </View>
            <Text variant="bodyLarge" style={styles.description}>
              {building.description}
            </Text>
          </Card.Content>
        </Card>

        <Surface style={styles.sectionCard} elevation={1}>
          <Text variant="titleMedium">Quick Facts</Text>
          <View style={styles.factRow}>
            <MaterialCommunityIcons name="office-building-outline" size={20} color={Colors.brand.primary} />
            <Text variant="bodyMedium">{building.floors} floors</Text>
          </View>
          <View style={styles.factRow}>
            <MaterialCommunityIcons
              name={building.accessibleEntrance ? 'wheelchair-accessibility' : 'stairs'}
              size={20}
              color={Colors.brand.primary}
            />
            <Text variant="bodyMedium">
              {building.accessibleEntrance ? 'Accessible entrance available' : 'Standard entrance access'}
            </Text>
          </View>
          <View style={styles.factRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={20} color={Colors.brand.primary} />
            <Text variant="bodyMedium">
              {building.latitude}, {building.longitude}
            </Text>
          </View>
        </Surface>

        <Surface style={styles.sectionCard} elevation={1}>
          <Text variant="titleMedium">Nearby</Text>
          <View style={styles.chipWrap}>
            {building.nearby.map((place) => (
              <Chip key={place} style={styles.nearbyChip}>
                {place}
              </Chip>
            ))}
          </View>
          <Divider />
          <Text variant="titleMedium">Highlights</Text>
          <View style={styles.chipWrap}>
            {building.highlights.map((item) => (
              <Chip key={item} style={styles.highlightChip}>
                {item}
              </Chip>
            ))}
          </View>
        </Surface>

        <View style={styles.actionRow}>
          <Button mode="outlined" onPress={() => router.push('/(tabs)/index')}>
            Get Directions
          </Button>
          <Button
            mode="contained"
            onPress={() => router.push('/(tabs)/indoor')}
            disabled={!building.hasIndoorMap}>
            View Indoor Map
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.brand.background,
  },
  appbar: {
    backgroundColor: Colors.brand.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 18,
  },
  heroCard: {
    overflow: 'hidden',
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  heroContent: {
    paddingTop: 16,
    gap: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  titleCopy: {
    flex: 1,
    gap: 4,
  },
  mutedText: {
    color: Colors.brand.textMuted,
  },
  description: {
    color: Colors.brand.text,
    lineHeight: 24,
  },
  sectionCard: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: '#FFFFFF',
    gap: 14,
  },
  factRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  nearbyChip: {
    backgroundColor: '#EEF6EA',
  },
  highlightChip: {
    backgroundColor: '#FFF2CE',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});
