import { createSlice } from "@reduxjs/toolkit";

export interface Post {
  articleId: string,
  authorPicture: string,
  authorFullname: string,
  authorProfileUrl: string,
  authorBio: string,
  authorVerified: boolean,
  title: string,
  content: any,
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
  authorProfileUrl: string,
  authorVerified: boolean,
  title: string,
  content: any,
  picture?: string,
  tags: string[],
  likes: number,
  readTime: string,
  slug: string,
  createdAt: string
}

const initialState = {
  posts: [],           //feeds & fyp
  articles: [],        //user's article(s)
  userArticle: [],     //user's or someone's article
  articleComments: []  //any article comments
}

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setArticles: (state, action) => {
      state.articles = action.payload;
    },
    setUserArticle: (state, action) => {
      state.userArticle = action.payload
    },
    setArticleComments: (state, action) => {
      state.articleComments = action.payload
    }
  }
})

export const { setPosts, setArticles, setUserArticle, setArticleComments } = articleSlice.actions;
export default articleSlice.reducer;