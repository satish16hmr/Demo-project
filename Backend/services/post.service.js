import Post from "../models/post.model.js";
import Like from "../models/like.model.js";
import Comment from "../models/comment.model.js";

async function createPost(data) {
  return Post.create(data);
}

async function getPostById(id) {
  return Post.findByPk(id);
}

async function getAllPosts(options = {}) {
  return Post.findAll(options);
}

async function updatePost(id, data) {
  return Post.update(data, { where: { id } });
}

async function deletePost(id) {
  return Post.destroy({ where: { id } });
}

async function likePost(userId, postId) {
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  let like = await Like.findOne({ where: { userId, postId } });
  if (!like) {
    like = await Like.create({ userId, postId });
  }
  return like;
}

async function createComment(data) {
  return Comment.create(data);
}

export default {
  createPost,
  getPostById,
  getAllPosts,
  updatePost,
  deletePost,
  likePost,
  createComment,
};
