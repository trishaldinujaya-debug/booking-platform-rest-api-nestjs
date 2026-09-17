# Booking Platform REST API

A production-style REST API for managing services and customer bookings, built with **NestJS, TypeScript, PostgreSQL, and Prisma 8**.

The project includes JWT authentication, service management, booking workflows, validation, business rules, pagination, filtering, Swagger/OpenAPI documentation, automated tests, Docker, and Docker Compose.

## Features

* JWT-based authentication
* User registration and login
* Password hashing with bcrypt
* Protected service management endpoints
* Service CRUD operations
* Customer booking creation without authentication
* Booking retrieval and management
* Booking status workflow
* Booking cancellation
* Prevention of past-date bookings
* Prevention of duplicate booking slots
* Prevention of invalid booking status transitions
* Active/inactive service validation
* Pagination for bookings
* Booking filtering by status
* Request validation with `class-validator`
* Global HTTP exception handling
* Swagger/OpenAPI documentation
* Unit tests with Jest
* PostgreSQL database
* Prisma 8 ORM
* Docker containerization
* Docker Compose development environment

## Technology Stack

| Technology        | Purpose                     |
| ----------------- | --------------------------- |
| NestJS            | Backend framework           |
| TypeScript        | Programming language        |
| PostgreSQL        | Relational database         |
| Prisma 8          | Database ORM                |
| JWT               | Authentication              |
| Passport          | Authentication strategy     |
| bcrypt            | Password hashing            |
| class-validator   | Request validation          |
| Swagger / OpenAPI | API documentation           |
| Jest              | Automated testing           |
| Docker            | Containerization            |
| Docker Compose    | Multi-container environment |

## Project Structure

```text
Booking Platform REST API - (NestJS)/
│
├── migrations/
│   ├── app/
│   └── snapshots/
│
├── prisma/
│   ├── contract.prisma
│   ├── contract.json
│   └── contract.d.ts
│
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── jwt.strategy.ts
│   │
│   ├── bookings/
│   │   ├── dto/
│   │   ├── bookings.controller.ts
│   │   ├── bookings.service.ts
│   │   └── bookings.module.ts
│   │
│   ├── services/
│   │   ├── dto/
│   │   ├── services.controller.ts
│   │   ├── services.service.ts
│   │   └── services.module.ts
│   │
│   ├── common/
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   │
│   ├── prisma/
│   │   ├── db.ts
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── app.module.ts
│   └── main.ts
│
├── .dockerignore
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── package.json
├── prisma.config.ts
└── README.md
```

## API Endpoints

### Authentication

| Method | Endpoint         | Authentication |
| ------ | ---------------- | -------------- |
| POST   | `/auth/register` | Public         |
| POST   | `/auth/login`    | Public         |
| GET    | `/auth/profile`  | JWT required   |

### Services

| Method | Endpoint        | Authentication |
| ------ | --------------- | -------------- |
| POST   | `/services`     | JWT required   |
| GET    | `/services`     | JWT required   |
| GET    | `/services/:id` | JWT required   |
| PATCH  | `/services/:id` | JWT required   |
| DELETE | `/services/:id` | JWT required   |

### Bookings

| Method | Endpoint               | Authentication |
| ------ | ---------------------- | -------------- |
| POST   | `/bookings`            | Public         |
| GET    | `/bookings`            | Public         |
| GET    | `/bookings/:id`        | Public         |
| PATCH  | `/bookings/:id/status` | Public         |
| PATCH  | `/bookings/:id/cancel` | Public         |

## Booking Status Workflow

Bookings support the following statuses:

```text
PENDING
   │
   ├──> CONFIRMED
   │       │
   │       └──> COMPLETED
   │
   └──> CANCELLED
```

Business rules prevent invalid transitions such as:

```text
CANCELLED → COMPLETED
COMPLETED → CANCELLED
```

## Booking Rules

The API validates several business requirements:

* A booking must reference an existing service.
* Inactive services cannot receive new bookings.
* Booking dates cannot be in the past.
* Booking times must use `HH:mm` format.
* Duplicate booking slots are rejected.
* Cancelled bookings cannot be completed.
* Completed bookings cannot be cancelled.
* Invalid booking IDs return appropriate HTTP errors.
* Invalid request data is rejected through global validation.

## Pagination and Filtering

Bookings support pagination:

```http
GET /bookings?page=1&limit=10
```

Filtering by booking status:

```http
GET /bookings?status=CANCELLED
```

Pagination and filtering can also be combined:

```http
GET /bookings?status=PENDING&page=1&limit=10
```

## Environment Configuration

Create a local `.env` file based on `.env.example`.

Example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/booking_platform"
JWT_SECRET="your-jwt-secret-here"
```

The `.env` file is intentionally excluded from Git.

## Running with Docker

Make sure Docker Desktop is running.

Start the complete application:

```bash
docker compose up -d --build
```

Check running containers:

```bash
docker compose ps
```

View API logs:

```bash
docker compose logs api
```

View PostgreSQL logs:

```bash
docker compose logs postgres
```

Stop the application:

```bash
docker compose down
```

The API will be available at:

```text
http://localhost:3000
```

## Swagger API Documentation

Swagger UI:

```text
http://localhost:3000/api/docs
```

Swagger provides interactive documentation for:

* Authentication
* Services
* Bookings
* Request DTOs
* Response documentation
* JWT-protected endpoints

## Running Locally Without Docker

Install dependencies:

```bash
npm install
```

Configure the `.env` file.

Start the application:

```bash
npm run start
```

Development mode:

```bash
npm run start:dev
```

Production mode:

```bash
npm run start:prod
```

## Database

The project uses PostgreSQL with Prisma 8.

Database migrations are included in the repository.

To check migration status:

```bash
npx prisma migration status
```

## Testing

Run the complete test suite:

```bash
npm run test
```

Run tests sequentially:

```bash
npm run test -- --runInBand
```

Run test coverage:

```bash
npm run test:cov
```

Current test status:

```text
Test Suites: 7 passed, 7 total
Tests:       7 passed, 7 total
```

## Build

Create a production build:

```bash
npm run build
```

The production build has been verified successfully.

## Docker Architecture

```text
                    ┌─────────────────────┐
                    │       Client        │
                    │ Browser / Postman   │
                    └──────────┬──────────┘
                               │
                               │ HTTP :3000
                               ▼
                    ┌─────────────────────┐
                    │    NestJS API       │
                    │  booking-platform   │
                    └──────────┬──────────┘
                               │
                               │ PostgreSQL
                               ▼
                    ┌─────────────────────┐
                    │    PostgreSQL 17    │
                    │  booking_platform   │
                    └─────────────────────┘
```

Docker Compose manages both application containers.

## Security

The project implements:

* JWT authentication
* Password hashing with bcrypt
* Protected service endpoints
* Request validation
* Environment-based configuration
* Global exception handling
* Database relationships and constraints
* Prevention of invalid booking operations

Secrets and local environment configuration are excluded from version control.

## Example Authentication Flow

### 1. Register

```http
POST /auth/register
```

Example request:

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

### 2. Login

```http
POST /auth/login
```

The API returns a JWT access token.

### 3. Authorize

Use the token as:

```text
Authorization: Bearer <access-token>
```

Protected service endpoints can then be accessed.

## Development Verification

The project has been verified with:

* Docker Compose startup
* PostgreSQL container
* NestJS API container
* Swagger UI
* JWT authentication
* Service CRUD operations
* Booking operations
* Booking validation rules
* Pagination
* Status filtering
* Global exception handling
* Unit tests
* Production build

## Future Improvements

Possible future enhancements include:

* Refresh token authentication
* Role-based access control
* Advanced booking search
* Email notifications
* Redis caching
* E2E testing
* CI/CD pipeline
* Production deployment
* Monitoring and logging
* Rate limiting
* Docker health checks

## License

This project is developed as a portfolio and learning project.
