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
  files?: { name: string; type: string; url: string | null }[];
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
