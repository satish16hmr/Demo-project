const express = require('express');
const sequelize = require('./config/db');
const userRoutes = require('./routes/users.route');
const followRoutes = require('./routes/follow.route');
const postRoutes = require('./routes/post.route');
const likeRoutes = require('./routes/like.route');
const models = require('./model');

require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.set("view engine", "ejs");

app.use('/users', userRoutes);
app.use('/follow', followRoutes);
app.use('/post', postRoutes);
app.use('/like', likeRoutes);

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});


app.get('/forgot-password', (req, res) => {
  res.render('forgot-password', { token: req.query.token });
});

// after getting token send this to this url http://localhost:3000/forgot-password?token=RESET_TOKEN 

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

