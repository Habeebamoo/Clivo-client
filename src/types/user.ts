export type User = {
  userId: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  isBanned: boolean;
  username: string;
  bio: string;
  picture: string;
  interests: string[];
  profileUrl: string;
  website: string;
  following: number;
  followers: number;
  createdAt: string;
};
