export interface Post {
  articleId: string;
  authorPicture: string;
  authorFullname: string;
  authorProfileUrl: string;
  authorBio: string;
  authorVerified: boolean;
  title: string;
  content: any;
  picture?: string;
  tags: string[];
  likes: number;
  readTime: string;
  slug: string;
  createdAt: string;
}

export interface Article {
  articleId: string;
  authorId: string;
  authorPicture: string;
  authorFullname: string;
  authorProfileUrl: string;
  authorVerified: boolean;
  title: string;
  content: any;
  picture?: string;
  tags: string[];
  likes: number;
  readTime: string;
  slug: string;
  createdAt: string;
}
