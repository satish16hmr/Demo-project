import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Friend from "../models/follow.model.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import postService from "../services/post.service.js";
import NotificationService from "../services/user.service.js";
import {
  deleteFromCloudinary,
  getCloudinaryPublicId,
} from "../utils/multer.js";

// Create a new post
async function createPost(req, res) {
  try {
    const postData = {
      author: req.user.id,
      title: req.body.title,
      description: req.body.description,
      image: req.file ? req.file.path : null,
    };

    const newpost = await postService.createPost(postData);

    return res.status(201).json(newpost);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Update a post
async function updatePost(req, res) {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (req.file && post.image) {
      const id = getCloudinaryPublicId(post.image);
      if (id) await deleteFromCloudinary(id);
      post.image = req.file.path;
    }

    Object.assign(post, req.body);
    await post.save();

    return res.status(200).json({ message: "Post updated", post });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

// Delete a post

async function deletePost(req, res) {
  const postId = req.params.id;

  try {
    const post = await postService.getPostById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.image) {
      const publicId = getCloudinaryPublicId(post.image);
      if (publicId) {
        await deleteFromCloudinary(publicId, post.image);
      }
    }

    await Like.destroy({ where: { postId } });
    await Comment.destroy({ where: { postId } });
    await post.destroy();

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get all posts
async function getAllPosts(req, res) {
  const userId = req.params.id;
  const currentUserId = req.user.id;

  try {
    const posts = await Post.findAll({
      where: { author: userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "lastname"],
        },
        {
          model: Like,
          as: "likesList",
          attributes: ["userId"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const formattedPosts = posts.map((post) => {
      const postData = post.toJSON();
      const likedByCurrentUser = postData.likesList.some(
        (like) => like.userId === currentUserId
      );

      return {
        ...postData,
        liked: likedByCurrentUser,
        likes: postData.likesList.length,
      };
    });

    return res.status(200).json(formattedPosts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get feed for logged-in user
async function getUserLoginFeed(req, res) {
  const userId = req.user.id;

  try {
    const followings = await Friend.findAll({
      where: { follower_id: userId },
      attributes: ["following_id"],
    });

    const followingIds = followings.map((f) => f.following_id);
    followingIds.push(userId);

    const posts = await Post.findAll({
      where: { author: followingIds },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "lastname"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const [likesCount, commentsCount, existingLike] = await Promise.all([
          Like.count({ where: { postId: post.id } }),
          Comment.count({ where: { postId: post.id } }),
          Like.findOne({ where: { postId: post.id, userId } }),
        ]);

        return {
          ...post.toJSON(),
          likesCount,
          commentsCount,
          liked: !!existingLike,
        };
      })
    );

    return res.status(200).json(enrichedPosts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Like or unlike a post

export async function toggleLikePost(req, res) {
  const userId = req.user.id;
  const postId = req.params.id;

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingLike = await Like.findOne({ where: { userId, postId } });

    if (existingLike) {
      await existingLike.destroy();
      await Post.decrement("likes", { by: 1, where: { id: postId } }); // 👈 decrease likes in post table
      const likesCount = await Like.count({ where: { postId } });
      return res
        .status(200)
        .json({ message: "Post unliked", postId, liked: false, likesCount });
    } else {
      await Like.create({ userId, postId });
      await Post.increment("likes", { by: 1, where: { id: postId } }); // 👈 increase likes in post table

      if (post.author !== userId) {
        await NotificationService.createNotification({
          userId: post.author,
          fromUserId: userId,
          type: "like",
          message: "liked your post",
        });
      }

      const likesCount = await Like.count({ where: { postId } });
      return res
        .status(200)
        .json({ message: "Post liked", postId, liked: true, likesCount });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get likes for a post
async function likes(req, res) {
  try {
    const postId = req.params.id;
    const likes = await Like.findAll({
      where: { postId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "lastname", "email"],
        },
      ],
    });

    return res.status(200).json(likes);
  } catch (error) {
    console.error("Error fetching likes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Comment on a post
async function commentPost(req, res) {
  const userId = req.user.id;
  const postId = req.params.id;
  const { text } = req.body;

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }

    const comment = await postService.createComment({
      userId,
      postId,
      text,
    });

    await Post.increment("comments", { by: 1, where: { id: postId } }); // for incrementing comment count in post table

    if (post.author !== userId) {
      await NotificationService.createNotification({
        userId: post.author,
        fromUserId: userId,
        type: "comment",
        message: `commented on your post: "${text}"`,
      });
    }

    return res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get comments for a post
async function getComments(req, res) {
  const postId = req.params.id;

  try {
    const comments = await Comment.findAll({
      where: { postId },
      include: [
        {
          association: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Delete a comment
async function deleteComment(req, res) {
  const commentId = req.params.id;
  const userId = req.user.id;

  try {
    const comment = await Comment.findOne({ where: { id: commentId, userId } });
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found or you dont have permission to delete it",
      });
    }

    await comment.destroy();
    await Post.decrement("comments", { by: 1, where: { id: comment.postId } }); // for decrementing comment count in post table

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Update a comment
async function updateComment(req, res) {
  const commentId = req.params.id;
  const userId = req.user.id;
  const { text } = req.body;

  try {
    const comment = await Comment.findOne({ where: { id: commentId, userId } });
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found or you dont have permission to update it",
      });
    }

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }

    comment.text = text;
    await comment.save();

    return res.status(200).json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

const postController = {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getUserLoginFeed,
  toggleLikePost,
  likes,
  commentPost,
  getComments,
  deleteComment,
  updateComment,
};

export default postController;

// their is two apis in following route both are commend right now

// exports.getalllikesofthepost = async (req, res) => {
//     const postId = req.params.id;

//     try {
//         const post = await Post.findByPk(postId, {
//             include: [{
//                 model: User,
//                 as: 'user',
//                 attributes: ['id', 'name', 'lastname']
//             }]
//         });

//         if (!post) {
//             return res.status(404).json({ message: 'Post not found' });
//         }

//         const likes = await post.getLikes({
//             include: [{
//                 model: User,
//                 as: 'user',
//                 attributes: ['id', 'name', 'lastname']
//             }]
//         });

//         res.status(200).json({ post, likes });
//     }
//     catch (error) {
//         console.error('Error fetching likes:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }

// exports.getallpostofme = async (req, res) => {
//     const userId = req.user.id;
//     console.log('User ID:', userId);

//     try {
//         const posts = await Post.findAll({
//             where: { author: userId },
//             include: [{
//                 model: User,
//                 as: 'user',
//                 attributes: ['id', 'name', 'lastname']
//             }],
//             order: [['created_at', 'DESC']]
//         });

//         res.status(200).json(posts);
//     }
//     catch (error) {
//         console.error('Error fetching user posts:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }
