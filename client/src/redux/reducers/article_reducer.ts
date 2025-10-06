import { createSlice } from "@reduxjs/toolkit";
import logo from "../../assets/logo.jpg"

export interface Post {
  articleId: string,
  authorPicture: string,
  authorFullname: string,
  authorVerified: boolean,
  title: string,
  content: string,
  picture?: string,
  tags: string[],
  likes: number,
  readTime: string,
  slug: string,
  createdAt: string
}

export interface Article {
  articleId: string,
  authorId: string,
  authorPicture: string,
  authorFullname: string,
  authorVerified: boolean,
  title: string,
  content: string,
  picture?: string,
  tags: string[],
  likes: number,
  readTime: string,
  slug: string,
  createdAt: string
}

export const posts: Post[] = [
  {articleId:"jfif", authorPicture: logo, authorFullname: "Clivo", authorVerified: true, title:"How to get a verified account", content: "Hello", createdAt: "2 months ago", picture: logo, tags: ["Tech", "Design", "Business"], likes: 5, readTime: "1 mins read time", slug: ""},
  {articleId: "weio", authorPicture: "", authorFullname: "Habeeb Amoo", authorVerified: false, title:"Go or Rust for backend developement", content: "welcome", createdAt: "4 weeks ago", picture: "", tags: ["Tech", "Software"], likes: 16, readTime: "6 mins read time", slug: ""},
];

const initialState = {
  posts: posts,
  articles: []
  
}

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {

  }
})

export default articleSlice.reducer