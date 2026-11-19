import fs from 'fs';
import path from 'path';
import { DatabaseSchema, Profile, SwipeRecord, MatchRecord } from './types';
import { SEED_PROFILES, INITIAL_PRE_LIKED_PROFILES } from './seed-data';

// Path for persisted data storage
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Default Demo User ID
export const DEMO_USER_ID = 'demo-user-me';

// Helper to ensure database file exists with initial seeded state
export function getDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      profiles: SEED_PROFILES,
      initialLikesToUser: INITIAL_PRE_LIKED_PROFILES,
      swipes: [],
      matches: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content) as DatabaseSchema;
  } catch (error) {
    console.error('Error reading database file, reinitializing:', error);
    const initialData: DatabaseSchema = {
      profiles: SEED_PROFILES,
      initialLikesToUser: INITIAL_PRE_LIKED_PROFILES,
      swipes: [],
      matches: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

// Atomically write database to prevent corrupted states
export function saveDatabase(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Write to temporary file first then rename for atomic file operation
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

// Reset database to initial seed state (clean reset for testing or demo)
export function resetDatabase(): DatabaseSchema {
  const freshData: DatabaseSchema = {
    profiles: SEED_PROFILES,
    initialLikesToUser: INITIAL_PRE_LIKED_PROFILES,
    swipes: [],
    matches: []
  };
  saveDatabase(freshData);
  return freshData;
}
