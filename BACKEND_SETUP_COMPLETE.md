# Backend Integration Setup Guide

## ✅ Completed
All frontend code has been updated to connect to Supabase. Here's what's been set up:

### Infrastructure Created
1. **Supabase Client** (`ubcompass/lib/supabase.ts`)
   - Initializes connection using environment variables
   - Ready to authenticate requests

2. **API Services** (`ubcompass/services/`)
   - `buildings.service.ts` - Fetch buildings, search, filter
   - `images.service.ts` - Fetch campus gallery images
   - `rooms.service.ts` - Fetch indoor rooms and navigation graph
   - `search.service.ts` - Save/retrieve search history

3. **Zustand Stores** (`ubcompass/store/`)
   - `use-buildings-store.ts` - Manages building data state
   - `use-images-store.ts` - Manages image gallery state
   - `use-rooms-store.ts` - Manages indoor navigation state

4. **React Hooks** (`ubcompass/hooks/`)
   - `use-buildings.ts` - Hook to access buildings data
   - `use-images.ts` - Hook to access images data
   - `use-rooms.ts` - Hook to access rooms data

5. **Screen Migrations**
   - ✅ `app/(tabs)/index.tsx` - Now loads buildings & images from Supabase
   - ✅ `app/(tabs)/search.tsx` - Now searches real building data
   - ✅ `app/(tabs)/indoor.tsx` - Now loads indoor-ready buildings
   - ✅ `app/building/[id].tsx` - Now displays dynamic building details
   - ✅ `app/directions/[id].tsx` - Now calculates routes with real coordinates

6. **Root Layout**
   - `app/_layout.tsx` - Initializes stores on app startup

## ⚠️ NEXT STEPS - YOU MUST DO THIS

### Step 1: Run SQL in Supabase
1. Go to your Supabase project: https://app.supabase.com
2. Open the SQL Editor (left sidebar → SQL)
3. Create a new query and paste the contents of `SUPABASE_TABLES.sql`
4. Run all queries

**Expected Output:**
- 5 tables created (buildings, images, rooms, indoor_graph, search_history)
- 5 buildings inserted
- 3 campus images inserted
- Indexes created

### Step 2: Verify Environment Variables
Check that `.env.local` exists in the root with these variables:
```
EXPO_PUBLIC_SUPABASE_URL=https://naxkglflrzxreglhjqpd.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<key-from-.env.local>
SUPABASE_SERVICE_ROLE_KEY=<key-from-.env.local>
```

These are already in your .env.local file ✅

### Step 3: Install Dependencies (if you haven't already)
```bash
cd ubcompass
npm install
```

### Step 4: Run the App
```bash
cd ubcompass
npm start

# Then press:
# 'a' for Android emulator
# 'i' for iOS simulator
# 'w' for web
# Or scan the QR code with Expo Go app
```

### Step 5: Test Each Screen

**Home/Map Screen (`/`):**
- ✅ Data should load from Supabase (brief loading spinner appears)
- ✅ Map shows all campus buildings as markers
- ✅ Clicking buildings focuses the map and updates the overlay
- ✅ Building cards at bottom display real data
- ✅ Gallery section shows campus images

**Search Screen (`/search`):**
- ✅ All buildings load
- ✅ Filtering works in real-time
- ✅ Results show actual building data
- ✅ Clicking "View" navigates to building details

**Building Details Screen (`/building/[id]`):**
- ✅ Building information displays correctly
- ✅ "Get Directions" button works
- ✅ "View Indoor Map" button shows if building has indoor map
- ✅ Highlights and nearby places display

**Indoor Navigation Screen (`/indoor`):**
- ✅ Building selector shows only buildings with `has_indoor_map: true`
- ✅ Currently shows FOS, Library (if data is seeded correctly)
- ✅ Floor selector works
- ✅ Mock floor plan displays

**Directions Screen (`/directions/[id]`):**
- ✅ Map shows route from Main Gate to selected building
- ✅ Distance and duration calculate correctly
- ✅ Bottom sheet panel displays turn-by-turn directions
- ✅ All interactive buttons work

## Troubleshooting

### "Missing Supabase URL or Anon Key"
- Check `.env.local` exists and has the two SUPABASE variables
- Restart Expo (`npm start --clear`)

### "No buildings showing / Loading forever"
- Verify SQL ran successfully in Supabase (check Tables in SQL editor)
- Check browser Network tab in Expo DevTools to see API responses
- Make sure buildings table has at least 1 record

### "Building properties undefined (shortName, etc)"
- The service layer converts snake_case from DB to camelCase for components
- If you see errors like "building.short_name is not defined", it means the service mapping failed
- Check console for API errors

### Images not loading
- Campus image URLs are Wikimedia Commons links
- They should load if device has internet access
- Fall back images should still render if URLs fail

### Network errors on device
- Make sure device is on same WiFi as dev machine OR use Expo tunnel
- Check Expo DevTools Network tab for API call details

## Files Changed/Created

### New Files
- `ubcompass/lib/supabase.ts`
- `ubcompass/services/buildings.service.ts`
- `ubcompass/services/images.service.ts`
- `ubcompass/services/rooms.service.ts`
- `ubcompass/services/search.service.ts`
- `ubcompass/store/use-buildings-store.ts`
- `ubcompass/store/use-images-store.ts`
- `ubcompass/store/use-rooms-store.ts`
- `ubcompass/hooks/use-buildings.ts`
- `ubcompass/hooks/use-images.ts`
- `ubcompass/hooks/use-rooms.ts`
- `SUPABASE_TABLES.sql`

### Modified Files
- `ubcompass/app/_layout.tsx` - Added store initialization
- `ubcompass/app/(tabs)/index.tsx` - Now uses useBuildings & useImages hooks
- `ubcompass/app/(tabs)/search.tsx` - Now uses useBuildings hook
- `ubcompass/app/(tabs)/indoor.tsx` - Now uses useBuildings hook
- `ubcompass/app/building/[id].tsx` - Now uses useBuildings hook
- `ubcompass/app/directions/[id].tsx` - Now uses useBuildings hook
- `ubcompass/package.json` - Added uuid & @types/uuid

### Unchanged Files
- All UI components and styling remain identical
- Navigation and routing unchanged
- Theme and constants unchanged
- All existing functionality preserved

## What's Different from Before?

| Feature | Before | After |
|---------|--------|-------|
| Data Source | Hardcoded mock data | Live Supabase PostgreSQL |
| Loading | Instant (mock data) | Slight delay (network fetch) |
| Scalability | Limited to 5 buildings | Can add unlimited buildings |
| Real-time Updates | No | Yes (with Supabase subscriptions - future) |
| Search | Client-side filtering | Can be extended with server-side full-text search |
| State Management | Component useState | Zustand store + React hooks |

## Future Enhancements

These are not implemented but now easy to add:

1. **Real-time Data**: Add Supabase subscriptions to push updates to all users
2. **Full-Text Search**: Implement server-side search with PostgreSQL FTS
3. **Authentication**: Require login for saving favorites, accessing events
4. **Search History**: Save user search history (infrastructure is ready)
5. **Rooms & Indoor Navigation**: Populate rooms table and build pathfinding algorithm
6. **Events**: Show building events linked to specific rooms/buildings
7. **Offline Mode**: Cache data with Zustand persist middleware

## Questions?

If you encounter issues:
1. Check the browser/Expo DevTools console for error messages
2. Check Supabase logs (Project Settings → Logs)
3. Verify the SQL table schema matches the Building interface types
4. Ensure all environment variables are set correctly
