import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Follower = sequelize.define('followers', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  follower_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  following_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
},

  {
    timestamps: false,
    tableName: 'followers'
  }
);

// Association method
Follower.associate = (models) => {
  Follower.belongsTo(models.User, { foreignKey: 'follower_id', as: 'Follower' });
  Follower.belongsTo(models.User, { foreignKey: 'following_id', as: 'Following' });
};


export default Follower;