const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Image files to upload (from the home directory)
const imagesToUpload = [
  {
    localPath: '/home/ubuntu/fellowship_hall_classroom.webp',
    publicId: 'jrgraham/fellowship_hall_classroom',
    tags: ['jrgraham', 'fellowship_hall', 'meeting_room']
  },
  {
    localPath: '/home/ubuntu/conference_room_u_shape.webp',
    publicId: 'jrgraham/conference_room_u_shape',
    tags: ['jrgraham', 'conference_room', 'meeting_room']
  },
  {
    localPath: '/home/ubuntu/small_meeting_room.webp',
    publicId: 'jrgraham/small_meeting_room',
    tags: ['jrgraham', 'small_meeting', 'meeting_room']
  },
  {
    localPath: '/home/ubuntu/outdoor_pavilion_field.webp',
    publicId: 'jrgraham/outdoor_pavilion_field',
    tags: ['jrgraham', 'outdoor', 'pavilion', 'field']
  },
  {
    localPath: '/home/ubuntu/restroom_facilities.webp',
    publicId: 'jrgraham/restroom_facilities',
    tags: ['jrgraham', 'facilities', 'restroom']
  }
];

async function uploadImages() {
  console.log('🚀 Starting Cloudinary image upload process...');
  console.log(`📁 Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  
  const uploadResults = [];
  
  for (const image of imagesToUpload) {
    try {
      // Check if file exists
      if (!fs.existsSync(image.localPath)) {
        console.log(`⚠️  File not found: ${image.localPath}`);
        continue;
      }
      
      console.log(`📤 Uploading: ${path.basename(image.localPath)}...`);
      
      const result = await cloudinary.uploader.upload(image.localPath, {
        public_id: image.publicId,
        tags: image.tags,
        folder: 'jrgraham',
        resource_type: 'image',
        overwrite: true,
        transformation: [
          { width: 1200, height: 800, crop: 'fill', quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      });
      
      uploadResults.push({
        originalFile: image.localPath,
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      });
      
      console.log(`✅ Uploaded: ${result.public_id}`);
      console.log(`   URL: ${result.secure_url}`);
      console.log(`   Size: ${result.width}x${result.height} (${Math.round(result.bytes/1024)}KB)`);
      
    } catch (error) {
      console.error(`❌ Error uploading ${image.localPath}:`, error.message);
    }
  }
  
  console.log(`\n🎉 Upload complete! Successfully uploaded ${uploadResults.length} images.`);
  
  // Save upload results for reference
  const resultsFile = path.join(__dirname, 'cloudinary_upload_results.json');
  fs.writeFileSync(resultsFile, JSON.stringify(uploadResults, null, 2));
  console.log(`📄 Upload results saved to: ${resultsFile}`);
  
  // Display summary
  console.log('\n📋 Upload Summary:');
  uploadResults.forEach((result, index) => {
    console.log(`${index + 1}. ${result.publicId}`);
    console.log(`   ${result.url}`);
  });
  
  return uploadResults;
}

// Run the upload process
uploadImages()
  .then((results) => {
    console.log('\n✨ All images uploaded successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Upload process failed:', error);
    process.exit(1);
  });
