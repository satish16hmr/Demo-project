import dotenv from 'dotenv';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

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

function getCloudinaryResourceType(imageUrl) {
    if (!imageUrl) return 'image';
    const ext = imageUrl.split('.').pop().toLowerCase();
    if (['mp4', 'mov', 'avi', 'webm'].includes(ext))
        return 'video';
        return 'image';
}

function getCloudinaryPublicId(imageUrl) {
    if (!imageUrl) return null;
    const parts = imageUrl.split('/');
    const fileWithExt = parts[parts.length - 1];
    const publicId = fileWithExt.substring(0, fileWithExt.lastIndexOf('.'));
    const folderIndex = parts.findIndex(p => p === 'socialmedia_posts');
    if (folderIndex !== -1) {
        return parts.slice(folderIndex).join('/').replace(/\.[^/.]+$/, '');
    }
    return publicId;
}

const deleteFromCloudinary = async (publicId, imageUrl) => {
    try {
        const resourceType = getCloudinaryResourceType(imageUrl);
        return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
        throw new Error('Failed to delete file from Cloudinary: ' + error.message);
    }
};

const upload = multer({ storage: storage });

export { upload as default, deleteFromCloudinary, getCloudinaryPublicId };