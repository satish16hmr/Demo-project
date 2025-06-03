const User = require('../model/user.model');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');


async function findUserByEmail(email) {
    return User.findOne({ where: { email } });
}

async function createUser(data) {
    data.password = await bcrypt.hash(data.password, 10);
    return User.create(data);
}


async function searchUsers(query) {
    return User.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.iLike]: `%${query}%` } },
                { lastname: { [Op.iLike]: `%${query}%` } },
                { email: { [Op.iLike]: `%${query}%` } }
            ]
        },
        attributes: ['id', 'name', 'lastname', 'email']
    });
}

module.exports = {
    findUserByEmail,
    createUser,
    searchUsers,
};