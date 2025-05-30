require('dotenv').config();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary environment variables are not set. Please check your .env file.');
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'socialmedia_posts',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'mov', 'avi', 'webm'],
        transformation: [{ width: 800, height: 800, crop: 'limit' }]
    }
}); 

const upload = multer({ storage: storage });

module.exports = upload;