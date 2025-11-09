package services

import (
	"bytes"
	"fmt"
	"html/template"
	"log"

	"github.com/Habeebamoo/Clivo/server/internal/config"
	"gopkg.in/gomail.v2"
)

type EmailService interface {
	SendWelcomeEmail(string, string, string)
	SendWelcomeEmailToAdmin(string, string, string, string)
}

type EmailSvc struct {}

func NewEmailService() EmailService {
	return &EmailSvc{}
}

//welcome email
type WelcomeEmailData struct {
	Name string
	Email string
	Page string
}

func (ems *EmailSvc) SendWelcomeEmail(userName, userEmail, userUsername string) {
	email, _ := config.Get("EMAIL_SENDER")
	pass, _ := config.Get("EMAIL_PASS")
	clientUrl, _ := config.Get("CLIENT_URL")

	if email == "" || pass == "" || clientUrl == "" {
		log.Fatal("failed to get env variables")
	}

	templ, err := template.ParseFiles("/internal/templates/welcome.html")
	if err != nil {
		log.Fatal(err)
	}

	data := WelcomeEmailData{ 
		Name: userName, 
		Email: userEmail, 
		Page: fmt.Sprintf("%s/%s", clientUrl, userUsername),
	}

	var body bytes.Buffer
	templ.Execute(&body, data)

	m := gomail.NewMessage()
	m.SetHeader("From", m.FormatAddress(email, "Clivo"))
	m.SetHeader("To", userEmail)
	m.SetHeader("Subject", "Welcome To Clivo")
	m.SetBody("text/html", body.String())

	d := gomail.NewDialer("smtp.gmail.com", 465, email, pass)
	d.SSL = true

	if err := d.DialAndSend(m); err != nil {
		log.Fatal(err)
	}

	log.Println("...Welcome Email Sent...")
}

//welcome email to admin
type WelcomeEmailToAdminData struct {
	Name string
	Email string
	Username string
	Interests string
	Profile string
}

func (ems *EmailSvc) SendWelcomeEmailToAdmin(userName, userEmail, userUsername, interests string) {
	email, _ := config.Get("EMAIL_SENDER")
	pass, _ := config.Get("EMAIL_PASS")
	clientUrl, _ := config.Get("CLIENT_URL")

	if email == "" || pass == "" || clientUrl == "" {
		log.Fatal("failed to get env variables")
	}

	templ, err := template.ParseFiles("/internal/templates/adminWelcome.html")
	if err != nil {
		log.Fatal(err)
	}

	data := WelcomeEmailToAdminData{ 
		Name: userName, 
		Email: userEmail, 
		Username: userUsername,
		Interests: interests,
		Profile: fmt.Sprintf("%s/%s", clientUrl, userUsername),
	}

	var body bytes.Buffer
	templ.Execute(&body, data)

	m := gomail.NewMessage()
	m.SetHeader("From", m.FormatAddress(email, "Clivo"))
	m.SetHeader("To", userEmail)
	m.SetHeader("Subject", "Welcome To Clivo")
	m.SetBody("text/html", body.String())

	d := gomail.NewDialer("smtp.gmail.com", 465, email, pass)
	d.SSL = true

	if err := d.DialAndSend(m); err != nil {
		log.Fatal(err)
	}

	log.Println("...Welcome Email To Admin Sent...")
}

