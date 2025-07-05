# Library Management API

A RESTful API for managing books and borrowing operations in a library, built with Express, TypeScript, and MongoDB.

## Features

    - Full CURD operations for books
    - Borrowing system with due dates
    - Automatic availability management
    - Filtering and sorting of books
    - Borrowed books summary report
    - Comprehensive error handling
    - TypeScript for type safety

## Technologies

    - Node.js
    - Express
    - TypeScript
    - MongoDB (with Mongoose)
    - Dotenv (environment variables)

## Setup

### Prerequisites

    -Node.js(v18 or higher)
    -MongoDB(local or Atlas)
    -npm or yarn

### Installation

1. Install dependencies:
   `npm install`

2. Set Up environment variables:

- Create .env file in the root directory
- Add the following configuration:

  ```
  PORT=3000
  MONGODB_URI=mongodb://localhost:27017/library_db
  ```

Running the Application

- Development mode(with auto-reload):

```
npm run dev
```

API Documentation

Base URL

```
http://localhost:3000/api
```

Endpoints

| Method | Endpoint | Description |

| ------ | -------- | ----------- |

| POST | /books | Create a new book |

| GET | /books | Get all books (filter/sort support) |

| GET | /books/:id | Get a specific book |

| PUT | /books/:id | Update a book |

| DELETE | /books/:id | Delete a book |

## Borrow

| Method | Endpoint | Description |

| POST | /borrow | Borrow a book |

| GET | /borrow | Get borrowed books summary |

## Business Logic Highlights

1.  Automatic Availability Management

- When books are borrowed, available copies are automatically deducted
- If copies reach 0, the book is marked as unavailable
- Implemented through Mongoose middleware

2.  Borrowing Validation

- Cannot borrow more copies than available
- Due date must be in the future
- Comprehensive error messages for validation failures

3.  Reporting Features
    - Aggregation pipeline for borrowed books summary
    - Groups by book and sums quantities
    - Includes book details via $lookup
