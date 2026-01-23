package utils

import (
	"context"
	crand "crypto/rand"
	"encoding/hex"
	"fmt"
	"log"
	"math"
	mrand "math/rand"
	"mime/multipart"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/Habeebamoo/Clivo/server/internal/config"
	"github.com/gin-gonic/gin"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

func Slugify(title string) string {
	slug := strings.ToLower(title)

	re := regexp.MustCompile(`[^a-z0-9]+`)
	slug = re.ReplaceAllString(slug, "-")

	slug = strings.Trim(slug, "-")
	return slug
}

func GenerateArticleSlug(authorUsername string, articleTitle string) string {
	mrand.Seed(time.Now().UnixNano())
	randomNum := mrand.Intn(1000)
	slug := Slugify(articleTitle)
	return fmt.Sprintf("%s/%s-%d", authorUsername, slug, randomNum)
}

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
	_, err := crand.Read(b)
	if err != nil {
		log.Fatal("failed to read bytes")
	}

	return hex.EncodeToString(b)
}

func GetUserProfile(username string) string {
	clientOrigin, err := config.Get("CLIENT_URL")
	if err != nil {
		log.Fatal(err)
	}

	return fmt.Sprintf("%s/%s", clientOrigin, username)
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

func GetArticleReadTime(content string) int {
	words := strings.Fields(content)
	wordCount := len(words)

	minutes := float64(wordCount) / 200.00

	return int(math.Ceil(minutes))
}

func GetTimeAgo(t time.Time) string {
	duration := time.Since(t)

	switch {
	case duration < time.Minute:
		return "just now"
	case duration < time.Hour:
		return fmt.Sprintf("%d mins ago", int(duration.Minutes()))
	case duration < 24*time.Hour:
		return fmt.Sprintf("%d hours ago", int(duration.Hours()))
	case duration < 30*24*time.Hour:
		return fmt.Sprintf("%d days ago", int(duration.Hours()/24))
	case duration < 12*30*24*time.Hour:
		return fmt.Sprintf("%d months ago", int(duration.Hours()/(24*30)))
	default:
		return fmt.Sprintf("%d years ago", int(duration.Hours()/(24*365)))
	}
}

func UploadImage(file multipart.File) (string, error) {
	cldName, _ := config.Get("CLD_CLOUD_NAME")
	apiKey, _ := config.Get("CLD_API_KEY")
	apiSecret, _ := config.Get("CLD_API_SECRET")

	if cldName == "" || apiKey == "" || apiSecret == "" {
		return "", fmt.Errorf("env variables missing")
	}

	cld, err := cloudinary.NewFromParams(cldName, apiKey, apiSecret)

	if err != nil {
		return "", fmt.Errorf("failed to connect to storage")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	uploadRes, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder: "profile_pics",
	})
	if err != nil {
		return "", fmt.Errorf("upload error")
	}

	return uploadRes.SecureURL, nil
}