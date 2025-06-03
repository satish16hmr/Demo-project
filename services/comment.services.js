const Comment = require('../model/comment.model');

async function createComment(data) {
    return Comment.create(data);
}

module.exports = { createComment };