# 📚 Books REST API

A RESTful API for a book-sharing and review application where users can register, log in, manage their book collection, and share reviews with images and ratings.

---

## 🚀 Features

- **🔐 User Authentication:**
  - Register and log in with email and password.
  - JWT-based authentication for protected routes.
- **📖 Book Management:**
  - Create book entries with title, caption, rating, and image.
  - Retrieve all books with pagination.
  - Retrieve books by the logged-in user.
  - Delete books.
- **☁️ Image Uploads:**
  - Cloudinary integration for secure image storage.
- **🛠️ Maintenance:**
  - Cron job runs every 14 minutes to keep the server alive.

---

## 🧱 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Image Storage:** Cloudinary
- **Other:** CORS, Cron Jobs

---

## ⚙️ Setup & Installation

Follow these steps to set up and run the API locally:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/iNspireXD/bookmate-social-api.git
    cd books-rest-api
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    Create a file named `.env` in the root directory of the project and add the following environment variables:

    ```dotenv
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    API_URL=your_api_url_for_cron_job
    ```

    Replace the placeholder values with your actual MongoDB connection string, JWT secret, Cloudinary credentials, and the API URL (used for the cron job to keep the server alive, e.g., `http://localhost:3000/api/some-endpoint`).

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This command will start the server, likely on `http://localhost:3000` (or the port specified in your `.env` file).

---

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for securing protected routes. After logging in or registering, you will receive a token. To access protected routes, you need to include this token in the `Authorization` header with the `Bearer` scheme.

```http
Authorization: Bearer your_jwt_token
```

---

## 📡 API Endpoints

### 🧑‍💻 Authentication

**`POST /api/auth/register`** - Register a new user

- **Description:** Creates a new user account in the system.
- **Body:** Requires username, email, and password.
  ```json
  {
    "username": "yourname",
    "email": "your@email.com",
    "password": "yourpassword"
  }
  ```
- **Returns:** On success, returns a JWT token for authentication and basic user information.

**`POST /api/auth/login`** - Login an existing user

- **Description:** Authenticates a user based on email and password.
- **Body:** Requires email and password.
  ```json
  {
    "email": "your@email.com",
    "password": "yourpassword"
  }
  ```
- **Returns:** On success, returns a JWT token for authentication and basic user information.

### 📘 Books

**(Protected Routes: Require JWT Authentication via `Authorization: Bearer <token>` header)**

**`POST /api/books`** - Create a new book entry

- **Description:** Adds a new book associated with the authenticated user.
- **Authentication:** Required.
- **Body:** Requires title, caption, rating, and the Cloudinary image URL.
  ```json
  {
    "title": "Book Title",
    "caption": "Short description",
    "rating": 5,
    "image": "cloudinary_image_url"
  }
  ```
- **Returns:** The newly created book object, including its assigned ID and user reference.

**`GET /api/books`** - Get all books with pagination

- **Description:** Retrieves a list of all books added by all users, supporting pagination.
- **Authentication:** Required.
- **Query Parameters:**
  - `page` (optional): The page number to retrieve (e.g., `1`, `2`). Defaults to 1 if not provided.
  - `limit` (optional): The maximum number of books to return per page (e.g., `10`, `20`). Defaults to a predefined value (e.g., 10) if not provided.
- **Returns:** An object containing the list of books for the requested page and pagination details (like total books, current page, total pages).

**`GET /api/books/user`** - Get books added by the logged-in user

- **Description:** Retrieves all books specifically added by the currently authenticated user.
- **Authentication:** Required.
- **Returns:** An array containing all book objects created by the logged-in user.

**`DELETE /api/books/:id`** - Delete a specific book

- **Description:** Deletes a book entry by its unique ID. Users can typically only delete their own books (depending on backend logic).
- **Authentication:** Required.
- **Path Parameters:**
  - `id`: The unique identifier (`_id`) of the book to be deleted.
- **Returns:** A success message indicating the book has been deleted.

---

## ⚠️ Error Handling

The API utilizes standard HTTP status codes to communicate the success or failure of an API request. Here are the common codes you might encounter:

- **`400 Bad Request`**: This status indicates that the server could not understand the request due to invalid syntax, missing required fields, or improperly formatted data in the request body or parameters. Check your request payload and query parameters.
- **`401 Unauthorized`**: This means the request lacks valid authentication credentials. You either need to log in to obtain a JWT token or the token provided in the `Authorization` header is missing, invalid, or expired.
- **`404 Not Found`**: The server could not find the requested resource. This usually means the URL path is incorrect or the specific item you're trying to access (e.g., a book with a specific ID) does not exist.
- **`500 Internal Server Error`**: This indicates that something went wrong on the server's side. It's a generic error message for unexpected conditions that prevented the server from fulfilling the request. This is usually not an issue with the client's request itself.

Check the response body for potentially more specific error messages when receiving one of these status codes.

---

## 🧬 Data Models

These are the primary data structures used within the API, typically corresponding to MongoDB collections.

### 📄 User

Describes the structure for user documents.
| Field | Type | Required | Notes |
| :------------ | :------- | :------- | :------------------------ |
| `_id` | ObjectId | ✅ | Unique identifier (Auto-generated by MongoDB) |
| `username` | String | ✅ | Must be unique. |
| `email` | String | ✅ | Must be unique; used for login. |
| `password` | String | ✅ | Stored as a secure hash. |
| `profileImage`| String | ❌ | URL to an optional avatar image. |
| `createdAt` | Date | ✅ | Timestamp of user registration (Auto-generated). |
| `updatedAt` | Date | ✅ | Timestamp of last profile update (Auto-generated). |

### 📄 Book

Describes the structure for book documents.

| Field       | Type     | Required | Notes                                                    |
| :---------- | :------- | :------- | :------------------------------------------------------- |
| `_id`       | ObjectId | ✅       | Unique identifier (Auto-generated by MongoDB)            |
| `title`     | String   | ✅       | Title of the book.                                       |
| `caption`   | String   | ✅       | User's review or description.                            |
| `image`     | String   | ✅       | URL of the uploaded image (e.g., Cloudinary link).       |
| `rating`    | Number   | ✅       | Integer rating, typically 1–5.                           |
| `user`      | ObjectId | ✅       | Reference to the `_id` of the `User` who added the book. |
| `createdAt` | Date     | ✅       | Timestamp of book creation (Auto-generated).             |
| `updatedAt` | Date     | ✅       | Timestamp of last book update (Auto-generated).          |

_(Note: `_id`, `createdAt`, and `updatedAt` fields are typically managed automatically by MongoDB and Mongoose.)_

---

## 🙌 Support

If you find this project useful or interesting, please consider:

- Giving it a ⭐ **star** on GitHub.
- Sharing it with others who might benefit from it.

Your support is appreciated!

---

## 📌 License

This project is licensed under the **MIT License**.

You can find the full text of the license in the `LICENSE` file included at the root of the project's repository. The MIT License is a permissive free software license, meaning it has minimal restrictions on reuse.

---
