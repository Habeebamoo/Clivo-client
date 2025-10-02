import { createSlice } from "@reduxjs/toolkit";
import logo from "../../assets/logo.jpg"

export interface Article {
  articleId: string,
  authorId: string,
  authorPicture: string,
  authorFullname: string,
  authorUsername: string,
  authorVerified: boolean,
  title: string,
  content: string,
  picture?: string,
  tags?: string[],
  readTime: string,
  createdAt: string
}

export const articles = [
  {articleId:"jfif", authorId: "sfrr", authorPicture: logo, authorFullname: "Clivo", authorUsername: "@clivo", authorVerified: true, title:"How to get a verified account", content: "Hello", createdAt: "2 months ago", picture: logo, tags: ["Tech", "Design", "Business"], readTime: "1 mins read time"},
  {articleId: "weio", authorId: "srrr", authorPicture: "", authorFullname: "Habeeb Amoo", authorUsername: "@habeeb_amoo_534", authorVerified: false, title:"Go or Rust for backend developement", content: "welcome", createdAt: "4 weeks ago", picture: "", tags: ["Tech", "Software"], readTime: "6 mins read time"},
];

const initialState = {
  articles: articles
}

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {

  }
})

export default articleSlice.reducer