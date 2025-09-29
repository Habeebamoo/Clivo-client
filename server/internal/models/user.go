package models

import (
	"fmt"
	"time"
)

type User struct {
	UserId     string     `json:"userId"`
	Name       string     `json:"name"`
	Email      string     `json:"email"`
	Role       string     `json:"role"`
	Verified   bool       `json:"verified"`
	CreatedAt  time.Time  `json:"createdAt"`
}

type Profile struct {
	UserId       string  `json:"userId"`
	Username     string  `json:"username"`
	Bio          string  `json:"bio"`
	Picture      string  `json:"picture"`
	Interests    string  `json:"interests"`
	ProfileLink  string  `json:"profileLink"`
	Following    int     `json:"following"`
	Followers    int     `json:"followers"`
}

type UserRequest struct {
	Name       string     `json:"name"`
	Email      string     `json:"email"`
	Picture    string     `json:"picture"`
	Interets   []string   `json:"interests"`
}

type UserResponse struct {
	UserId       string     `json:"userId"`
	Name         string     `json:"name"`
	Email        string     `json:"email"`
	Role         string     `json:"role"`
	Verified     bool       `json:"verified"`
	Username     string     `json:"username"`
	Bio          string     `json:"bio"`
	Picture      string     `json:"picture"`
	Interests    string     `json:"interests"`
	ProfileLink  string     `json:"profileLink"`
	Following    int        `json:"following"`
	Followers    int        `json:"followers"`
	CreatedAt    time.Time  `json:"createdAt"`
}

func (u UserRequest) Validate() error {
	if len(u.Interets) == 0 {
		return fmt.Errorf("missing field: user interests")
	}
	return nil
}