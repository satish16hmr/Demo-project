## API Endpoints

### Auth & User

| Method | Endpoint                  | Description                        | Auth Required | Body/Form Data                                  |
|--------|---------------------------|------------------------------------|---------------|-------------------------------------------------|
| POST   | /users/signup             | Register a new user                | No            | `name`, `lastname`, `email`, `password`, `passwordConfirm` |
| POST   | /users/login              | Login and get JWT token            | No            | `email`, `password`                             |
| GET    | /users/profile            | Get logged-in user's profile       | Yes           | -                                               |
| GET    | /users/profile/:id        | Get user profile by ID             | Yes           | -                                               |
| PUT    | /users/profile/:id        | Update user profile                | Yes           | `name`, `lastname`, `email`                     |
| POST   | /users/logout             | Logout user                        | No            | -                                               |
| DELETE | /users/delete/:id         | Delete user by ID                  | Yes           | -                                               |
| POST   | /users/forgot-password    | Request password reset link        | No            | `email`                                         |
| POST   | /users/reset-password     | Reset password with token          | No            | `token`, `password`                             |

### Follow

| Method | Endpoint                        | Description                        | Auth Required | Body/Form Data |
|--------|---------------------------------|------------------------------------|---------------|---------------|
| POST   | /follow/:id/follow              | Follow a user                      | Yes           | -             |
| POST   | /follow/:id/unfollow            | Unfollow a user                    | Yes           | -             |
| GET    | /follow/:id/followers           | Get followers of a user            | No            | -             |
| GET    | /follow/:id/followings          | Get users followed by a user       | No            | -             |

### Post

| Method | Endpoint                        | Description                                 | Auth Required | Body/Form Data                                      |
|--------|---------------------------------|---------------------------------------------|---------------|-----------------------------------------------------|
| POST   | /post/Create-Post               | Create a new post (with optional image)     | Yes           | `title`, `description`, `likes`, `comments`, `image` (file) |
| PUT    | /post/update/:id                | Update an existing post by ID               | Yes           | `title`, `description`, `likes`, `comments`, `image` (file) |
| DELETE | /post/delete/:id                | Delete a post by ID                         | Yes           | -                                                   |
| GET    | /post/getAllPosts               | Get all posts (with author info)            | Yes           | -                                                   |
| GET    | /post/getUserLoginFeed          | Get posts from user and their followings    | Yes           | -                                                   |

### Like & Comment

| Method | Endpoint                        | Description                                 | Auth Required | Body/Form Data                |
|--------|---------------------------------|---------------------------------------------|---------------|-------------------------------|
| POST   | /like/like-comment              | Like and/or comment on a post               | Yes           | `postId`, `comment` (optional)|
| POST   | /like/alllikes                  | Get all likes with post info                | Yes           | -                             |

---

### Details

#### Signup
- **Endpoint:** `POST /users/signup`
- **Description:** Register a new user.
- **Body:** `name`, `lastname`, `email`, `password`, `passwordConfirm`

#### Login
- **Endpoint:** `POST /users/login`
- **Description:** Login and receive a JWT token.
- **Body:** `email`, `password`

#### Create Post
- **Endpoint:** `POST /post/Create-Post`
- **Description:** Create a new post. Accepts `title`, `description`, `likes`, `comments`, and an optional image file.
- **Body/Form Data:** Use `multipart/form-data` for file upload.

#### Like/Comment Post
- **Endpoint:** `POST /like/like-comment`
- **Description:** Like and/or comment on a post.
- **Body:** `postId`, `comment` (optional)

#### Get User Feed
- **Endpoint:** `GET /post/getUserLoginFeed`
- **Description:** Returns posts from the logged-in user and users they follow.

#### Forgot Password
- **Endpoint:** `POST /users/forgot-password`
- **Description:** Request a password reset link.
- **Body:** `email`

#### Reset Password
- **Endpoint:** `POST /users/reset-password`
- **Description:** Reset password using the token sent to email.
- **Body:** `token`, `password`

---

> All endpoints requiring authentication expect a valid JWT token in the `Authorization` header as `Bearer <token>`.