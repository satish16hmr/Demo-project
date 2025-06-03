const Post = require('../model/post.model');


async function createPost(data) {
    return Post.create(data);
}

async function getPostById(id) {
    return Post.findByPk(id);
}

async function getAllPosts() {
    return Post.findAll();
}

async function updatePost(id, data) {
    return Post.update(data, { where: { id } });
}

async function deletePost(id) {
    return Post.destroy({ where: { id } });
}


module.exports = {
    createPost,
    getPostById,
    getAllPosts,
    updatePost, 
    deletePost
};