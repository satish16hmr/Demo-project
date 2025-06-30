import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import './models/index.js'; 

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173", // only allow your frontend origin
  credentials: true,               // allow cookies/credentials
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use('/users', userRoutes);
app.use('/post', postRoutes);

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

app.get('/forgot-password', (req, res) => {
  res.render('forgot-password', { token: req.query.token });
});

try {
  await sequelize.authenticate();
  console.log('Connected to PostgreSQL via Sequelize');
  await sequelize.sync();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
} catch (err) {
  console.error('Failed to connect to PostgreSQL', err);
}

// after getting token send this to this url http://localhost:3000/forgot-password?token=RESET_TOKEN 