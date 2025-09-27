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
	CreatedAt       time.Time  `json:"createdAt"`
}

type ArticleResponse struct {
	ArticleId       string     `json:"articleId"`
	AuthorId        string     `json:"authorId"`
	AuthorPicture   string     `json:"authorPicture"`
	AuthorFullname  string     `json:"authorFullname"`
	AuthorVerified  bool     `json:"authorVerified"`
	Title           string     `json:"title"`
	Content         string     `json:"content"`
	Picture         string     `json:"picture"`
	Tags            []string   `json:"tags"`
	Likes           int        `json:"likes"`
	ReadTime        string     `json:"readTime"`
	CreatedAt       time.Time  `json:"createdAt"`
}

type ArticleRequest struct {
	UserId   string           `json:"userId"`  //not required in production
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
	}
	return nil
}

