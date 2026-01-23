package models

import (
	"encoding/json"
	"fmt"
	"mime/multipart"
	"time"
)

type Article struct {
	ArticleId       string           `json:"articleId"`
	AuthorId        string           `json:"authorId"`
	Title           string           `json:"title"`
	Content         json.RawMessage  `json:"content"`
	Picture         string           `json:"picture"`
	ReadTime        string           `json:"readTime"`
	Slug            string           `json:"slug"`
	CreatedAt       time.Time        `json:"createdAt"`
}

type ArticleTags struct {
	ArticleId  string  `json:"articleId"`
	Tag        string  `json:"tag"`
}

type Like struct {
	ArticleId    string  `json:"articleId"`
	LikerUserId  string  `json:"likerUserId"`
}

type Comment struct {
	CommentId  string  `json:"commentId"`
	ArticleId  string  `json:"articleId"`
	UserId     string  `json:"userId"`
	ReplyId    string  `json:"replyId"`
	Replys     int     `json:"replys"`
	Content    string  `json:"content"`
}

type ArticleResponse struct {
	ArticleId        string            `json:"articleId"`
	AuthorId          string           `json:"authorId"`
	AuthorPicture     string           `json:"authorPicture"`
	AuthorFullname    string           `json:"authorFullname"`
	AuthorProfileUrl  string           `json:"authorProfileUrl"`
	AuthorVerified    bool             `json:"authorVerified"`
	Title             string           `json:"title"`
	Content           json.RawMessage  `json:"content"`
	Picture           string           `json:"picture"`
	Tags              []string         `json:"tags"`
	Likes             int              `json:"likes"`
	ReadTime          string           `json:"readTime"`
	Slug              string           `json:"slug"`
	CreatedAt         string           `json:"createdAt"`
}

type EditorJSBlock struct {
	Type string `json:"type"`
	Data struct {
		Text string `json:"text,omitempty"`
	} `json:"data"`
}

type EditorJSContent struct {
	Blocks []EditorJSBlock `json:"blocks"`
}

type CommentResponse struct {
	CommentId  string  `json:"commentId"`
	ArticleId  string  `json:"articleId"`
	Content    string  `json:"content"`
	Replys     int     `json:"replys"`
	Name       string  `json:"name"`
	Username   string  `json:"username"`
	Verified   bool    `json:"verified"`
	Picture    string  `json:"picture"`
}

type SafeArticleResponse struct {
	ArticleId         string           `json:"articleId"`
	AuthorPicture     string           `json:"authorPicture"`
	AuthorFullname    string           `json:"authorFullname"`
	AuthorProfileUrl  string           `json:"authorProfileUrl"`
	AuthorBio         string           `json:"authorBio"`
	AuthorVerified    bool             `json:"authorVerified"`
	Title             string           `json:"title"`
	Content           json.RawMessage  `json:"content"`
	Picture           string           `json:"picture"`
	Tags              []string         `json:"tags"`
	Likes             int              `json:"likes"`
	ReadTime          string           `json:"readTime"`
	Slug              string           `json:"slug"`
	CreatedAt         string     				`json:"createdAt"`
}

type ArticleRequest struct {
	Title    string           `json:"title"`
	Content  json.RawMessage  `json:"content"`
	Picture  *multipart.File  `json:"picture"`
	Tags     []string         `json:"tags"`
}

type CommentRequest struct {
	ArticleId  string  `json:"articleId"`
	UserId     string  `json:"userId"`
	Content    string  `json:"content"`
}

type ReplyRequest struct {
	CommentId  string  `json:"commentId"`
	ArticleId  string  `json:"articleId"`
	UserId     string  `json:"userId"`
	Content    string  `json:"content"`
}

func (l Like) Validate() error {
	if l.ArticleId == "" {
		return fmt.Errorf("missing field: articleId")
	} else if l.LikerUserId == "" {
		return fmt.Errorf("missing field: userId")
	}
	return nil
}

func (c CommentRequest) Validate() error {
	if c.ArticleId == "" {
		return fmt.Errorf("missing field: articleId")
	} else if c.UserId == "" {
		return fmt.Errorf("missing field: userId")
	} else if c.Content == "" {
		return fmt.Errorf("missing field: comment")
	}
	return nil
}

func (r ReplyRequest) Validate() error {
	if r.ArticleId == "" {
		return fmt.Errorf("missing field: articleId")
	} else if r.CommentId == "" {
		return fmt.Errorf("missing field: commentId")
	} else if r.UserId == "" {
		return fmt.Errorf("missing field: userId")
	} else if r.Content == "" {
		return fmt.Errorf("missing field: comment")
	}
	return nil
}
