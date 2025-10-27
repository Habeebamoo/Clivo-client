package models

type TokenPayload struct {
	UserId  string  `json:"userId"`
	Role    string  `json:"role"`
}

type UserPayload struct {
	Name     string  `json:"name"`
	Email    string  `json:"email"`
	Picture  string  `json:"picture"`
}