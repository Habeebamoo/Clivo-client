package middlewares

import (
	"github.com/Habeebamoo/Clivo/server/pkg/utils"

	"github.com/gin-gonic/gin"
)

func AuthenticateUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := c.Cookie("auth_token")
		if err != nil {
			utils.Abort(c, 401, "Token Missing", nil)
			return 
		}

		//verify token
		user, err := utils.ParseToken(token)
		if err != nil {
			utils.Abort(c, 401, utils.FormatText(err.Error()), nil)
			return 
		}

		//call the next middleware
		c.Set("userId", user.UserId)
		c.Next()
	}
}

func VerifyAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := c.Cookie("auth_token")
		if err != nil {
			utils.Abort(c, 401, "Token Missing", nil)
			return 
		}

		//parse token
		admin, err := utils.ParseToken(token)
		if err != nil {
			utils.Abort(c, 401, utils.FormatText(err.Error()), nil)
			return 
		}

		//verify isAdmin
		if admin.Role != "admin" {
			utils.Abort(c, 401, "Unauthorized Access", nil)
			return 
		}

		//calling the next middleware
		c.Set("adminId", admin.UserId)
		c.Next()
	}
}