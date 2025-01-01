import { Post } from '../types';

export const MOCK_POSTS: Post[] = [
  {
    id: "1",
    author: {
      id: "1",
      name: "John Doe",
      title: "Software Engineer at Tech Corp",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      connections: 500,
    },
    content: "Excited to share that I have started a new position as Software Engineer at Tech Corp! #newjob #excited",
    likes: 142,
    comments: [],
    timestamp: "2h ago",
  },
  {
    id: "2",
    author: {
      id: "2",
      name: "Jane Smith",
      title: "Product Manager at Innovation Inc",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      connections: 1500,
    },
    content: "Just published my article on product management best practices. Check it out! #productmanagement #leadership",
    likes: 89,
    comments: [],
    timestamp: "4h ago",
  },
];