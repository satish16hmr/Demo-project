# API Documentation

---

## Auth & User

### 1. Register User
**Endpoint:** `/users/signup`  
**Method:** `POST`  
**Description:** Register a new user.

**Request Body:**
```json
{
  "name": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**Response:**
- `201 Created`  
  ```json
  {
    "user": {
      "id": 1,
      "name": "John",
      "lastname": "Doe",
      "email": "john@example.com"
    },
    "token": "<JWT Token>"
  }
  ```
- `400 Bad Request`: Validation errors.

---

### 2. Login User
**Endpoint:** `/users/login`  
**Method:** `POST`  
**Description:** Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
- `200 OK`  
  ```json
  {
    "user": {
      "id": 1,
      "name": "John",
      "lastname": "Doe",
      "email": "john@example.com"
    },
    "token": "<JWT Token>"
  }
  ```
- `401 Unauthorized`: Invalid credentials.

---

### 3. Get Current User Profile
**Endpoint:** `/users/profile`  
**Method:** `GET`  
**Auth:** `Bearer <token>`  
**Description:** Get the profile of the logged-in user.

**Response:**
- `200 OK`
  ```json
  {
    "user": {
      "id": 1,
      "name": "John",
      "lastname": "Doe",
      "email": "john@example.com"
    }
  }
  ```
- `401 Unauthorized`: Missing or invalid token.

---

### 4. Update User Profile
**Endpoint:** `/users/profile/:id`  
**Method:** `PUT`  
**Auth:** `Bearer <token>`  
**Description:** Update user profile.

**Request Body:**
```json
{
  "name": "John",
  "lastname": "Smith",
  "email": "johnsmith@example.com"
}
```

**Response:**  
- `200 OK`: Updated user object.

---

### 5. Forgot Password
**Endpoint:** `/users/forgot-password`  
**Method:** `POST`  
**Description:** Request a password reset link.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**  
- `200 OK`: Reset link sent.

---

### 6. Reset Password
**Endpoint:** `/users/reset-password`  
**Method:** `POST`  
**Description:** Reset password using token.

**Request Body:**
```json
{
  "token": "<reset-token>",
  "password": "newpassword123"
}
```

**Response:**  
- `200 OK`: Password reset successful.

---

## Follow

### 1. Follow a User
**Endpoint:** `/follow/:id/follow`  
**Method:** `POST`  
**Auth:** `Bearer <token>`  
**Description:** Follow a user by their ID.

**Response:**  
- `200 OK`: Followed successfully.

---

### 2. Unfollow a User
**Endpoint:** `/follow/:id/unfollow`  
**Method:** `POST`  
**Auth:** `Bearer <token>`  
**Description:** Unfollow a user by their ID.

**Response:**  
- `200 OK`: Unfollowed successfully.

---

### 3. Get Followers
**Endpoint:** `/follow/:id/followers`  
**Method:** `GET`  
**Description:** Get followers of a user.

**Response:**  
- `200 OK`: Array of follower users.

---

### 4. Get Followings
**Endpoint:** `/follow/:id/followings`  
**Method:** `GET`  
**Description:** Get users followed by a user.

**Response:**  
- `200 OK`: Array of following users.

---

## Post

### 1. Create Post
**Endpoint:** `/post/Create-Post`  
**Method:** `POST`  
**Auth:** `Bearer <token>`  
**Description:** Create a new post (optionally with image).

**Request Body (form-data):**
- `title` (string, required)
- `description` (string, required)
- `image` (file, optional)

**Response:**  
- `201 Created`: Post object.

---

### 2. Update Post
**Endpoint:** `/post/update/:id`  
**Method:** `PUT`  
**Auth:** `Bearer <token>`  
**Description:** Update an existing post by ID.

**Request Body (form-data):**
- `title` (string, optional)
- `description` (string, optional)
- `image` (file, optional)

**Response:**  
- `200 OK`: Updated post object.

---

### 3. Delete Post
**Endpoint:** `/post/delete/:id`  
**Method:** `DELETE`  
**Auth:** `Bearer <token>`  
**Description:** Delete a post by ID.

**Response:**  
- `200 OK`: Post deleted message.

---

### 4. Get All Posts
**Endpoint:** `/post/getAllPosts`  
**Method:** `GET`  
**Auth:** `Bearer <token>`  
**Description:** Get all posts with author info.

**Response:**  
- `200 OK`: Array of posts.

---

### 5. Get User Feed
**Endpoint:** `/post/getUserLoginFeed`  
**Method:** `GET`  
**Auth:** `Bearer <token>`  
**Description:** Get posts from the logged-in user and users they follow.

**Response:**  
- `200 OK`: Array of posts.

---

## Like & Comment

### 1. Like and/or Comment on a Post
**Endpoint:** `/like/like-comment`  
**Method:** `POST`  
**Auth:** `Bearer <token>`  
**Description:** Like a post and/or add a comment in one request.

**Request Body:**
```json
{
  "postId": 1,
  "comment": "Nice post!" // optional
}
```

**Response:**  
- `201 Created`
  ```json
  {
    "message": "Like/commented Successfully",
    "like": { ... },
    "comment": { ... } // null if not provided
  }
  ```

---

### 2. Get All Likes
**Endpoint:** `/like/alllikes`  
**Method:** `POST`  
**Auth:** `Bearer <token>`  
**Description:** Get all likes with post info.

**Response:**  
- `200 OK`: Array of likes.

---

> **Note:** All endpoints requiring authentication expect a valid JWT token in the `Authorization` header as `Bearer <token>`.