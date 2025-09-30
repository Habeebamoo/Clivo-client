package utils

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

func FormatText(text string) string {
	caser := cases.Title(language.English)

	firstChar := text[:1]
	restChars := text[1:]

	return caser.String(firstChar) + restChars
}

func SetCookies(c *gin.Context, token string) {
	http.SetCookie(c.Writer, &http.Cookie{
		Name: "auth_token",
		Value: token,
		Path: "/",
		Domain: "",
		Expires: time.Now().Add(1*time.Hour),
		MaxAge: 3600,
		Secure: false, //true for production
		HttpOnly: true,
	})
}

func GenerateRandomId() string {
	b := make([]byte, 16)
	_, err := rand.Read(b)
	if err != nil {
		log.Fatal("failed to read bytes")
	}

	return hex.EncodeToString(b)
}

func GetUsernameFromEmail(email string) string {
	local := strings.SplitN(email, "@", 2)[0]
	return "@" + local
}

func GenerateUniqueUsername(base string, exists func(string) bool) string {
	username := base
	i := 1

	for exists(username) {
		username = fmt.Sprintf("%s%d", username, i)
		i++
	}

	return username
}