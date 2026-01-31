<div align="center">
  <br />
    <a href="https://github.com/Start-Impact/skill-bridge-backend" target="_blank">
      <img align="center" width="175" height="170" style="object-fit: cover;" src="skill.png" alt="Project Banner">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/-Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
    <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/-Better%20Auth-CA8A04?style=for-the-badge&logo=shield&logoColor=white" alt="Better Auth" />
    <img src="https://img.shields.io/badge/-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />

  </div>

  <h3 align="center">Skill Bridge Backend</h3>

   <div align="center">
    Connect with Expert Tutors, Learn Anything.
    </div>
</div>

## 📋 <a name="table">Table of Contents</a>

1. [Overview](#overview)
2. [Key Features](#features)
3. [Tech Stack](#tech-stack)
4. [Database Architecture](#database-architecture)
5. [Project Structure](#project-structure)
6. [API Documentation](#api-documentation)
7. [Quick Start](#quick-start)

## <a name="overview">Overview</a>

**Skill Bridge** is a comprehensive backend API designed to power a robust mentorship platform. It facilitates connections between students and tutors, handling everything from user authentication and profile management to session scheduling and reviews. Built with performance and scalability in mind, it leverages a modern stack to ensure a seamless experience for all users.

## <a name="features">Key Features</a>

- **🔐 Secure Authentication**: Robust user authentication and management using **Better Auth**, supporting multiple roles (Student, Tutor, Admin).
- **📅 Dynamic Scheduling**: Real-time booking system allowing students to schedule sessions based on tutor availability.
- **👨‍🏫 Tutor Management**: Detailed tutor profiles with expertise info, hourly rates, and availability slots.
- **🕵️ Advanced Search**: Category-based filtering to help students find the perfect mentor.
- **⭐ Review System**: Transparent feedback loop with ratings and reviews for completed sessions.
- **📧 Email Notifications**: Integrated email service (Nodemailer) for booking confirmations and updates.
- **☁️ Cloud Storage**: Media management using Cloudinary for profile pictures and assets.

## <a name="tech-stack">The Tech Stack</a>

| Component     | Technology                                                                                                                                                                                   | Description                                                 |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------- |
| **Runtime**   | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)                                                                                     | JavaScript runtime built on Chrome's V8 engine.             |
| **Framework** | ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)                                                                                       | Fast, unopinionated, minimalist web framework for Node.js.  |
| **Language**  | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)                                                                              | Typed superset of JavaScript for better tooling and safety. |
| **Database**  | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)                                                                              | Powerful, open source object-relational database system.    |
| **ORM**       | ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)                                                                                          | Next-generation ORM for Node.js and TypeScript.             |
| **Auth**      | <div style="display: flex; align-items: center; gap: 8px;"><img src="https://github.com/better-auth.png" width="20" height="20" alt="Better Auth Logo" /> <strong>Better Auth</strong></div> | Comprehensive authentication solution.                      |
| **Storage**   | ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)                                                                              | Cloud-based image and video management.                     |

## <a name="database-architecture">Database Architecture</a>

The database is normalized and designed to support complex relationships between users, bookings, and content.

```mermaid
erDiagram
    User ||--|| TutorProfile : "has (if tutor)"
    User ||--o{ Booking : "makes (as student)"
    User ||--o{ Review : "writes"
    User ||--o{ Session : "has"
    User ||--o{ Account : "has"

    Category ||--o{ TutorProfile : "classifies"

    TutorProfile ||--o{ Booking : "receives"
    TutorProfile ||--o{ Review : "receives"
    TutorProfile ||--o{ AvailabilitySlot : "defines"

    Booking ||--|| Review : "has"

    User {
        String id PK
        String email
        String role
        Boolean isBlocked
    }

    TutorProfile {
        String id PK
        String userId FK
        String categoryId FK
        String bio
        Decimal hourlyRate
    }

    Booking {
        String id PK
        String studentId FK
        String tutorProfileId FK
        DateTime sessionDate
        Enum status
    }

    Category {
        String id PK
        String name
    }

    AvailabilitySlot {
        String id PK
        String tutorProfileId FK
        Int dayOfWeek
        DateTime startTime
        DateTime endTime
    }
```

## <a name="project-structure">Project Structure</a>

The project follows a modular and scalable structure.

```bash
skill-bridge-backend/
├── prisma/                 # Database schema and migrations
│   ├── schema/             # Split schema files
│   └── migrations/         # History of database changes
├── src/
│   ├── api/                # API routes and controllers
│   ├── lib/                # Shared libraries and utilities
│   ├── modules/            # Feature-based modules (Users, Bookings, etc.)
│   ├── scripts/            # Admin seeding and maintenance scripts
│   ├── static/             # Static assets
│   └── server.ts           # Application entry point
├── .env.example            # Example environment variables
├── package.json            # Project dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## <a name="api-documentation">API Documentation</a>

Detailed documentation for all API endpoints is available separately.

👉 **[Explore API Documentation](docs/API.md)**

## <a name="backend-architecture">Backend Architecture</a>

The following diagram illustrates the request flow through the system:

```mermaid
graph TD
    Client["Client (Frontend/Postman)"]

    subgraph Server [Express Server]
        Middleware["Auth Middleware (Better Auth)"]
        Router["Modular Routes (User, Tutor, Booking...)"]
        Controller["Controllers"]
        Service["Services (Business Logic)"]
    end

    Database[("PostgreSQL Database")]

    Client -->|HTTP Request| Middleware
    Middleware -->|Authenticated Request| Router
    Router -->|Route Handler| Controller
    Controller -->|Process Data| Service
    Service -->|Prisma ORM| Database
    Database -->|Data| Service
    Service -->|Result| Controller
    Controller -->|JSON Response| Client

    style Client fill:#f9f,stroke:#333,stroke-width:2px
    style Database fill:#bbf,stroke:#333,stroke-width:2px
    style Middleware fill:#bfb,stroke:#333,stroke-width:1px
```

## <a name="quick-start">Quick Start</a>

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js** (v18+)
- **pnpm** (preferred package manager)
- **PostgreSQL** (Local or Cloud instance)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/skill-bridge-backend.git
   cd skill-bridge-backend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up Environment Variables**

   ```bash
   cp .env.example .env
   # Open .env and configure your database URL, cloud keys, and auth secrets
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Push schema to database
   npx prisma migrate dev --name init
   ```

5. **Seed the Database**

   ```bash
   pnpm seed:admin
   ```

6. **Run the Server**

   ```bash
   pnpm dev
   ```

   The server will start at `http://localhost:5000` (or your configured port).

---

<div align="center">
  <br />
  <strong>Made with ❤️ by Sajid Khan</strong>
</div>
