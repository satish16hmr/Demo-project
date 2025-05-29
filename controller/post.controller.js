const User = require('../model/user.model');
const Post = require('../model/post.model');
// const { Op } = require('sequelize');


exports.createPost = async (req, res) => {
    const { title, description, likes, comments } = req.body;
    const author = req.user.id;
    const image = req.file ? req.file.path : null; // Cloudinary URL

    try {
        const newPost = await Post.create({
            author,
            title,
            description,
            image,
            likes: likes || 0,
            comments: comments || 0
        });

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    }
    catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updatePost = async (req, res) => {
    const postId = req.params.id;
    const { title, description, likes, comments } = req.body;

    try {
        const post = await Post.findByPk(postId);
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