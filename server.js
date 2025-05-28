const express = require('express');
const sequelize = require('./db');
const userRoutes = require('./routes/users');
const followRoutes = require('./routes/follow');
const User = require('./model/user.model');
const Follower = require('./model/follow.model');

require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/follow', followRoutes);

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// app.get('/test', (req, res) => {
//   res.json({ message: 'Server is working' });
// });

User.hasMany(Follower, { foreignKey: 'following_id', as: 'Followers' });
User.hasMany(Follower, { foreignKey: 'follower_id', as: 'Followings' });

Follower.belongsTo(User, { foreignKey: 'follower_id', as: 'Follower' });
Follower.belongsTo(User, { foreignKey: 'following_id', as: 'Following' });

sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL via Sequelize');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to PostgreSQL', err);
  });

  