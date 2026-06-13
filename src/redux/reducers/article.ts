import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [] as any[],
  articles: [] as any[],
  userArticle: [] as any[],
  articleComments: [] as any[],
};

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
      state.userArticle = action.payload;
    },
    setArticleComments: (state, action) => {
      state.articleComments = action.payload;
    },
  },
});

export const { setPosts, setArticles, setUserArticle, setArticleComments } =
  articleSlice.actions;
export default articleSlice.reducer;
