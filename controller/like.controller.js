const Like = require('../model/like.model');
const Post = require('../model/post.model');

exports.likePost = async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;

    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        let like = await Like.findOne({ where: { userId, postId } });
        if (!like) {
            like = await Like.create({ userId, postId });
        }

        res.status(201).json({
            message: 'Post liked successfully',
            like
        });
    } catch (error) {
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