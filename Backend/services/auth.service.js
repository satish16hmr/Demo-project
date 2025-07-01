import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { Op } from "sequelize";

const authService = {
  async findUserByEmail(email) {
    return await User.findOne({ where: { email } });
  },

  async createUser({ name, lastname, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      lastname,
      email,
      password: hashedPassword,
    });
    return {
      id: newUser.id,
      name: newUser.name,
      lastname: newUser.lastname,
      email: newUser.email,
    };
  },

  async verifyUser(email, password) {
    const user = await this.findUserByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  },

  async saveResetToken(user, resetToken) {
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); 
    await user.save();
  },

  async findUserByResetToken(token) {
    return await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
    });
  },

  async updateUserPassword(user, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
  },
};

export default authService;
