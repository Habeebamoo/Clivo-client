package utils

import "github.com/gin-gonic/gin"

type Resp struct {
	Success   bool         `json:"success"`
	Status    int          `json:"status"`
	Message   string       `json:"message,omitempty"`
	Data      interface{}  `json:"data,omitempty"`
}

func Success(c *gin.Context, code int, msg string, data interface{}) {
	c.JSON(code, Resp{Success: true, Status: code, Message: msg, Data: data})
}

func Error(c *gin.Context, code int, msg string, data interface{}) {
	c.JSON(code, Resp{Success: false, Status: code, Message: msg, Data: data})
}

func Abort(c *gin.Context, code int, msg string, data interface{}) {
	c.AbortWithStatusJSON(code, Resp{Success: false, Status: code, Message: msg, Data: data})
}