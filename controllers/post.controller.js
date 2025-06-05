import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import Friend from '../models/follow.model.js';
import Comment from '../models/comment.model.js';
import Like from '../models/like.model.js';
import postService from '../services/post.service.js';
import NotificationService from '../services/user.service.js';

// Create a new post
async function createPost(req, res) {   
    try {
        const { title, description, likes, comments } = req.body;
        const author = req.user.id;
        const image = req.file ? req.file.path : null;

        const newpost = await postService.createPost({
            author,
            title,
            description,
            image,
            likes: likes || 0,
            comments: comments || 0,
        });

        res.status(201).json(newpost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Update a post
async function updatePost(req, res) {
    const postId = req.params.id;
    const { title, description, likes, comments } = req.body;

    try {
        const post = await postService.getPostById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.title = title || post.title;
        post.description = description || post.description;
        post.likes = likes || post.likes;
        post.comments = comments || post.comments;

        if (req.file) {
            post.image = req.file.path;
        }

        await post.save();

        res.status(200).json({ message: 'Post updated successfully', post });
    }
    catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Delete a post

async function deletePost(req, res) {
    const postId = req.params.id;

    try {
        const post = await postService.getPostById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await post.destroy();

        res.status(200).json({ message: 'Post deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Get all posts
async function getAllPosts(req, res) {
    const userId = req.params.id;

    try {
        const posts = await postService.getAllPosts({
            where: { author: userId },
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'lastname']
            }],
            order: [['created_at', 'DESC']]
        });

        res.status(200).json(posts);
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Get feed for logged-in user
async function getUserLoginFeed(req, res) {
    const userId = req.user.id;
    console.log('User ID:', userId);

    try {
        const followings = await Friend.findAll({
            where: { follower_id: userId },
            attributes: ['following_id']
        });

        const followingIds = followings.map(f => f.following_id);

        followingIds.push(userId);

        console.log('Feed will include posts from user IDs:', followingIds);

        const posts = await Post.findAll({
            where: { author: followingIds },
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'lastname']
            }],
            order: [['created_at', 'DESC']]
        });

        res.status(200).json(posts);
    }
    catch (error) {
        console.error('Error fetching user feed:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Like or unlike a post
async function toggleLikePost(req, res) {
    const userId = req.user.id;
    const postId = req.params.id;

    try {
        const existingLike = await Like.findOne({ where: { userId, postId } });
        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (existingLike) {
            await existingLike.destroy();
            return res.status(200).json({ message: 'Post unliked successfully' });
        }
        else {
            const like = await Like.create({ userId, postId });

            if (post.author !== userId) {
                await NotificationService.createNotification({
                    userId: post.author,
                    fromUserId: userId,
                    type: 'like',
                    message: 'liked your post'
                });
            }

            return res.status(201).json({ message: 'Post liked successfully', like });
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ message: 'Internal server error' });
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
                    model: Post,
                    as: 'post',
                    attributes: ['id', 'title', 'description', 'author']
                }
            ]
        });

        res.status(200).json(likes);
    } catch (error) {
        console.error('Error fetching likes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Comment on a post
async function commentPost(req, res) {
    const userId = req.user.id;
    const postId = req.params.id;
    const { text } = req.body;

    console.log("comments", text);

    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!text || text.trim() === '') {
            return res.status(400).json({ message: 'Comment text cannot be empty' });
        }

        const comment = await postService.createComment({
            userId,
            postId,
            text
        });

        if (post.author !== userId) {
            await NotificationService.createNotification({
                userId: post.author,
                fromUserId: userId,
                type: 'comment',
                message: `commented on your post: "${text}"`
            });
        }

        res.status(201).json({
            message: 'Comment added successfully',
            comment
        });
    } catch (error) {
        console.error('Error commenting on post:', error);
        res.status(500).json({ message: 'Internal server error' });
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
                    association: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });
        console.log(comments);
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Delete a comment
async function deleteComment(req, res) {
    const commentId = req.params.id;
    const userId = req.user.id;

    try {
        const comment = await Comment.findOne({ where: { id: commentId, userId } });
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found or you dont have permission to delete it' });
        }

        await comment.destroy();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Internal server error' });
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
            return res.status(404).json({ message: 'Comment not found or you dont have permission to update it' });
        }

        if (!text || text.trim() === '') {
            return res.status(400).json({ message: 'Comment text cannot be empty' });
        }

        comment.text = text;
        await comment.save();

        res.status(200).json({
            message: 'Comment updated successfully',
            comment
        });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Internal server error' });
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