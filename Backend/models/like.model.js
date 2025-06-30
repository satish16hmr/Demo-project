import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";
import Post from "./post.model.js"; 

const Like = sequelize.define(
  "Like",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Posts',
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Associations
Like.associate = (models) => {
  Like.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
  Like.belongsTo(models.Post, {
    foreignKey: "postId",
    as: "post",
  });
};

export default Like;
