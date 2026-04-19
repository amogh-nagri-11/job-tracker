# Job Tracker

A full-stack MERN web application for tracking job applications.

## Features
- JWT authentication with HttpOnly cookies
- Email verification on registration
- Forgot/reset password flow
- Add, edit, delete job applications
- Filter by status (Applied, Interview, Offer, Rejected)
- Profile management
- Mail tracking via forwarded emails

## Tech Stack
- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Auth:** JWT, bcryptjs
- **Email:** Nodemailer

## Live Demo
[https://job-tracker-lovat-ten.vercel.app/](https://job-tracker-lovat-ten.vercel.app/)

## Local Setup
```bash
# clone the repo
git clone https://github.com/amogh-nagri-11/job-tracker.git

# setup server
cd server
npm install
cp .env.example .env  # fill in your values
npm run dev

# setup client
cd client
npm install
npm run dev
```

## Environment Variables
See `.env.example` in the server folder.