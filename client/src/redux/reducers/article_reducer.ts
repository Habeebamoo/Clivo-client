import { createSlice } from "@reduxjs/toolkit";

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

const initialState = {
  posts: [],
  articles: []
}

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    setArticles: (state, action) => {
      state.posts = action.payload
    }
  }
})

export const { setArticles } = articleSlice.actions;
export default articleSlice.reducer;