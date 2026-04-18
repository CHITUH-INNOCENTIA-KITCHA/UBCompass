-- UBCompass Database Schema Setup
-- Run these SQL queries in your Supabase SQL Editor

-- 1. Buildings Table
CREATE TABLE IF NOT EXISTS buildings (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(50),
  category VARCHAR(50) NOT NULL,
  description TEXT,
  opening_hours VARCHAR(255),
  floors INTEGER,
  accessible_entrance BOOLEAN DEFAULT FALSE,
  has_indoor_map BOOLEAN DEFAULT FALSE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  image TEXT,
  highlights TEXT[] DEFAULT ARRAY[]::TEXT[],
  nearby TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Images Table
CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  caption TEXT,
  image TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  building_id TEXT NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
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

-- 4. Indoor Graph Table (for pathfinding)
CREATE TABLE IF NOT EXISTS indoor_graph (
  id TEXT PRIMARY KEY,
  building_id TEXT NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  room_id TEXT REFERENCES rooms(id) ON DELETE SET NULL,
  node_x INTEGER NOT NULL,
  node_y INTEGER NOT NULL,
  floor INTEGER NOT NULL,
  is_stairs BOOLEAN DEFAULT FALSE,
  is_ramp BOOLEAN DEFAULT FALSE,
  connections TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Search History Table
CREATE TABLE IF NOT EXISTS search_history (
  id TEXT PRIMARY KEY,
  query VARCHAR(255) NOT NULL,
  building_id TEXT REFERENCES buildings(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Insert Campus Buildings Data
INSERT INTO buildings (id, name, short_name, category, description, opening_hours, floors, accessible_entrance, has_indoor_map, latitude, longitude, image, highlights, nearby)
VALUES
('fos', 'Faculty of Science', 'FOS', 'faculty', 'A central academic hub for science departments, laboratories, and lecture rooms.', 'Mon - Fri, 7:30 AM - 6:00 PM', 3, true, true, 4.1549, 9.2841, 'https://commons.wikimedia.org/wiki/Special:FilePath/University%20of%20Buea%20campus.jpg', ARRAY['Labs', 'Lecture halls', 'Ramp access'], ARRAY['Main Gate', 'Amphitheatre', 'Library']),
('fet', 'Faculty of Engineering & Technology', 'FET', 'faculty', 'Engineering workshops, project studios, and classrooms gathered in one busy zone.', 'Mon - Fri, 8:00 AM - 6:30 PM', 4, true, false, 4.1558, 9.2853, 'https://commons.wikimedia.org/wiki/Special:FilePath/Campus%20University%20of%20Buea.jpg', ARRAY['Innovation labs', 'Studios', 'Project rooms'], ARRAY['Admin Block', 'Science Block']),
('library', 'University Library', 'Library', 'facility', 'The library offers quiet reading areas, digital research access, and group study space.', 'Mon - Sat, 8:00 AM - 8:00 PM', 2, true, true, 4.1545, 9.286, 'https://commons.wikimedia.org/wiki/Special:FilePath/University%20of%20Buea%20campus.jpg', ARRAY['Study spaces', 'Digital access', 'Quiet zones'], ARRAY['FOS', 'Amphitheatre']),
('admin', 'Admin Block', 'Admin', 'admin', 'Central administration offices and student services hub.', 'Mon - Fri, 8:00 AM - 5:00 PM', 2, false, false, 4.1535, 9.2875, 'https://commons.wikimedia.org/wiki/Special:FilePath/Campus%20University%20of%20Buea.jpg', ARRAY['Offices', 'Student services'], ARRAY['Library', 'FET']),
('amphitheatre', 'Amphitheatre', 'Amphitheatre', 'facility', 'Large outdoor venue for lectures, seminars, and university events.', 'Open access', 1, true, false, 4.1555, 9.2845, 'https://commons.wikimedia.org/wiki/Special:FilePath/University%20of%20Buea%20Campus%20B.jpg', ARRAY['Events', 'Large groups'], ARRAY['FOS', 'Library']);

-- 7. Insert Campus Images
INSERT INTO images (id, title, caption, image)
VALUES
('entrance', 'Morning approach to campus', 'Main street into the University of Buea campus with the mountain skyline in view.', 'https://commons.wikimedia.org/wiki/Special:FilePath/Morning%20View%20of%20the%20University%20of%20Buea%20Entrance%2001.jpg'),
('main-campus', 'University of Buea campus', 'A wide campus view used to ground the UBCompass home experience in the real place.', 'https://commons.wikimedia.org/wiki/Special:FilePath/University%20of%20Buea%20campus.jpg'),
('campus-b', 'Campus B and Health Sciences', 'A recent photograph from the University of Buea Campus B / Health Sciences area.', 'https://commons.wikimedia.org/wiki/Special:FilePath/University%20of%20Buea%20Campus%20B.jpg');

-- 8. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_buildings_category ON buildings(category);
CREATE INDEX IF NOT EXISTS idx_buildings_has_indoor_map ON buildings(has_indoor_map);
CREATE INDEX IF NOT EXISTS idx_rooms_building_id ON rooms(building_id);
CREATE INDEX IF NOT EXISTS idx_rooms_floor ON rooms(floor);
CREATE INDEX IF NOT EXISTS idx_indoor_graph_building_id ON indoor_graph(building_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at DESC);

-- NOTE: Enable Row Level Security for production
-- ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE images ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE indoor_graph ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
