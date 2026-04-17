# LiftLog

LiftLog is a mobile fitness tracking app built to help users plan workouts, log training sessions, and monitor progress over time. The project was designed as a portfolio-grade full-stack application with a production mindset: clean architecture, scalable backend structure, and a polished mobile experience.

## Features

### Authentication

* User registration and login
* JWT-based authentication
* Persistent session handling on mobile

### Exercise Library

* Search exercises by name
* Filtered exercise retrieval from backend
* Muscle group and equipment categorization

### Workout Builder

* Create workout drafts
* Add and remove exercises
* Prevent duplicate exercise selection
* Reorder exercises

### Workout Logging

* Log sets, reps, and weight
* Edit or remove sets during active workout
* Save completed sessions

### Workout History

* View previous workouts
* Inspect workout details
* Session summaries with totals

### Progress Analytics

* Track exercise progression over time
* Personal record indicators
* Recent performance visualization

## Tech Stack

### Mobile

* React Native (Expo)
* TypeScript
* React Navigation
* Zustand
* Axios
* AsyncStorage
* react-native-safe-area-context

### Backend

* Node.js
* Express
* TypeScript
* PostgreSQL
* Prisma ORM
* JWT Authentication

### Deployment

* Backend hosted on Render
* Database hosted on Supabase

## Project Structure

```bash
liftlog/
├── apps/
│   ├── mobile/
│   └── server/
```

## Backend Highlights

* REST API architecture
* Prisma schema with relational workout models
* Cursor pagination for exercise search
* Protected routes with authentication middleware
* Jest + Supertest test coverage

## Current Status

LiftLog currently supports the full MVP workflow:

Auth → Exercise Library → Workout Builder → Log Sets → Finish Workout → Summary → History

The backend is deployed and connected to production infrastructure, while the mobile app is fully functional and being polished for TestFlight release.

## Future Improvements

* Improved analytics depth
* Exercise presets / templates
* Social features
* Advanced PR tracking
* Push notifications

## Why This Project

LiftLog was built as a serious capstone project to demonstrate full-stack mobile development, production-oriented architecture, and clean implementation choices across frontend and backend.

## Author

Andrew Villavera
