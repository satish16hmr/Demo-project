const express = require('express');
const sequelize = require('./db');
const userRoutes = require('./routes/users');
const followRoutes = require('./routes/follow');
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

  