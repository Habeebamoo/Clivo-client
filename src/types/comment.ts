export interface Comment {
  commentId: string;
  articleId: string;
  replys: number;
  content: string;
  name: string;
  username: string;
  verified: boolean;
  picture: string;
}
