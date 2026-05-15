# UBCompass - Campus Navigation Mobile Application
## Comprehensive System Documentation for Presentation

---

# 1. EXECUTIVE SUMMARY

## What is UBCompass?

**UBCompass** is a cross-platform mobile navigation application designed specifically for the **University of Buea (UB), Cameroon**. It serves as a digital campus guide that helps students, staff, and visitors navigate both outdoor campus grounds and indoor building layouts with ease.

### The Problem It Solves

- **New students** often struggle to locate faculties, lecture halls, and administrative offices
- **Visitors** have difficulty finding specific buildings on the large campus
- **Students with disabilities** need accessible routes that avoid stairs
- **No existing digital solution** provides comprehensive UB campus navigation
- **Indoor navigation** is virtually non-existent for campus buildings

### The Solution

UBCompass provides:
- Real-time GPS-based outdoor navigation across the entire UB campus
- Turn-by-turn walking directions between any two points
- Indoor floor plans with room-level navigation
- Accessibility-aware routing (wheelchair-friendly paths)
- Building and room search functionality
- Estimated walking time and distance calculations

---

# 2. TARGET AUDIENCE & USE CASES

## Primary Users

| User Type | Needs | How UBCompass Helps |
|-----------|-------|---------------------|
| **New Students** | Find classrooms, faculties, registration offices | Search for buildings, get walking directions |
| **Visitors** | Locate administrative buildings, meeting rooms | GPS-guided navigation from main gate |
| **Students with Disabilities** | Wheelchair-accessible routes | Accessibility mode avoids stairs, shows ramps |
| **Staff Members** | Find colleague offices, meeting rooms | Indoor navigation with room-level detail |
| **Event Attendees** | Locate event venues on campus | Building details with descriptions |

## Key Use Cases

### Use Case 1: First-Day Navigation
> A freshman arriving at UB for the first time needs to find the Faculty of Science (FOS) from the main gate. They open UBCompass, search for "Faculty of Science," tap "Get Directions," and follow the blue route line on the map while seeing their live GPS position as a blue dot.

### Use Case 2: Finding a Specific Room
> A student has a lecture in Room 205 of the Faculty of Engineering and Technology. They use the indoor navigation feature, select the building, choose Floor 2, and get step-by-step directions from the entrance to the exact room.

### Use Case 3: Accessible Route Planning
> A wheelchair user needs to reach the University Library. They enable "Accessibility Mode" in settings, which automatically calculates routes that only use ramps and avoid stairs both outdoors and indoors.

### Use Case 4: Campus Exploration
> A visiting parent wants to explore the campus. They browse all buildings on the map, tap on markers to see building details, photos, and opening hours.

---

# 3. SYSTEM ARCHITECTURE

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           UBCompass Mobile App                         │
│                     (React Native + Expo Framework)                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   Map Tab    │  │  Search Tab  │  │  Indoor Tab  │  │ Settings Tab│ │
│  │  (Outdoor    │  │  (Building   │  │  (Floor Plan │  │ (Preferences│ │
│  │  Navigation) │  │   Search)    │  │   & Routes)  │  │  & Access)  │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │
│         │                 │                 │                 │        │
│  ┌──────┴─────────────────┴─────────────────┴─────────────────┴──────┐ │
│  │                    State Management (Zustand)                     │ │
│  │         Global State: Accessibility, Routes, Preferences          │ │
│  └──────┬─────────────────┬─────────────────┬─────────────────┬──────┘ │
│         │                 │                 │                 │        │
└─────────┼─────────────────┼─────────────────┼─────────────────┼────────┘
          │                 │                 │                 │
          ▼                 ▼                 ▼                 ▼
┌─────────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│  Expo Location  │ │   Supabase    │ │  OSRM Routing │ │  OpenStreetMap│
│   (GPS API)     │ │  (Database)   │ │     (API)     │ │   (Map Tiles) │
│                 │ │               │ │               │ │               │
│ • Get user      │ │ • Buildings   │ │ • Walking     │ │ • Outdoor map │
│   position      │ │ • Rooms       │ │   routes      │ │   rendering   │
│ • Track         │ │ • Events      │ │ • Distance    │ │ • Tile server │
│   movement      │ │ • Indoor      │ │ • Duration    │ │               │
│                 │ │   graphs      │ │               │ │               │
└─────────────────┘ └───────────────┘ └───────────────┘ └───────────────┘
```

## Data Flow

```
User Action → React Component → Hook/Utility → External Service → State Update → UI Re-render

Example Flow (Get Directions):
1. User taps "Get Directions" to Faculty of Science
2. DirectionsScreen component triggered
3. useLocation hook provides current GPS coordinates
4. osmRouting utility calls OSRM API
5. Route coordinates returned and stored in state
6. MapView renders Polyline with route
7. ETA calculated using Haversine formula + walking speed
```

---

# 4. TECHNOLOGY STACK

## Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native** | 0.81.5 | Cross-platform mobile framework |
| **Expo** | 54.0 | Development platform & build tools |
| **TypeScript** | 5.9.2 | Type-safe JavaScript |
| **React** | 19.1.0 | UI component library |

## UI & Design

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native Paper** | 5.15.1 | Material Design 3 UI components |
| **React Native Vector Icons** | 10.3.0 | Icon library (MaterialCommunityIcons) |
| **React Native SVG** | 15.12.1 | SVG rendering for floor plans |

## Maps & Navigation

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native Maps** | 1.20.1 | Map rendering (supports OSM) |
| **Expo Location** | 19.0.8 | GPS location services |
| **OpenStreetMap** | N/A | Free, open-source map tiles |
| **OSRM API** | N/A | Open Source Routing Machine for directions |

## Backend & Data

| Technology | Version | Purpose |
|------------|---------|---------|
| **Supabase** | 2.103.3 | Backend-as-a-Service (PostgreSQL) |
| **PostgreSQL** | (via Supabase) | Relational database |
| **Axios** | 1.15.0 | HTTP client for API calls |

## State Management

| Technology | Version | Purpose |
|------------|---------|---------|
| **Zustand** | 5.0.12 | Lightweight state management |

## Navigation

| Technology | Version | Purpose |
|------------|---------|---------|
| **Expo Router** | 6.0.23 | File-based routing |
| **React Navigation** | 7.x | Navigation primitives |

## Animations & Gestures

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native Gesture Handler** | 2.28.0 | Touch gestures (pinch, pan) |
| **React Native Reanimated** | 4.1.1 | Smooth animations |

---

# 5. KEY FEATURES & IMPLEMENTATIONS

## Feature 1: Outdoor Navigation with GPS

### Description
Real-time GPS tracking shows the user's position as a "blue dot" on the map. Users can get walking directions from their current location to any campus building.

### Technical Implementation
```typescript
// hooks/use-location.ts
- Uses expo-location's watchPositionAsync for continuous tracking
- Requests foreground location permissions
- Returns: { latitude, longitude, accuracy }

// utils/osm-routing.ts
- Calls OSRM API: router.project-osrm.org/route/v1/foot/
- Returns: route coordinates, distance (meters), duration (seconds)

// Haversine Formula for distance calculation
- Accounts for Earth's curvature
- Provides accurate straight-line distances
```

### User Experience
- Blue dot shows current position with accuracy circle
- Orange polyline shows walking route
- Chips display: walking time, distance, GPS status
- Auto-recenter button available

## Feature 2: Indoor Navigation with Floor Plans

### Description
SVG-based floor plans allow users to navigate inside buildings, find specific rooms, and get step-by-step directions between rooms.

### Technical Implementation
```typescript
// assets/floorplans/*.tsx
- React Native SVG components for each floor
- Rooms defined with coordinates, types, accessibility info

// utils/pathfinding.ts
- Dijkstra's shortest path algorithm
- Graph built from room connections
- Accessibility mode filters out stairs

// components/indoor/FloorPlan.tsx
- Pinch-to-zoom and pan gestures
- Room tap selection
- Path overlay rendering
```

### Supported Buildings (Phase 1)
- Faculty of Science (FOS) - Ground, 1st, and 2nd floors

## Feature 3: Building Search & Discovery

### Description
Instant search across all campus buildings and rooms with category filtering.

### Technical Implementation
```typescript
// hooks/use-buildings.ts
- Fetches buildings from Supabase PostgreSQL
- Client-side filtering for instant results
- Caches data to reduce API calls

// Search includes:
- Building name matching
- Short name matching
- Category filtering
- Room-level search
```

### Search Categories
- Faculties (green markers)
- Administrative buildings (blue markers)
- Facilities (orange markers)

## Feature 4: Accessibility Mode

### Description
When enabled, all routes (indoor and outdoor) avoid stairs and prefer ramps and accessible entrances.

### Technical Implementation
```typescript
// store/app-store.ts
- Global accessibilityMode state
- Persists user preference

// Routing Integration:
- Indoor: Dijkstra algorithm filters stairs nodes
- Outdoor: OSRM uses foot profile (accessibility-aware)
- UI shows "Accessible" chip when enabled
```

## Feature 5: Accurate ETA Calculation

### Description
Realistic walking time estimates based on actual distance and average walking speed.

### Technical Implementation
```typescript
// utils/osm-routing.ts

// Haversine Formula
function calculateHaversineDistance(start, end): number {
  // Uses Earth's radius (6371km)
  // Accounts for spherical geometry
  // Returns distance in meters
}

// Walking Time Estimation
function estimateWalkingTime(distanceMeters, speedKmh = 5): number {
  // Default: 5 km/h walking speed
  // Returns duration in seconds
}

// Example:
// 500m distance → ~6 minutes
// 1km distance → ~12 minutes
```

---

# 6. DATABASE SCHEMA

## Supabase PostgreSQL Tables

### Table: buildings
```sql
CREATE TABLE buildings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,           -- "Faculty of Science"
  short_name VARCHAR(50),                -- "FOS"
  description TEXT,                       -- Building description
  latitude DECIMAL(10, 8) NOT NULL,      -- 4.1549
  longitude DECIMAL(11, 8) NOT NULL,     -- 9.2841
  floors INTEGER,                         -- Number of floors
  has_indoor_map BOOLEAN DEFAULT FALSE,  -- Has floor plans?
  category VARCHAR(50) NOT NULL,         -- 'faculty'|'admin'|'facility'
  image_url TEXT,                         -- Building photo URL
  accessible_entrance BOOLEAN DEFAULT FALSE,
  opening_hours VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: rooms
```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  building_id UUID REFERENCES buildings(id),
  name VARCHAR(255) NOT NULL,            -- "Lecture Hall A"
  room_number VARCHAR(50),                -- "101"
  floor INTEGER NOT NULL,                 -- 1
  type VARCHAR(50),                       -- 'lecture_hall'|'lab'|'office'
  node_x INTEGER,                         -- SVG X coordinate
  node_y INTEGER,                         -- SVG Y coordinate
  accessible BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: indoor_graph
```sql
CREATE TABLE indoor_graph (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  building_id UUID REFERENCES buildings(id),
  room_id UUID REFERENCES rooms(id),
  node_x INTEGER NOT NULL,
  node_y INTEGER NOT NULL,
  floor INTEGER NOT NULL,
  is_stairs BOOLEAN DEFAULT FALSE,
  is_ramp BOOLEAN DEFAULT FALSE,
  connections TEXT[],                     -- Array of connected node IDs
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: events
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  building_id UUID REFERENCES buildings(id),
  room_id UUID REFERENCES rooms(id),
  event_date TIMESTAMP NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Seeded Campus Data

| Building | Coordinates | Category |
|----------|-------------|----------|
| Main Gate | 4.1537, 9.2837 | Facility |
| Faculty of Science (FOS) | 4.1549, 9.2841 | Faculty |
| Faculty of Engineering & Technology (FET) | 4.1558, 9.2853 | Faculty |
| Faculty of Social & Management Sciences (FSMS) | 4.1543, 9.2862 | Faculty |
| Faculty of Arts (FA) | 4.1535, 9.2870 | Faculty |
| Faculty of Health Sciences (FHS) | 4.1562, 9.2845 | Faculty |
| Administration Block | 4.1540, 9.2855 | Admin |
| University Library | 4.1545, 9.2860 | Facility |
| Student Union Building (SUB) | 4.1531, 9.2848 | Facility |
| Sports Complex | 4.1520, 9.2840 | Facility |
| Amphitheatre | 4.1538, 9.2843 | Facility |

---

# 7. FOLDER STRUCTURE

```
ubcompass/
├── app/                              # Expo Router screens
│   ├── (tabs)/                       # Tab navigation screens
│   │   ├── index.tsx                 # Home/Map screen
│   │   ├── search.tsx                # Search screen
│   │   ├── indoor.tsx                # Indoor navigation
│   │   └── settings.tsx              # Settings & accessibility
│   ├── building/
│   │   └── [id].tsx                  # Building detail screen
│   ├── directions/
│   │   └── [id].tsx                  # Turn-by-turn directions
│   └── _layout.tsx                   # Root layout with tabs
│
├── components/                        # Reusable UI components
│   ├── map/
│   │   ├── BuildingMarker.tsx        # Map building markers
│   │   └── RoutePolyline.tsx         # Route line component
│   ├── indoor/
│   │   ├── FloorPlan.tsx             # SVG floor renderer
│   │   └── FloorSelector.tsx         # Floor switcher
│   └── ui/
│       ├── BottomSheet.tsx           # Building info panel
│       └── AccessibilityToggle.tsx   # Accessibility switch
│
├── constants/
│   ├── theme.ts                      # Material Design 3 theme
│   ├── mapConfig.ts                  # Map defaults
│   └── ubCampusData.ts               # Static campus data
│
├── hooks/                            # Custom React hooks
│   ├── use-location.ts               # GPS location hook
│   ├── use-buildings.ts              # Fetch buildings
│   └── use-routing.ts                # Pathfinding hook
│
├── store/
│   └── app-store.ts                  # Zustand global state
│
├── utils/
│   ├── pathfinding.ts                # Dijkstra's algorithm
│   └── osm-routing.ts                # OSRM API + Haversine
│
├── supabase/
│   ├── config.ts                     # Supabase client
│   ├── buildings.ts                  # Building queries
│   ├── rooms.ts                      # Room queries
│   └── seedData.ts                   # Initial data seeder
│
├── assets/
│   ├── floorplans/                   # SVG floor plan components
│   │   ├── fos-floor-g.tsx
│   │   ├── fos-floor-1.tsx
│   │   └── fos-floor-2.tsx
│   └── images/                       # App icons, splash screen
│
├── app.json                          # Expo configuration
├── package.json                      # Dependencies
└── tsconfig.json                     # TypeScript config
```

---

# 8. ALGORITHMS & CALCULATIONS

## Algorithm 1: Haversine Formula (Distance Calculation)

### Purpose
Calculate the great-circle distance between two GPS coordinates, accounting for Earth's spherical shape.

### Formula
```
a = sin²(Δφ/2) + cos(φ1) × cos(φ2) × sin²(Δλ/2)
c = 2 × atan2(√a, √(1−a))
d = R × c

Where:
- φ = latitude in radians
- λ = longitude in radians
- R = Earth's radius (6,371 km)
- d = distance in kilometers
```

### Implementation
```typescript
function calculateHaversineDistance(start: Coordinate, end: Coordinate): number {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (start.latitude * Math.PI) / 180;
  const phi2 = (end.latitude * Math.PI) / 180;
  const deltaPhi = ((end.latitude - start.latitude) * Math.PI) / 180;
  const deltaLambda = ((end.longitude - start.longitude) * Math.PI) / 180;

  const a = Math.sin(deltaPhi / 2) ** 2 +
            Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}
```

## Algorithm 2: Dijkstra's Shortest Path (Indoor Navigation)

### Purpose
Find the shortest path between two rooms in a building, with optional accessibility filtering.

### How It Works
1. Create a graph from room connections
2. Initialize distances: start = 0, all others = infinity
3. Use priority queue to process nodes by shortest distance
4. For each node, update neighbor distances if shorter path found
5. Continue until destination reached or all nodes processed
6. Backtrack to reconstruct path

### Accessibility Mode
When enabled, the algorithm:
- Filters out all edges connected to "stairs" nodes
- Only uses ramps for floor transitions
- Returns null if no accessible path exists

### Implementation Highlights
```typescript
function findShortestPath(
  graph: IndoorGraph,
  startNodeId: string,
  endNodeId: string,
  accessibilityMode: boolean
): PathResult | null {
  // Filter stairs if accessibility mode
  if (accessibilityMode) {
    graph = filterStairsFromGraph(graph);
  }

  // Standard Dijkstra with priority queue
  // Uses Euclidean distance as edge weights
  // Returns ordered array of node coordinates
}
```

## Algorithm 3: Walking Time Estimation

### Formula
```
Time (seconds) = Distance (meters) / Walking Speed (m/s)

Where:
- Average walking speed = 5 km/h = 1.39 m/s
```

### Examples
| Distance | Walking Time |
|----------|--------------|
| 100m | ~1 minute |
| 500m | ~6 minutes |
| 1 km | ~12 minutes |
| 5 km | ~1 hour |

---

# 9. EXTERNAL APIs & SERVICES

## 1. OpenStreetMap (OSM)

### Purpose
Free, open-source map tiles for outdoor map rendering.

### Integration
```
Tile URL: https://tile.openstreetmap.org/{z}/{x}/{y}.png
```

### Why OSM?
- Completely free (no API key required)
- Community-maintained, up-to-date data
- Works offline with tile caching
- Detailed coverage of Cameroon

## 2. OSRM (Open Source Routing Machine)

### Purpose
Calculate walking routes with turn-by-turn directions.

### API Endpoint
```
GET https://router.project-osrm.org/route/v1/foot/{lon1},{lat1};{lon2},{lat2}
  ?overview=full
  &geometries=geojson
  &steps=true
```

### Response
```json
{
  "routes": [{
    "distance": 523.4,        // meters
    "duration": 376.8,        // seconds
    "geometry": {
      "coordinates": [[lon, lat], ...]
    },
    "legs": [{
      "steps": [{
        "instruction": "Turn right",
        "distance": 50,
        "maneuver": { "type": "turn" }
      }]
    }]
  }]
}
```

### Why OSRM?
- Free public API (demo server)
- Foot/walking profile optimized
- Returns actual walkable paths (not straight lines)
- GeoJSON geometry for easy rendering

## 3. Supabase

### Purpose
Backend-as-a-Service providing PostgreSQL database, authentication, and storage.

### Services Used
- **PostgreSQL**: Store buildings, rooms, indoor graphs
- **Authentication**: Anonymous auth for read access
- **Storage**: Building images (future feature)

### Configuration
```typescript
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);
```

## 4. Expo Location

### Purpose
Access device GPS for real-time location tracking.

### Capabilities
- Foreground location permission
- Continuous position updates
- Accuracy levels (high, balanced, low)
- Error handling for denied permissions

---

# 10. DESIGN PRINCIPLES

## Material Design 3 (Material You)

UBCompass follows Google's Material Design 3 guidelines using React Native Paper.

### Color Scheme
| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary (UB Green) | #006400 | Headers, active tabs, primary buttons |
| Primary Container | #A8D5A2 | Chips, badges, soft backgrounds |
| Secondary | #4CAF50 | Secondary actions, success states |
| Background | #F6FBF4 | Screen backgrounds |
| Surface | #FFFFFF | Cards, bottom sheets |
| Error | #B00020 | Error states, warnings |
| Route Orange | #FF6B35 | Navigation polylines |

### Typography
- Headlines: Bold, UB Green
- Body: Regular, dark grey
- Captions: Muted grey

### Components Used
- `Appbar.Header` - Top navigation bars
- `Searchbar` - Search input fields
- `List.Item` - List rows with icons
- `Button` - Primary and outlined buttons
- `Chip` - Category badges, status indicators
- `Surface` - Elevated cards
- `Snackbar` - Toast notifications
- `FAB` - Floating action buttons
- `SegmentedButtons` - Floor selector, map style picker

---

# 11. DEVELOPMENT PHASES

## Phase 1: Project Initialization ✅ 100% Complete
- Expo project scaffolded
- Dependencies installed
- Folder structure created
- Theme configured

## Phase 2: Supabase Setup ✅ 100% Complete
- Database schema created
- Campus data seeded
- CRUD functions implemented

## Phase 3: Outdoor Map Screen ✅ 100% Complete
- GPS location tracking (blue dot)
- Building markers on map
- OSRM routing integration
- Bottom sheet for building info
- Accessibility toggle FAB

## Phase 4: Search Screen ✅ 100% Complete
- Building search with filtering
- Recent searches
- Building detail screen
- Room listing

## Phase 5: Indoor Navigation ✅ 100% Complete
- SVG floor plans for FOS
- Floor selector component
- Dijkstra pathfinding
- Room tap selection
- Path visualization

## Phase 6: Settings & Accessibility ✅ 100% Complete
- Accessibility mode toggle
- Show building labels toggle
- Auto-center preference
- Map style selection
- About section

## Phase 7: Tab Navigation & Polish ✅ 100% Complete
- Bottom tab navigator
- Consistent theming
- Loading states
- Error handling with Snackbars

## Phase 8: Testing & Deployment 🔄 In Progress
- Unit tests (pending)
- Performance optimization (ongoing)
- Build configurations (ready)

---

# 12. FUTURE ENHANCEMENTS

## Short-term Roadmap
1. **More Indoor Maps**: Add floor plans for FET, FSMS, Library
2. **Offline Support**: Cache map tiles and building data
3. **Campus Events**: Show upcoming events on buildings
4. **Voice Navigation**: Turn-by-turn voice guidance

## Long-term Vision
1. **Augmented Reality (AR)**: Point camera to see building info overlay
2. **Real-time Bus Tracking**: Campus shuttle locations
3. **Crowd Density**: Show busy areas (lecture halls during exams)
4. **Multi-language**: French and local language support
5. **Social Features**: Share locations, meet-up points

---

# 13. PROJECT TEAM

## Academic Supervision
- **Supervisor**: Dr. Mougnol Romeo

## Development Team: Group 5
- [Team member names to be added]

## Institution
**University of Buea, Cameroon**
Faculty of Engineering and Technology

---

# 14. TECHNICAL GLOSSARY

| Term | Definition |
|------|------------|
| **API** | Application Programming Interface - how software components communicate |
| **Expo** | Platform for building React Native apps with managed workflow |
| **GPS** | Global Positioning System - satellite-based location |
| **Haversine** | Formula for calculating distances on a sphere |
| **Dijkstra** | Algorithm for finding shortest path in a graph |
| **OSRM** | Open Source Routing Machine - routing engine |
| **PostgreSQL** | Open-source relational database |
| **Supabase** | Backend-as-a-Service platform |
| **SVG** | Scalable Vector Graphics - resolution-independent images |
| **Zustand** | Lightweight state management library for React |
| **Material Design 3** | Google's latest design system |
| **TypeScript** | Type-safe JavaScript superset |
| **Polyline** | Line drawn through multiple GPS coordinates |

---

# 15. DEMONSTRATION SCRIPT

## Demo Flow for Presentation

### Step 1: App Launch (30 seconds)
- Show splash screen with UB green branding
- App opens to Map tab
- Point out the campus overview

### Step 2: Location Permission (30 seconds)
- Grant location permission
- Show blue dot appearing
- Explain GPS accuracy circle

### Step 3: Find a Building (1 minute)
- Tap on Search tab
- Type "Faculty of Science"
- Show instant results
- Tap to open building detail
- Point out: photo, description, accessibility info

### Step 4: Get Outdoor Directions (1 minute)
- Tap "Get Directions"
- Show route polyline on map
- Point out: distance chip, ETA chip, GPS chip
- Explain walking time calculation

### Step 5: Indoor Navigation (2 minutes)
- Go to Indoor tab
- Select "Faculty of Science"
- Show floor selector (G, 1, 2)
- Select origin room (Entrance)
- Select destination room (Room 205)
- Tap "Find Route"
- Show path drawn on floor plan
- Enable Accessibility Mode
- Show route changes to avoid stairs

### Step 6: Settings (30 seconds)
- Open Settings tab
- Toggle Accessibility Mode
- Show map style options
- Point out About section

### Total Demo Time: ~6 minutes

---

# 16. CONCLUSION

## Key Achievements
- **Cross-platform**: Single codebase for iOS and Android
- **Real-world data**: Actual UB campus coordinates
- **Accessibility-first**: Wheelchair-friendly routing
- **Open-source stack**: No vendor lock-in, completely free
- **Modern UI**: Material Design 3 compliance
- **Accurate navigation**: GPS tracking + OSRM routing

## Impact
UBCompass transforms how students, staff, and visitors navigate the University of Buea campus. By combining outdoor GPS navigation with indoor floor plans and accessibility features, it provides an inclusive solution that benefits the entire campus community.

---

*Document prepared for UBCompass presentation*
*Last updated: 2025*
