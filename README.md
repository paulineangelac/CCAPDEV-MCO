# CCAPDEV-MCO
Major Course Output for CCAPDEV 

This website is a computer laboratory reservation system. 

### Features
- Register DLSU emails to create an account
- Log in or log out
- View slot availability
- Reserve slots that have not been taken
- Reserve for a student
- Cancel reservations
- Edit reservations
- View all reservations
- View, edit, and delete user profile
- Search for users and free slots.

## Installation
1. Run `npm install`
2. Run the application `npm start`
3. Go to http://localhost:3000 

## Project Structure
CCAPDEV-MCO/
│
├── controllers/                # Handles request logic
│   ├── LabTechController.js
│   ├── LoginController.js
│   ├── ReserveController.js
│   ├── SearchController.js
│   └── SignUpController.js
│
├── db/                         # Database configuration
│   └── conn.js
│
├── models/                     # Database schemas / data models
│   ├── BookedRooms.js
│   ├── ContactMessage.js
│   ├── LabTech.js
│   ├── room.json              # Static room data
│   ├── Rooms.js
│   └── User.js
│
public/
│
├── css/
│   ├── AdminDashboardPage.css
│   ├── FAQsPage.css
│   ├── IndexPage.css
│   ├── LabTechDashboardPage.css
│   ├── LoginPage.css
│   ├── ReservationPage.css
│   ├── SignUpPage.css
│   ├── StudentDashboardPage.css
│   └── StudentProfile.css
│
├── js/
│   ├── AdminDashboardPage.js
│   ├── FAQsPage.js
│   ├── IndexPage.js
│   ├── LabTechReservationPage.js
│   ├── LoginPage.js
│   ├── Logout.js
│   ├── ReservationPage.js
│   ├── SignUp.js
│   ├── StudentDashboardPage.js
│   ├── StudentProfile.js
│   └── ViewProfilePage.js
│
├── pictures/
│   ├── bron.jpg
│   ├── cat2.jpeg
│   ├── faqs.png
│   ├── indexbg.jpg
│   ├── loginbg.jpg
│   ├── pclab1.jpg
│   ├── pclab2.jpg
│   └── pclab3.jpg
│
├── views/                      # Handlebars (.hbs) templates
│   ├── AdminDashboardPage.hbs
│   ├── EditReservation.hbs
│   ├── FAQsPage.hbs
│   ├── index.hbs
│   ├── LabTechDashboardPage.hbs
│   ├── LabTechEditReservation.hbs
│   ├── LabTechProfilePage.hbs
│   ├── LabTechReservationPage.hbs
│   ├── LoginPage.hbs
│   ├── ReservationPage.hbs
│   ├── SignUpPage.hbs
│   ├── StudentDashboardPage.hbs
│   ├── StudentProfilePage.hbs
│   └── ViewProfilePage.hbs
│
├── node_modules/               # Installed dependencies (auto-generated)
│
├── .env                        # Environment variables
├── .gitignore                  # Git ignored files
├── package.json                # Project metadata & dependencies
└── server.js                   # Main entry point

## Technologies Used
- Node.js
- Express
- MongoDB
- Handlebars
- Bootstrap
- CSS

## Credits
- Cunanan, Eduardo Jr. Y.
- Licup, Evan Gabriel F.
- Mariazeta, Cameron Kylie S.
- Novera, Pauline Angela C.