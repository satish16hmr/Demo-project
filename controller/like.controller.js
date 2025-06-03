const Like = require('../model/like.model');
const Post = require('../model/post.model');
const likeService = require('../services/like.services');
const notificationService = require('../services/notifcation.services');


exports.toggleLikePost = async (req, res) => {
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
                await notificationService.createNotification({
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
};



exports.likes = async (req, res) => {
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
};