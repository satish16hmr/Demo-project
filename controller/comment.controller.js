const Comment = require('../model/comment.model');
const Post = require('../model/post.model');

exports.commentPost = async (req, res) => {
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

        const comment = await Comment.create({
            userId,
            postId,
            text
        });

        res.status(201).json({
            message: 'Comment added successfully',
            comment
        });
    } catch (error) {
        console.error('Error commenting on post:', error);
        res.status(500).json({ message: 'Internal server error'});
    }
};

exports.getComments = async (req, res) => {
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
        // console.log(comments);
        res.status(200).json(comments); 
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};