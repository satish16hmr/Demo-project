const Like = require('../model/like.model');
const Post = require('../model/post.model');
const likeService = require('../services/like.services');

exports.likePost = async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;

    try {
        const like = await likeService.likePost(userId, postId);
        res.status(201).json({
            message: 'Post liked successfully',
            like
        });
    } catch (error) {
        if (error.message === 'Post not found') {
            return res.status(404).json({ message: error.message });
        }
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.unlikePost = async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;

    try {
        const like = await Like.findOne({ where: { userId, postId } });
        if (!like) {
            return res.status(404).json({ message: 'Like not found' });
        }

        await like.destroy();

        res.status(200).json({ message: 'Post unliked successfully' });
    } catch (error) {
        console.error('Error unliking post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.likes = async (req, res) => {
    try {
        const likes = await Like.findAll({
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