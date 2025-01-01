export interface Post {
  id: string;
  author: User;
  content: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  title: string;
  avatar: string;
  connections: number;
  backgroundImage?: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: string;
}