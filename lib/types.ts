export interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  location: string; // city or college
  interests: string[];
}

export type SwipeAction = 'like' | 'pass';

export interface SwipeRecord {
  swiperId: string;
  targetId: string;
  action: SwipeAction;
  createdAt: string;
}

export interface MatchRecord {
  id: string;
  userA: string;
  userB: string;
  matchedAt: string;
}

export interface SwipeRequest {
  profileId: string;
  action: SwipeAction;
}

export interface SwipeResponse {
  success: boolean;
  action: SwipeAction;
  isMatch: boolean;
  match?: {
    id: string;
    profile: Profile;
    matchedAt: string;
  };
}

export interface MatchesResponse {
  matches: Array<{
    id: string;
    profile: Profile;
    matchedAt: string;
  }>;
}

export interface DatabaseSchema {
  profiles: Profile[];
  initialLikesToUser: string[]; // profile IDs of users who pre-liked demo-user (internal only!)
  swipes: SwipeRecord[];
  matches: MatchRecord[];
}
