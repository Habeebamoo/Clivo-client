package middlewares

import (
	"fmt"

	"github.com/Habeebamoo/Clivo/server/pkg/utils"
	"github.com/gin-gonic/gin"
)

func CustomRecovery() gin.HandlerFunc {
	return gin.RecoveryWithWriter(gin.DefaultErrorWriter, func(c *gin.Context, err any) {
		utils.Abort(c, 500, fmt.Sprint(err), nil) // change in prod
	})
}