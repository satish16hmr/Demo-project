const Comment = require('../model/comment.model');
const Post = require('../model/post.model');
const commentService = require('../services/comment.services');

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

        const comment = await commentService.createComment({
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
        res.status(500).json({ message: 'Internal server error' });
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

exports.deleteComment = async (req, res) => {
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

    
exports.updateComment = async (req, res) => {
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
