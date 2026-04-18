# UBCompass - Supabase Configuration

## Project Information
- **Project Name:** ubcompass
- **Project ID:** naxkglflrzxreglhjqpd
- **Supabase URL:** https://naxkglflrzxreglhjqpd.supabase.co

## Setup Instructions

### 1. Environment Variables
Create a `.env.local` file in the project root with:
```
EXPO_PUBLIC_SUPABASE_URL=https://naxkglflrzxreglhjqpd.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

**⚠️ IMPORTANT:** Never commit `.env.local` to git. Use `.env.example` as a template instead.

### 2. Database Tables
Create the following PostgreSQL tables in your Supabase project:

#### Buildings Table
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
  category VARCHAR(50) NOT NULL,
  image_url TEXT,
  accessible_entrance BOOLEAN DEFAULT FALSE,
  opening_hours VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Rooms Table
```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  room_number VARCHAR(50),
  floor INTEGER NOT NULL,
  type VARCHAR(50),
  node_x INTEGER,
  node_y INTEGER,
  accessible BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Indoor Graph Table
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
  connections TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Events Table
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

### 3. Enable Row Level Security (RLS)
For production, enable RLS on all tables and create appropriate policies.

### 4. Initial Data Seed
Insert the 11 UB campus buildings into the buildings table. See `UBCompass.md` PHASE 2 for the seed data.

## Next Steps
1. Run `npm install` to install dependencies
2. Create the database tables (see above)
3. Follow the 8 phases in `UBCompass.md`
4. Start development with `npx expo start`
