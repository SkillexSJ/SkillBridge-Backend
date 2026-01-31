# Skill Bridge API Documentation

Welcome to the comprehensive API documentation for the **Skill Bridge** backend. This API powers the mentorship platform, enabling users to schedule sessions, manage profiles, and more.

**Base URL**: `http://localhost:5000/api`

---

## ⚡ Quick API Reference

| Method   | Endpoint             | Description                                    | Access / Role |
| :------- | :------------------- | :--------------------------------------------- | :------------ |
| **AUTH** | `/api/auth/*`        | Better Auth endpoints (sign-in, sign-up, etc.) | Public        |
| **GET**  | `/api/categories`    | List all subject categories                    | Public        |
| **GET**  | `/api/tutors`        | Browse all tutors                              | Public        |
| **POST** | `/api/bookings`      | Book a session with a tutor                    | Student       |
| **GET**  | `/api/users/profile` | Get current user profile                       | Authenticated |
| **GET**  | `/api/admin/stats`   | Get platform statistics                        | Admin         |

---

## 🔐 Auth API (Better Auth)

Authentication is handled securely via **Better Auth**.

| Method | Endpoint                  | Description                             |
| :----- | :------------------------ | :-------------------------------------- |
| `POST` | `/api/auth/sign-up/email` | Register a new user with email/password |
| `POST` | `/api/auth/sign-in/email` | Login with email/password               |
| `POST` | `/api/auth/sign-out`      | Logout the current session              |
| `GET`  | `/api/auth/session`       | Get the current session data            |

### Example: Sign Up

**Request:** `POST /api/auth/sign-up/email`

```json
{
  "email": "student@example.com",
  "password": "securepassword123",
  "name": "John Doe",
  "role": "student"
}
```

**Response:**

```json
{
  "user": {
    "id": "cm0...",
    "email": "student@example.com",
    "emailVerified": false,
    "name": "John Doe",
    "role": "student",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

> **Note**: Refer to [Better Auth Documentation](https://better-auth.com) for full client-side usage.

---

## 📂 Category Management (Admin Only)

Manage the subjects and topics available for tutoring.

| Method   | Endpoint              | Description                        | Role      |
| :------- | :-------------------- | :--------------------------------- | :-------- |
| `POST`   | `/api/categories`     | Create a new category              | **Admin** |
| `DELETE` | `/api/categories/:id` | Delete a category                  | **Admin** |
| `GET`    | `/api/categories`     | Get all categories                 | Public    |
| `GET`    | `/api/categories/:id` | Get details of a specific category | Public    |

### Example: Create Category

**Request:** `POST /api/categories`

```json
{
  "name": "Web Development",
  "topics": ["React", "Node.js", "TypeScript"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "uuid-string",
    "name": "Web Development",
    "topics": ["React", "Node.js", "TypeScript"],
    "createdAt": "2024-08-25T14:30:00Z"
  }
}
```

---

## 📅 Booking Session

Manage booking lifecycles from pending to completion.

| Method  | Endpoint            | Description                                            | Role           |
| :------ | :------------------ | :----------------------------------------------------- | :------------- |
| `POST`  | `/api/bookings`     | Create a new booking request                           | Student        |
| `GET`   | `/api/bookings`     | Get list of my bookings                                | Student, Tutor |
| `GET`   | `/api/bookings/:id` | Get specific booking details                           | Student, Tutor |
| `PATCH` | `/api/bookings/:id` | Update booking status (e.g., `confirmed`, `cancelled`) | Tutor, Student |

### Example: Create Booking

**Request:** `POST /api/bookings`

```json
{
  "tutorProfileId": "tutor-uuid",
  "sessionDate": "2024-09-01T00:00:00.000Z",
  "startTime": "2024-09-01T14:00:00.000Z",
  "endTime": "2024-09-01T15:00:00.000Z",
  "totalPrice": 50
}
```

**Response:**

```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "booking-uuid",
    "status": "pending",
    "sessionDate": "2024-09-01T00:00:00.000Z",
    "totalPrice": "50",
    "studentId": "student-uuid",
    "tutorProfileId": "tutor-uuid"
  }
}
```

---

## 👨‍🏫 Tutor API

Endpoints for tutors to manage their professional profile and availability.

| Method  | Endpoint                   | Description                                | Role      |
| :------ | :------------------------- | :----------------------------------------- | :-------- |
| `GET`   | `/api/tutors/me`           | Get my own tutor profile                   | **Tutor** |
| `PATCH` | `/api/tutors/me`           | Update my tutor profile (bio, rates, etc.) | **Tutor** |
| `PUT`   | `/api/tutors/availability` | Set weekly availability slots              | **Tutor** |
| `GET`   | `/api/tutors/stats`        | Get my performance statistics              | **Tutor** |
| `GET`   | `/api/tutors`              | List all tutors (with filtering)           | Public    |
| `GET`   | `/api/tutors/:id`          | Get public profile of a tutor              | Public    |

### Example: Update Tutor Profile

**Request:** `PATCH /api/tutors/me`

```json
{
  "bio": "Experienced Full Stack Developer with a passion for teaching.",
  "hourlyRate": 60,
  "specialty": "Full Stack Development",
  "expertise": ["React", "Express", "PostgreSQL"]
}
```

### Example: Set Availability

**Request:** `PUT /api/tutors/availability`

```json
{
  "slots": [
    {
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "12:00"
    },
    {
      "dayOfWeek": 3,
      "startTime": "14:00",
      "endTime": "18:00"
    }
  ]
}
```

---

## 🎓 Student (User) API

General user management and student-specific features.

| Method  | Endpoint                   | Description                      | Role          |
| :------ | :------------------------- | :------------------------------- | :------------ |
| `GET`   | `/api/users/profile`       | Get current user profile details | Authenticated |
| `PATCH` | `/api/users/profile`       | Update profile information       | Authenticated |
| `POST`  | `/api/users/profile/image` | Upload a profile picture         | Authenticated |
| `GET`   | `/api/users/stats`         | Get student dashboard stats      | **Student**   |
| `POST`  | `/api/reviews`             | Leave a review for a session     | **Student**   |

### Example: Update Profile

**Request:** `PATCH /api/users/profile`

```json
{
  "name": "Jane Doe",
  "image": "https://cloudinary.com/..."
}
```

---

## 🛡️ Administrative (Admin Only)

Platform-wide management and oversight.

| Method  | Endpoint               | Description                    | Role      |
| :------ | :--------------------- | :----------------------------- | :-------- |
| `GET`   | `/api/admin/stats`     | View global platform analytics | **Admin** |
| `GET`   | `/api/admin/users`     | List all registered users      | **Admin** |
| `PATCH` | `/api/admin/users/:id` | Block or unblock a user        | **Admin** |

---

## 🧪 Testing Flow

Follow this sequence to manually test the core user journey:

1.  **Preparation**:
    - Ensure server is running (`pnpm dev`).
    - Seed the database with an admin (`pnpm seed:admin`).

2.  **Tutor Setup**:
    - Register a new user (Tutor).
    - Create a Tutor Profile (`POST /api/tutors`).
    - Set availability (`PUT /api/tutors/availability`).

3.  **Student Journey**:
    - Register a new user (Student).
    - Browse categories (`GET /api/categories`) and tutors (`GET /api/tutors`).
    - Book a session (`POST /api/bookings`).

4.  **Booking Lifecycle**:
    - Tutor logs in -> Sees pending booking -> Confirms it (`PATCH /api/bookings/:id`).
    - (Optional) Session completes -> Student leaves a review (`POST /api/reviews`).

5.  **Admin Check**:
    - Login as Admin.
    - View stats (`GET /api/admin/stats`) to see the new Booking and User counts.
