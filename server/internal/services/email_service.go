package services

import (
	"fmt"
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

func (ems *EmailSvc) SendWelcomeEmail(userName, userEmail, userUsername string) {
	email, _ := config.Get("EMAIL_SENDER")
	pass, _ := config.Get("EMAIL_PASS")
	clientUrl, _ := config.Get("CLIENT_URL")

	if email == "" || pass == "" || clientUrl == "" {
		panic("failed to get env variables")
	}

	html := fmt.Sprintf(`
		<!DOCTYPE html>
		<html lang="en">
			<body style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 10px; margin: 0;">
				<table width="100%%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
					<!-- logo -->
					<tr>
						<td style="padding: 20px; display: flex; align-items: center; gap: 10px;">
							<img src="https://res.cloudinary.com/djvuchlcr/image/upload/c_fill,h_150,w_150/v1/profile_pics/fukp4ijlrcz9ojzrmy25?_a=AQAV6nF" style="height: 40px">
							<h1 style="font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Clivo</h1>
						</td>
					</tr>

					<tr>
						<td style="padding: 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
							<p>Hi %s</p>
							<p>Welcome to Clivo. we're excited to have you join our growing community of thinkers, writers, and readers.</p>

							<div style="line-height: 1.5;">
								<p>Here's what you can do next.</p>
								<p>&#9989; <span style="font-weight: bold;">Create</span> your first post and share your thoughts with the world.</p>
								<p>&#9989; <span style="font-weight: bold;">Discover</span> inspiring content from others who share your interests.</p>
								<p>&#9989; <span style="font-weight: bold;">Engage</span> with the community - like, comment and connect.</p>
							</div>

							<div style="line-height: 0.4; margin-top: 30px;">
								<p>Ready to start writing?</p>
								<p>Click the button below to create your first aticle.</p>
							</div>
							<p style="margin: 50px 0;">
								<a href="%s" style="background-color: rgb(20,20,20); color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">Create Article</a>
							</p>
						</td>
					</tr>

					<tr>
						<td style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 14px; color: #888888; line-height: 0;">
							<p style="font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;">from</p>

							<div style="display: flex; align-items: center; gap: 3px; justify-content: center;">
								<img src="https://res.cloudinary.com/djvuchlcr/image/upload/c_fill,h_150,w_150/v1/profile_pics/fukp4ijlrcz9ojzrmy25?_a=AQAV6nF" style="height: 15px">
								<p style="font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; color: black; font-weight: bold;">Clivo</p>  
							</div>

							<p style="font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif">
								This message was sent to 
								<span style="text-decoration: underline;">%s</span>
							</p>
						</td>
					</tr>
				</table>
			</body>
		</html>
	`, userName, fmt.Sprintf("%s/home/create", clientUrl), userEmail)

	// templContent, err := templatesFS.ReadFile(fmt.Sprintf("templates/%s", "welcome.html"))
	// if err != nil {
	// 	panic(err)
	// }

	// templ, err := template.New("welcome.html").Parse(string(templContent))
	// if err != nil {
	// 	panic(err)
	// }

	// data := struct{
	// 	Name string
	// 	Email string
	// 	Page string
	// } { 
	// 	Name: userName, 
	// 	Email: userEmail, 
	// 	Page: fmt.Sprintf("%s/%s", clientUrl, userUsername),
	// }

	// var body bytes.Buffer
	// templ.Execute(&body, data)

	m := gomail.NewMessage()
	m.SetHeader("From", m.FormatAddress(email, "Clivo"))
	m.SetHeader("To", userEmail)
	m.SetHeader("Subject", "Welcome To Clivo")
	m.SetBody("text/html", html)

	d := gomail.NewDialer("smtp.gmail.com", 465, email, pass)
	d.SSL = true

	if err := d.DialAndSend(m); err != nil {
		panic(err)
	}

	log.Println("...Welcome Email Sent...")
}

//welcome email to admin
func (ems *EmailSvc) SendWelcomeEmailToAdmin(userName, userEmail, userUsername, interests string) {
	email, _ := config.Get("EMAIL_SENDER")
	pass, _ := config.Get("EMAIL_PASS")
	clientUrl, _ := config.Get("CLIENT_URL")

	if email == "" || pass == "" || clientUrl == "" {
		panic("failed to get env variables")
	}

	html := fmt.Sprintf(`
		<!DOCTYPE html>
		<html lang="en">
			<body style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 10px; margin: 0;">
				<table width="100%%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
					<!-- logo -->
					<tr>
						<td style="padding: 20px; display: flex; align-items: center; gap: 10px;">
							<img src="https://res.cloudinary.com/djvuchlcr/image/upload/c_fill,h_150,w_150/v1/profile_pics/fukp4ijlrcz9ojzrmy25?_a=AQAV6nF" style="height: 40px">
							<h1 style="font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">Clivo</h1>
						</td>
					</tr>

					<tr>
						<td style="padding: 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
							<p>Good day Habeeb</p>
							<p>A new user recently signed up on Clivo. Below are the user details</p>

							<div style="line-height: 1.5;">
								<p>&#9989; <span style="font-weight: bold;">Name: </span>%s</p>
								<p>&#9989; <span style="font-weight: bold;">Email: </span>%s</p>
								<p>&#9989; <span style="font-weight: bold;">Username: </span>%s</p>
							</div>

							<p style="margin-top: 20px;">To view more about this user, click on the button below to visit the user's profile</p>

							<p style="margin: 50px 0;">
								<a href="%s style="background-color: rgb(20,20,20); color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">View Profile</a>
							</p>
						</td>
					</tr>

					<tr>
						<td style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 14px; color: #888888; line-height: 0;">
							<p style="font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;">from</p>

							<div style="display: flex; align-items: center; gap: 3px; justify-content: center;">
								<img src="https://res.cloudinary.com/djvuchlcr/image/upload/c_fill,h_150,w_150/v1/profile_pics/fukp4ijlrcz9ojzrmy25?_a=AQAV6nF" style="height: 15px">
								<p style="font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; color: black; font-weight: bold;">Clivo</p>  
							</div>
							<p style="font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif">
								<span>This message was sent to</span>
								<span style="text-decoration: underline;">habeebamoo08@gmail.com</span>
							</p>
						</td>
					</tr>
				</table>
			</body>
		</html>
	`, userName, userEmail, userUsername, fmt.Sprintf("%s/%s", clientUrl, userUsername))

	// templContent, err := templatesFS.ReadFile(fmt.Sprintf("templates/%s", "adminWelcome.html"))
	// if err != nil {
	// 	panic(err)
	// }

	// templ, err := template.New("adminWelcome.html").Parse(string(templContent))
	// if err != nil {
	// 	panic(err)
	// }

	// data := struct {
	// 	Name string
	// 	Email string
	// 	Username string
	// 	Interests string
	// 	Profile string
	// } { 
	// 	Name: userName, 
	// 	Email: userEmail, 
	// 	Username: userUsername,
	// 	Interests: interests,
	// 	Profile: fmt.Sprintf("%s/%s", clientUrl, userUsername),
	// }

	// var body bytes.Buffer
	// templ.Execute(&body, data)

	m := gomail.NewMessage()
	m.SetHeader("From", m.FormatAddress(email, "Clivo"))
	m.SetHeader("To", userEmail)
	m.SetHeader("Subject", "Welcome To Clivo")
	m.SetBody("text/html", html)

	d := gomail.NewDialer("smtp.gmail.com", 465, email, pass)
	d.SSL = true

	if err := d.DialAndSend(m); err != nil {
		panic(err)
	}

	log.Println("...Welcome Email To Admin Sent...")
}

