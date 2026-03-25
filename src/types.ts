export interface LibraryItem {
  id: string;
  type: "image" | "video" | "audio" | "file";
  category: "ai-generated" | "photos" | "music" | "other";
  url: string;
  name: string;
  timestamp: number;
}

export interface AIAssistant {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "active" | "idle" | "learning";
  model: "gemini" | "grok" | "gpt" | "claude";
}

export interface User {
  id?: string;
  name: string;
  email: string;
  picture: string | null;
  coverPhoto?: string | null;
  bio?: string;
  location?: string;
  sub: string;
  provider: string;
  stats?: {
    posts: number;
    friends: number;
    followers: number;
    following: number;
    aiInteractions: number;
  };
  library?: LibraryItem[];
  aiAssistants?: AIAssistant[];
}

export interface Post {
  id: string | number;
  authorId: string;
  authorName: string;
  authorPic: string | null;
  content: string;
  image: string | null;
  video?: string | null;
  type: "post" | "reel" | "story";
  likes: number;
  comments: Comment[];
  shares: number;
  saved: boolean;
  liked: boolean;
  time: string;
  privacy: "public" | "friends" | "private";
  vocalImprint?: string | null;
  aiInsight?: string | null;
  groupId?: string | null;
  customStyle?: string | null;
  files?: { name: string; type: string; url: string | null }[];
}

export interface Group {
  id: string;
  name: string;
  description: string;
  coverPhoto: string | null;
  adminId: string;
  memberCount: number;
  isMember?: boolean;
  createdAt: string;
}

export interface GroupMember {
  userId: string;
  groupId: string;
  role: "admin" | "member";
  joinedAt: string;
}

export interface Comment {
  id: string | number;
  author: string;
  text: string;
  time: string;
}

export interface Story {
  id: number;
  name: string;
  color: string;
  emoji: string;
}

export interface Friend {
  id: string;
  name: string;
  status: string;
  color: string;
}

/* ══════════════════════════════════════════════════════════
   BTS – NETBOOK TYPES (2026 Edition)
   Hip-Hop Producer Approved ✅
══════════════════════════════════════════════════════════ */

export interface LibraryItem {
  id: string;
  type: "image" | "video" | "audio" | "file";
  category: "ai-generated" | "photos" | "music" | "other";
  url: string;
  name: string;
  timestamp: number;
  prompt?: string;           // pro AI generovaný obsah
}

export interface AIAssistant {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "active" | "idle" | "learning";
  model: "gemini" | "grok" | "gpt" | "claude";
  color?: string;
}

export interface User {
  id?: string;
  sub: string;                    // hlavní unikátní ID (z OAuth)
  name: string;
  email: string;
  picture: string | null;
  coverPhoto?: string | null;
  bio?: string;
  location?: string;
  provider: string;
  stats: {
    posts: number;
    friends: number;
    followers: number;
    following: number;
    aiInteractions: number;
  };
  library?: LibraryItem[];
  aiAssistants?: AIAssistant[];
  createdAt?: string;
}

export interface Comment {
  id: string | number;
  authorId: string;
  authorName: string;
  authorPic?: string | null;
  text: string;
  time: string;
  likes?: number;
}

export interface Post {
  id: string | number;
  authorId: string;
  authorName: string;
  authorPic: string | null;
  content: string;
  image: string | null;
  video?: string | null;
  type: "post" | "reel" | "story";
  likes: number;
  liked: boolean;
  comments: Comment[];
  shares: number;
  saved: boolean;
  time: string;                       // ISO string nebo "před 2h"
  privacy: "public" | "friends" | "private";
  vocalImprint?: string | null;
  aiInsight?: string | null;
  groupId?: string | null;
  customStyle?: string | null;        // pro speciální vizuální efekty
  hashtags?: string[];
  files?: Array<{
    name: string;
    type: string;
    url: string | null;
  }>;
  createdAt?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  coverPhoto: string | null;
  adminId: string;
  memberCount: number;
  isMember?: boolean;
  createdAt: string;
  tags?: string[];
}

export interface GroupMember {
  userId: string;
  groupId: string;
  role: "admin" | "member";
  joinedAt: string;
}

export interface Story {
  id: string | number;
  userId: string;
  name: string;
  avatar: string;
  image?: string | null;
  video?: string | null;
  emoji?: string;
  color?: string;
  viewed?: boolean;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string | null;
  status: "online" | "offline" | "away";
  mutualFriends?: number;
  lastActive?: string;
}