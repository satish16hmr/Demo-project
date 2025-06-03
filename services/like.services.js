const Like = require('../model/like.model');
const Post = require('../model/post.model');


async function likePost(userId, postId) {
    const post = await Post.findByPk(postId);
    if (!post) {
        throw new Error('Post not found');
    }

    let like = await Like.findOne({ where: { userId, postId } });
    if (!like) {
        like = await Like.create({ userId, postId });
    }
    return like;
}




module.exports = { likePost };