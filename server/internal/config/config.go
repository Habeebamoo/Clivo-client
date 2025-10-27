package config

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var OauthConfig *oauth2.Config

func Initialize() {
	//load environment variables
	godotenv.Load()

	//initialize google credentials
	clientID, _ := Get("GOOGLE_CLIENT_ID")
	clientSecret, _ := Get("GOOGLE_CLIENT_SECRET")
	redirectURL, _ := Get("GOOGLE_REDIRECT_URL")

	if clientID == "" || clientSecret == "" || redirectURL == "" {
		log.Fatal("failed to load google env variables")
	}

	OauthConfig = &oauth2.Config{
		ClientID: clientID,
		ClientSecret: clientSecret,
		RedirectURL: redirectURL,
		Scopes: []string{"openid", "profile", "email"},
		Endpoint: google.Endpoint,
	}
}

func Get(key string) (string, error) {
	value := os.Getenv(key)
	if value == "" {
		return "", fmt.Errorf("%s does not exists", strings.ToLower(key))
	}
	return value, nil
}