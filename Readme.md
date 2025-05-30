## Post API Endpoints

| Method | Endpoint                | Description                                 | Auth Required | Body/Form Data                                      |
|--------|-------------------------|---------------------------------------------|---------------|-----------------------------------------------------|
| POST   | /post/Create-Post       | Create a new post (with optional image)     | Yes           | `title`, `description`, `likes`, `comments`, `image` (file) |
| PUT    | /post/update/:id        | Update an existing post by ID               | Yes           | `title`, `description`, `likes`, `comments`, `image` (file) |
| DELETE | /post/delete/:id        | Delete a post by ID                         | Yes           | -                                                   |
| GET    | /post/getAllPosts       | Get all posts (with author info)            | Yes           | -                                                   |

### Details

#### Create Post
- **Endpoint:** `POST /post/Create-Post`
- **Description:** Creates a new post. Accepts `title`, `description`, `likes`, `comments`, and an optional image file.
- **Body/Form Data:** Use `multipart/form-data` for file upload.
- **Authentication:** Required (token).

#### Update Post
- **Endpoint:** `PUT /post/update/:id`
- **Description:** Updates the post with the given ID. Only provided fields are updated.
- **Body/Form Data:** `title`, `description`, `likes`, `comments`, and optional image file.
- **Authentication:** Required.

#### Delete Post
- **Endpoint:** `DELETE /post/delete/:id`
- **Description:** Deletes the post with the given ID.
- **Authentication:** Required.

#### Get All Posts
- **Endpoint:** `GET /post/getAllPosts`
- **Description:** Returns all posts, including author info (`id`, `name`, `lastname`).
- **Authentication:** Required.
