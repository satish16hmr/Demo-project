const Like = require('../model/like.model');
const Post = require('../model/post.model');
const Comment = require('../model/comment.model');

exports.likeAndCommentPost = async (req, res) => {
    const userId = req.user.id;
    const { postId, comment } = req.body; 

    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        let like = await Like.findOne({ where: { userId, postId } });
        if (!like) {
            like = await Like.create({ userId, postId });
            post.likes += 1;
            await post.save();
        }

        let newComment = null;
        if (comment && comment.trim() !== '') {
            newComment = await Comment.create({
                userId,
                postId,
                text: comment
            });
            post.comments += 1;
            await post.save();
        }

        res.status(201).json({
            message: 'Like/commented Successfully',
            like,
            comment: newComment
        });
    } catch (error) {
        console.error('Error liking/commenting post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.alllikes = async (req, res) => {
    try {
        // console.log('Fetching all likes...', req.user.id);
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
}

