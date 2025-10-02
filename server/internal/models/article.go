package models

import (
	"fmt"
	"mime/multipart"
	"time"
)

type Article struct {
	ArticleId       string     `json:"articleId"`
	AuthorId        string     `json:"authorId"`
	Title           string     `json:"title"`
	Content         string     `json:"content"`
	Picture         string     `json:"picture"`
	ReadTime        string     `json:"readTime"`
	Slug            string     `json:"slug"`
	CreatedAt       time.Time  `json:"createdAt"`
}

type Tag struct {
	ArticleId  string  `json:"articleId"`
	Tag        string  `json:"tag"`
}

type Like struct {
	ArticleId    string  `json:"articleId"`
	LikerUserId  string  `json:"likerUserId"`
}

type Comment struct {
	ArticleId        string  `json:"articleId"`
	CommenterUserId  string  `json:"commenterUserId"`
	Content          string  `json:"content"`
}

type ArticleResponse struct {
	ArticleId       string     `json:"articleId"`
	AuthorId        string     `json:"authorId"`
	AuthorPicture   string     `json:"authorPicture"`
	AuthorFullname  string     `json:"authorFullname"`
	AuthorVerified  bool       `json:"authorVerified"`
	Title           string     `json:"title"`
	Content         string     `json:"content"`
	Picture         string     `json:"picture"`
	Tags            []string   `json:"tags"`
	Likes           int        `json:"likes"`
	ReadTime        string     `json:"readTime"`
	Slug            string     `json:"slug"`
	CreatedAt       time.Time  `json:"createdAt"`
}

type CommentResponse struct {
	ArticleId  string  `json:"articleId"`
	Content    string  `json:"content"`
	Name       string  `json:"name"`
	Username   string  `json:"username"`
	Verified   bool    `json:"verified"`
	Picture    string  `json:"picture"`
}

type SafeArticleResponse struct {
	ArticleId       string     `json:"articleId"`
	AuthorPicture   string     `json:"authorPicture"`
	AuthorFullname  string     `json:"authorFullname"`
	AuthorVerified  bool       `json:"authorVerified"`
	Title           string     `json:"title"`
	Content         string     `json:"content"`
	Picture         string     `json:"picture"`
	Tags            []string   `json:"tags"`
	Likes           int        `json:"likes"`
	ReadTime        string     `json:"readTime"`
	Slug            string     `json:"slug"`
	CreatedAt       time.Time  `json:"createdAt"`
}

type ArticleRequest struct {
	Title    string           `json:"title"`
	Content  string           `json:"content"`
	Picture  *multipart.File  `json:"picture"`
	Tags     []string         `json:"tags"`
}

func (a ArticleRequest) Validate() error {
	if a.Title == "" {
		return fmt.Errorf("missing field: title")
	} else if a.Content == "" {
		return fmt.Errorf("missing field: content")
	} else if len(a.Tags) == 0 {
		return fmt.Errorf("missing field: tags")
	}
	return nil
}

func (l Like) Validate() error {
	if l.ArticleId == "" {
		return fmt.Errorf("missing field: articleId")
	} else if l.LikerUserId == "" {
		return fmt.Errorf("missing field: userId")
	}
	return nil
}

func (c Comment) Validate() error {
	if c.ArticleId == "" {
		return fmt.Errorf("missing field: articleId")
	} else if c.CommenterUserId == "" {
		return fmt.Errorf("missing field: userId")
	} else if c.Content == "" {
		return fmt.Errorf("missing field: comment")
	}
	return nil
}
