# Copilot Build Prompt: University of Buea Campus Navigation Mobile App

> **Stack:** React Native · Expo · Supabase · OpenStreetMap · React Native Paper (Material Design 3)  
> **Target Platforms:** Android & iOS  
> **Case Study Campus:** University of Buea, Cameroon
> **Project Name:** UBCompass

---

## CONTEXT (Read Before Every Phase)

You are building a cross-platform mobile campus navigation app for the **University of Buea (UB), Cameroon**. The app must help students, staff, and visitors navigate both outdoor campus paths and indoor building layouts. It uses **React Native with Expo** as the development framework, **Supabase** as the backend, **OpenStreetMap (OSM)** for outdoor maps, **SVG-based floor plans** for indoor maps, and **React Native Paper** for all UI components following **Material Design 3** guidelines.

The app must support:
- Outdoor navigation across the UB campus (main gate, Faculty of Science, Faculty of Engineering and Technology, Faculty of Social and Management Sciences, Faculty of Arts, Faculty of Health Sciences, Admin Block, Library, Student Union, Sports Complex, etc.)
- Indoor floor-plan navigation for key buildings
- Real-time GPS location tracking ("blue dot")
- Accessible route options (wheelchair/ramp-only paths)
- Search for buildings, rooms, and facilities
- Supabase-powered data for buildings, rooms, and events

---

## PHASE 1 — Project Initialization & Folder Structure

### Goal
Scaffold the Expo + React Native project with a clean, scalable folder structure and install all required dependencies.

### Instructions

1. **Initialize the project** using Expo with the following command:
   ```bash
   npx create-expo-app@latest UBCampusNav --template blank-typescript
   cd UBCampusNav
   ```

2. **Install all required dependencies:**
   ```bash
   # Navigation
   npx expo install expo-router react-native-safe-area-context react-native-screens

   # Maps & Location
   npx expo install react-native-maps expo-location

   # UI - Material Design 3
   npm install react-native-paper react-native-vector-icons

   # SVG (for indoor floor plans)
   npx expo install react-native-svg

   # supabase
   npm install supabase

   # State Management
   npm install zustand

   # Utilities
   npm install axios
   ```

3. **Configure `app.json`** to enable Expo Router, set app name to `"UB Campus Navigator"`, package name to `com.ubcampus.navigator`, and add location permissions:
   ```json
   {
     "expo": {
       "name": "UBCompass",
       "slug": "ubcompass",
       "scheme": "ubcampusnav",
       "plugins": [
         "expo-router",
         [
           "expo-location",
           {
             "locationAlwaysAndWhenInUsePermission": "Allow UB Campus Navigator to use your location for navigation."
           }
         ]
       ]
     }
   }
   ```

4. **Create the following folder structure** exactly:
   ```
   UBCampusNav/
   ├── app/                        # Expo Router screens (file-based routing)
   │   ├── (tabs)/
   │   │   ├── index.tsx           # Home / Map screen
   │   │   ├── search.tsx          # Search screen
   │   │   ├── indoor.tsx          # Indoor navigation screen
   │   │   └── settings.tsx        # Settings & accessibility screen
   │   ├── building/
   │   │   └── [id].tsx            # Dynamic building detail screen
   │   └── _layout.tsx             # Root layout with Tab navigator
   ├── components/
   │   ├── map/
   │   │   ├── OutdoorMap.tsx      # Main OSM map component
   │   │   ├── UserLocationDot.tsx # Blue dot marker
   │   │   ├── BuildingMarker.tsx  # Custom map marker for buildings
   │   │   └── RoutePolyline.tsx   # Route path on map
   │   ├── indoor/
   │   │   ├── FloorPlan.tsx       # SVG floor plan renderer
   │   │   ├── FloorSelector.tsx   # Floor switcher component
   │   │   └── RoomLabel.tsx       # Room label overlay
   │   ├── search/
   │   │   ├── SearchBar.tsx       # Material Design search bar
   │   │   └── SearchResults.tsx   # Results list
   │   └── ui/
   │       ├── AppHeader.tsx       # Top app bar
   │       ├── BottomSheet.tsx     # Building info bottom sheet
   │       └── AccessibilityToggle.tsx
   ├── constants/
   │   ├── ubCampusData.ts         # Static building coordinates & metadata
   │   ├── theme.ts                # Material Design 3 theme tokens
   │   └── mapConfig.ts            # OSM tile URLs, default map region
   ├── supabase/
   │   ├── config.ts               # Supabase initialization
   │   ├── buildings.ts            # PostgreSQL CRUD for buildings
   │   ├── rooms.ts                # PostgreSQL CRUD for rooms
   │   └── events.ts               # PostgreSQL CRUD for campus events
   ├── hooks/
   │   ├── useLocation.ts          # GPS location hook
   │   ├── useBuildings.ts         # Fetch buildings from PostgreSQL
   │   └── useRouting.ts           # Pathfinding logic hook
   ├── store/
   │   └── appStore.ts             # Zustand global state
   ├── utils/
   │   ├── pathfinding.ts          # Dijkstra's algorithm for indoor routing
   │   ├── distanceCalculator.ts   # Haversine formula for outdoor distances
   │   └── osmRouting.ts           # OSRM API calls for outdoor routing
   └── assets/
       ├── floorplans/             # SVG floor plan files per building
       └── icons/                  # Custom map icons
   ```

5. **Create `constants/theme.ts`** with a Material Design 3 theme using UB's colors (green and white):
   ```typescript
   import { MD3LightTheme, configureFonts } from 'react-native-paper';

   export const UBTheme = {
     ...MD3LightTheme,
     colors: {
       ...MD3LightTheme.colors,
       primary: '#006400',         // UB Dark Green
       primaryContainer: '#A8D5A2',
       secondary: '#4CAF50',
       background: '#F6FBF4',
       surface: '#FFFFFF',
       onPrimary: '#FFFFFF',
       onBackground: '#1A1A1A',
     },
   };
   ```

---

## PHASE 2 — Supabase Setup & Data Modeling

### Goal
Configure Supabase backend with PostgreSQL collections representing the UB campus data model.

### Instructions

1. **Create a Supabase project** at https://supabase.com named `ub-campus-nav`. Enable **PostgreSQL**, **Authentication (Anonymous)**, and **Storage**.

2. **Create `supabase/config.ts`** with Supabase initialization:
   ```typescript
   import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
   const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```

3. **Define the PostgreSQL database schema** with the following tables:

   **Table: `buildings`**
   ```sql
   CREATE TABLE buildings (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name VARCHAR(255) NOT NULL,
     short_name VARCHAR(50),
     description TEXT,
     latitude DECIMAL(10, 8) NOT NULL,
     longitude DECIMAL(11, 8) NOT NULL,
     floors INTEGER,
     has_indoor_map BOOLEAN DEFAULT FALSE,
     category VARCHAR(50) NOT NULL, -- 'faculty' | 'admin' | 'facility' | 'hostel'
     image_url TEXT,
     accessible_entrance BOOLEAN DEFAULT FALSE,
     opening_hours VARCHAR(255),
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

   **Table: `rooms`**
   ```sql
   CREATE TABLE rooms (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
     name VARCHAR(255) NOT NULL,
     room_number VARCHAR(50),
     floor INTEGER NOT NULL,
     type VARCHAR(50), -- 'lecture_hall' | 'lab' | 'office' | 'toilet' | 'stairs' | 'ramp'
     node_x INTEGER,
     node_y INTEGER,
     accessible BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

   **Table: `indoor_graph`**
   ```sql
   CREATE TABLE indoor_graph (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
     room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
     node_x INTEGER NOT NULL,
     node_y INTEGER NOT NULL,
     floor INTEGER NOT NULL,
     is_stairs BOOLEAN DEFAULT FALSE,
     is_ramp BOOLEAN DEFAULT FALSE,
     connections TEXT[], -- Array of connected node IDs
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

   **Table: `events`**
   ```sql
   CREATE TABLE events (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     title VARCHAR(255) NOT NULL,
     building_id UUID REFERENCES buildings(id) ON DELETE SET NULL,
     room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
     event_date TIMESTAMP NOT NULL,
     description TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```
   ├── date: timestamp
   └── description: string
   ```

4. **Seed PostgreSQL** with the following real UB campus buildings (create a script `supabase/seedData.ts`):
   | Building | Latitude | Longitude | Category |
   |---|---|---|---|
   | Main Gate | 4.1537 | 9.2837 | facility |
   | Faculty of Science (FOS) | 4.1549 | 9.2841 | faculty |
   | Faculty of Engineering & Technology (FET) | 4.1558 | 9.2853 | faculty |
   | Faculty of Social & Management Sciences (FSMS) | 4.1543 | 9.2862 | faculty |
   | Faculty of Arts (FA) | 4.1535 | 9.2870 | faculty |
   | Faculty of Health Sciences (FHS) | 4.1562 | 9.2845 | faculty |
   | Administration Block | 4.1540 | 9.2855 | admin |
   | University Library | 4.1545 | 9.2860 | facility |
   | Student Union Building (SUB) | 4.1531 | 9.2848 | facility |
   | Sports Complex | 4.1520 | 9.2840 | facility |
   | Amphitheatre | 4.1538 | 9.2843 | facility |

5. **Create `supabase/buildings.ts`** with the following PostgreSQL utility functions:
   - `getAllBuildings()` — fetches all documents from the `buildings` collection
   - `getBuildingById(id: string)` — fetches a single building document
   - `getRoomsByBuilding(buildingId: string)` — queries rooms by buildingId
   - `searchBuildings(query: string)` — case-insensitive name search
   - `getIndoorGraph(buildingId: string)` — fetches indoor node graph for pathfinding

---

## PHASE 3 — Outdoor Map Screen (Home Tab)

### Goal
Build the main outdoor map screen showing the UB campus using OpenStreetMap tiles, building markers, and the user's live GPS location.

### Instructions

1. **Create `constants/mapConfig.ts`** with the default UB campus map region and OSM tile URL:
   ```typescript
   export const UB_CAMPUS_REGION = {
     latitude: 4.1545,
     longitude: 9.2855,
     latitudeDelta: 0.008,
     longitudeDelta: 0.008,
   };

   export const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
   ```

2. **Create `hooks/useLocation.ts`** using `expo-location`:
   - Request `foregroundPermissionsAsync` on mount
   - Subscribe to `watchPositionAsync` with `Accuracy.High` for continuous updates
   - Return `{ location, errorMsg, isLoading }` — where `location` is `{ latitude, longitude }`
   - Handle permission denied gracefully by showing a Material Design `Snackbar` with a message: *"Location permission denied. Enable it in Settings for navigation."*

3. **Create `components/map/OutdoorMap.tsx`**:
   - Use `MapView` from `react-native-maps` with `mapType="none"` (to disable default Google tiles)
   - Add a `UrlTile` component pointing to `OSM_TILE_URL` for OpenStreetMap rendering
   - Accept props: `buildings: Building[]`, `userLocation`, `selectedBuilding`, `onBuildingPress`
   - Render a `BuildingMarker` for each building
   - Render the user's blue dot as a `Circle` and a `Marker` using `UserLocationDot`
   - Show the route polyline using `Polyline` from react-native-maps when a route is active

4. **Create `components/map/BuildingMarker.tsx`**:
   - Use a `Marker` from react-native-maps
   - Display a Material Design `Card` styled callout when pressed
   - Show building name, category badge (colored chip), and a "Navigate" button
   - Color-code markers: faculty = green, admin = blue, facility = orange

5. **Create `components/ui/BottomSheet.tsx`**:
   - A slide-up panel (use `Animated.View` from React Native) that appears when a building is selected
   - Display: building image, name, description, opening hours, floor count
   - Two action buttons using React Native Paper `Button` component:
     - **"Get Directions"** → triggers outdoor routing to this building
     - **"View Indoor Map"** → navigates to the Indoor tab if `hasIndoorMap` is true, otherwise shows a Snackbar: *"Indoor map not yet available for this building."*
   - An accessibility badge if `accessibleEntrance` is true

6. **Create `app/(tabs)/index.tsx`** (Home/Map screen):
   - Render `OutdoorMap` filling the full screen
   - Place a floating `Searchbar` (React Native Paper) at the top with elevation
   - Place a FAB (Floating Action Button) at the bottom-right: "My Location" — re-centers map on user
   - Place a second FAB above it: "Accessibility Mode" toggle — when ON, routes will avoid stairs
   - When a building marker is pressed, animate the `BottomSheet` up
   - Connect to Zustand store for selected building and accessibility mode state

7. **Create `utils/osmRouting.ts`**:
   - Call the **OSRM demo API**: `https://router.project-osrm.org/route/v1/foot/{lon1},{lat1};{lon2},{lat2}?overview=full&geometries=geojson`
   - Parse the response to extract the route geometry as an array of `{ latitude, longitude }` coordinates
   - Return the coordinates array for rendering as a `Polyline` on the map
   - Show a React Native Paper `ActivityIndicator` while route is loading

---

## PHASE 4 — Search Screen

### Goal
Build a dedicated search screen that lets users find buildings, rooms, and facilities by name, with instant results and navigation shortcuts.

### Instructions

1. **Create `app/(tabs)/search.tsx`**:
   - Full-screen search experience using React Native Paper `Searchbar` at the top (autofocused)
   - Below the search bar, show two sections:
     - **"Recent Searches"** — stored in Zustand, max 5 items, rendered as `List.Item` rows with a history icon
     - **"All Buildings"** — a flat list of all buildings fetched from PostgreSQL on screen mount
   - When the user types, filter results in real-time (client-side) by building name and room name
   - Each result row uses `List.Item` with:
     - Left: a `MaterialCommunityIcons` icon based on category (school, office-building, hospital, etc.)
     - Title: building/room name
     - Description: category label or floor number for rooms
     - Right: a `>` chevron
   - Tapping a building result navigates to `app/building/[id].tsx`
   - Tapping a room result navigates to the Indoor screen with that building and room pre-selected

2. **Create `app/building/[id].tsx`** — Building Detail Screen:
   - Full-screen layout with a hero image at the top (from Supabase Storage URL)
   - Below the image, a scrollable content area with:
     - Building name as `Text` variant `headlineMedium`
     - Category chip
     - Description paragraph
     - Opening hours row with a clock icon
     - Accessibility status badge
     - A **"Rooms in this building"** section — a list of rooms fetched by `getRoomsByBuilding(id)`
     - Two primary buttons at the bottom: **"Get Directions"** and **"View Indoor Map"**

3. **Create `hooks/useBuildings.ts`**:
   - On mount, call `getAllBuildings()` from Supabase
   - Provide a `searchQuery` state and a filtered `results` array
   - Cache results in Zustand store to avoid redundant PostgreSQL reads
   - Return `{ buildings, results, searchQuery, setSearchQuery, isLoading, error }`

---

## PHASE 5 — Indoor Navigation Screen

### Goal
Build the indoor navigation feature with SVG-based floor plans for key UB buildings, room-level pathfinding, and floor switching.

### Instructions

1. **Create the SVG floor plan structure** for the `Faculty of Science` building as the first implementation. Create `assets/floorplans/fos_floor1.svg` with:
   - Outer building boundary as a rectangle
   - Individual rooms as labeled rectangles with unique `id` attributes matching `roomId` in PostgreSQL
   - Corridors as open spaces between rooms
   - Stairs and ramp locations marked with icons
   - Use UB green (`#006400`) for walls and light grey (`#F5F5F5`) for room fills
   - Room labels as SVG `<text>` elements

2. **Create `components/indoor/FloorPlan.tsx`**:
   - Render the SVG floor plan using `react-native-svg` with `SvgXml` or `SvgUri`
   - Wrap in a `react-native-gesture-handler` `PinchGestureHandler` and `PanGestureHandler` for zoom and pan
   - Highlight the **origin room** in light blue and the **destination room** in green
   - Draw the indoor route as an SVG `<Path>` element in orange
   - When a room is tapped, call `onRoomPress(roomId)` prop

3. **Create `components/indoor/FloorSelector.tsx`**:
   - A horizontal row of React Native Paper `SegmentedButtons` for floor selection (e.g., "G", "1", "2")
   - Emits the selected floor number via `onFloorChange(floor: number)` prop

4. **Create `utils/pathfinding.ts`** — Dijkstra's Algorithm:
   ```typescript
   // Implement Dijkstra's shortest path algorithm
   // Input: graph (adjacency list of nodes from PostgreSQL indoorGraph collection), 
   //        startNodeId: string, endNodeId: string, accessibilityMode: boolean
   // When accessibilityMode is true: filter out all edges where node.isStairs === true
   // Output: ordered array of node IDs representing the shortest path
   // Use Euclidean distance between (x, y) coordinates as edge weights
   export function findShortestPath(
     graph: IndoorGraph,
     startNodeId: string,
     endNodeId: string,
     accessibilityMode: boolean
   ): string[]
   ```

5. **Create `app/(tabs)/indoor.tsx`** — Indoor Navigation Screen:
   - Top: React Native Paper `Appbar.Header` with title "Indoor Navigation"
   - Below header: a building selector `Menu` dropdown (React Native Paper) listing only buildings where `hasIndoorMap === true`
   - Below that: `FloorSelector` component
   - Main area: `FloorPlan` component filling remaining height
   - Bottom sheet (always visible, 120px tall): Two `TextInput` (Material Design outlined style) for "From Room" and "To Room", and a "Find Route" `Button`
   - When "Find Route" is pressed:
     1. Fetch `indoorGraph` for the selected building from PostgreSQL
     2. Run `findShortestPath()` from utils
     3. Convert the returned node path to SVG coordinates
     4. Pass the path to `FloorPlan` for rendering
   - If the route crosses floors, show a `Snackbar`: *"Route includes floor change via [stairs/ramp] at node X"*

---

## PHASE 6 — Settings & Accessibility Screen

### Goal
Build the settings screen where users can toggle accessibility mode, choose map style, and view app information.

### Instructions

1. **Create `app/(tabs)/settings.tsx`**:
   - Use a `ScrollView` with React Native Paper `List.Section` components
   - **Section 1: Navigation Preferences**
     - `List.Item` with a `Switch` (React Native Paper): "Accessibility Mode" — avoids stairs in all routing
     - `List.Item` with a `Switch`: "Show Building Labels on Map"
     - `List.Item` with a `Switch`: "Auto-center on Location"
   - **Section 2: Map Style**
     - `SegmentedButtons` with options: "Standard", "Satellite", "High Contrast"
     - Standard = OSM tiles, Satellite = toggle `mapType="satellite"` on MapView, High Contrast = OSM with high-contrast tile server
   - **Section 3: About**
     - App version, university name, supervisor credit (Dr. Mougnol Romeo), and Group 5 member names
     - A `Button` linking to a feedback form (placeholder URL)

2. **Create `store/appStore.ts`** using Zustand with the following global state:
   ```typescript
   interface AppState {
     accessibilityMode: boolean;
     showBuildingLabels: boolean;
     autoCenterOnLocation: boolean;
     mapStyle: 'standard' | 'satellite' | 'highContrast';
     selectedBuilding: Building | null;
     recentSearches: string[];
     activeRoute: LatLng[] | null;
     // Actions
     setAccessibilityMode: (val: boolean) => void;
     setSelectedBuilding: (b: Building | null) => void;
     addRecentSearch: (query: string) => void;
     setActiveRoute: (route: LatLng[] | null) => void;
   }
   ```

---

## PHASE 7 — Tab Navigator, App Shell & Polish

### Goal
Wire all screens together with bottom tab navigation, apply the Material Design 3 theme globally, and add final UX polish.

### Instructions

1. **Create `app/_layout.tsx`** — Root Layout:
   - Wrap the entire app in `PaperProvider` with the `UBTheme` from `constants/theme.ts`
   - Use Expo Router's `Tabs` component for the bottom navigation bar
   - Configure 4 tabs:
     | Tab | Screen | Icon (MaterialCommunityIcons) | Label |
     |---|---|---|---|
     | 1 | `(tabs)/index` | `map-search` | Map |
     | 2 | `(tabs)/search` | `magnify` | Search |
     | 3 | `(tabs)/indoor` | `floor-plan` | Indoor |
     | 4 | `(tabs)/settings` | `cog` | Settings |
   - Set `tabBarActiveTintColor` to `#006400` (UB green)
   - Set `tabBarStyle` with a white background and a subtle top shadow

2. **Add a splash screen** configured in `app.json`:
   - Background color: `#006400`
   - Use a centered UB logo (white version) as the splash image

3. **Add loading states** across all screens:
   - Use React Native Paper `ActivityIndicator` centered on screen while PostgreSQL data loads
   - Use React Native Paper `Snackbar` for all error messages (network errors, permission denied, route not found)

4. **Add empty states**:
   - Search screen with no results: centered illustration + text *"No buildings or rooms found. Try a different keyword."*
   - Indoor screen with no building selected: centered icon + text *"Select a building to view its floor plan."*

5. **Final App Bar setup** on all non-tab screens (e.g., `building/[id].tsx`):
   - Use `Appbar.Header` with a back button (`Appbar.BackAction`) and the screen title

---

## PHASE 8 — Testing & Deployment

### Goal
Test the app thoroughly, optimize performance, and prepare for deployment.

### Instructions

1. **Unit Tests** — use Jest + React Native Testing Library:
   - Test `pathfinding.ts`: verify Dijkstra returns correct shortest path given a mock graph
   - Test `distanceCalculator.ts`: verify Haversine distance between known coordinates
   - Test `osmRouting.ts`: mock the OSRM API and verify coordinate parsing

2. **Usability Testing Checklist**:
   - [ ] Can a new UB student find the FET building from the main gate in under 3 taps?
   - [ ] Does the blue dot update correctly when walking around campus?
   - [ ] Does accessibility mode remove stair paths in indoor routing?
   - [ ] Does the app work with no internet (graceful offline error messages)?
   - [ ] Is the map readable in bright outdoor sunlight (contrast check)?

3. **Performance Optimizations**:
   - Memoize `BuildingMarker` components with `React.memo` to prevent unnecessary re-renders on map pan
   - Lazy-load SVG floor plans only when the Indoor tab is active
   - Paginate PostgreSQL room queries (limit to 20 per fetch)
   - Use `FlatList` (not `ScrollView`) for all long lists

4. **Build for Android** (primary target for UB students):
   ```bash
   npx eas build --platform android --profile preview
   ```

5. **Build for iOS**:
   ```bash
   npx eas build --platform ios --profile preview
   ```

6. **Configure `eas.json`** with build profiles for `development`, `preview`, and `production`.

---

## NOTES FOR COPILOT

- Always use **TypeScript** (`.tsx` / `.ts`) for all files.
- Always use **React Native Paper** components — never raw `View`/`Text` styled from scratch for UI elements.
- Never use `StyleSheet.create` for colors — always pull from the `UBTheme` tokens.
- The app must work **offline for browsing** (cached PostgreSQL data) but requires internet for live routing.
- All coordinates in the app use the format `{ latitude: number, longitude: number }`.
- Treat every `TODO` comment as a signal to ask for clarification before implementing.
- When generating PostgreSQL queries, always handle the `loading`, `success`, and `error` states explicitly.
