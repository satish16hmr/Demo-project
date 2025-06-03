const User = require('../model/user.model');
const Post = require('../model/post.model');
const Friend = require('../model/follow.model');
const postService = require('../services/post.services');


exports.createPost = async (req, res) => {
    const { title, description, likes, comments } = req.body;
    const author = req.user.id;
    const image = req.file ? req.file.path : null;
    console.log(image);

    try {
        const newPost = await postService.createPost({
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



exports.deletePost = async (req, res) => {
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



exports.getAllPosts = async (req, res) => {
    console.log(req.user);

    try {
        const posts = await postService.getAllPosts({
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


// this api getting all the post from their friends and themselves

exports.getUserLoginFeed = async (req, res) => {
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