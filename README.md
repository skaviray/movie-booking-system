# 🎬 Movie Booking System

A full-stack web application for managing and booking movie tickets — including users, theaters, screens, seats, showtimes, and payments.

---

## 🚀 Features

### 🎟 User Experience

- Browse movies by genre, language, or release date
- View available showtimes by theater and screen
- Select seats and book/reserve tickets
- Secure authentication & admin access

### ⚙️ Admin Panel

- Manage movies, genres, theaters, screens
- Configure showtimes and pricing
- Seat layout creation per screen
- Real-time availability management

### 🧩 Tech Stack

| Layer      | Tech                   |
| ---------- | ---------------------- |
| Frontend   | React.js + Bootstrap   |
| Backend    | Go (Gin)               |
| Database   | PostgreSQL             |
| ORM        | SQLC                   |
| Auth       | JWT / Paseto           |
| Deployment | Docker, Docker Compose |

---

## 🗂 Project Structure

```sh
.
├── backend/            # Go API using Gin + SQLC
├── frontend/           # React app for booking and admin dashboard
├── migrations/         # PostgreSQL schema files
├── services/           # API calls from frontend
├── utils/              # Shared helpers (date formatting, auth, etc.)
└── README.md
```

## TODO

1. Update Readme file.
2. Update the **docker-compose.yaml** file to deploy all the frontend,backend and database properly.
3. Create a deployment manifests for k8s.
4. Create application architecture.
5. Refactor the code.
6. Add payment and seat selection features.

## Database Architecture

![DB Architecture](backend/go/MoviesBookingSystem.svg)

## Application Architecture

![alt text](Architecture.svg)

## Building container Images

### Frontend

```bash
cd frontend
make create-container-image
```

### Backend

```bash
cd backend
make create-container-image
```

## Deployment

### Docker

```bash
docker-compose up -d
```

```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> /Users/skaviray/.zshrc
export LDFLAGS="-L/opt/homebrew/opt/postgresql@15/lib"
export CPPFLAGS="-I/opt/homebrew/opt/postgresql@15/include"
psql -h localhost -p 5434 -U root -d vividly  --password admin -f sample_data.sql
```

```bash
BEGIN;

-- 1. Check seat availability
SELECT status FROM seats WHERE id = $1 AND status = 'available' FOR UPDATE;

-- 2. Create booking
INSERT INTO bookings (...) VALUES (...) RETURNING id;

-- 3. Add seat mapping
INSERT INTO booked_seats (booking_id, seat_id, price) VALUES ($booking_id, $seat_id, $price);

-- 4. Update seat status
UPDATE seats SET status = 'booked', updated_at = NOW() WHERE id = $seat_id;

COMMIT;

```

```bash
movies:
```

create-order ---> calls the razorpayid

:input :input
showtimeid amount, currency,
seatids. orderreciept(showtime-id-customer-id)
customerid :otuput
amount order_id,amount, currency

verify-payment -------> verify backend
:input                   
order_id
payment_id
razorpay_payment_id
razorpay_signature
showtime_id
amount
seat_ids
customer_id
