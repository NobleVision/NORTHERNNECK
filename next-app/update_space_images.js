const { drizzle } = require('drizzle-orm/neon-http');
const { neon } = require('@neondatabase/serverless');
const { rentalSpaces } = require('./db/schema.ts');
const { eq } = require('drizzle-orm');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// Updated image URLs from Cloudinary
const spaceImageUpdates = [
  {
    spaceName: 'Main Fellowship Hall',
    photos: JSON.stringify([
      {
        url: 'https://res.cloudinary.com/dod8ajzjd/image/upload/v1757913344/jrgraham/jrgraham/fellowship_hall_classroom.jpg',
        alt: 'Main Fellowship Hall with classroom setup',
        caption: 'Spacious fellowship hall with professional table and chair arrangement'
      }
    ])
  },
  {
    spaceName: 'Conference Room',
    photos: JSON.stringify([
      {
        url: 'https://res.cloudinary.com/dod8ajzjd/image/upload/v1757913345/jrgraham/jrgraham/conference_room_u_shape.jpg',
        alt: 'Conference room with U-shaped table setup',
        caption: 'Professional conference room with modern amenities'
      }
    ])
  },
  {
    spaceName: 'Small Meeting Room',
    photos: JSON.stringify([
      {
        url: 'https://res.cloudinary.com/dod8ajzjd/image/upload/v1757913346/jrgraham/jrgraham/small_meeting_room.jpg',
        alt: 'Small meeting room with intimate setup',
        caption: 'Cozy meeting space for small groups and consultations'
      }
    ])
  },
  {
    spaceName: 'Outdoor Pavilion & Field',
    photos: JSON.stringify([
      {
        url: 'https://res.cloudinary.com/dod8ajzjd/image/upload/v1757913347/jrgraham/jrgraham/outdoor_pavilion_field.png',
        alt: 'Outdoor pavilion and field area',
        caption: 'Spacious outdoor venue with covered pavilion and open field'
      }
    ])
  }
];

async function updateSpaceImages() {
  try {
    console.log('🔄 Starting to update space images with Cloudinary URLs...');
    
    for (const update of spaceImageUpdates) {
      const result = await db
        .update(rentalSpaces)
        .set({ 
          photos: update.photos,
          updatedAt: new Date()
        })
        .where(eq(rentalSpaces.name, update.spaceName));
      
      console.log(`✅ Updated images for: ${update.spaceName}`);
    }
    
    console.log('🎉 Successfully updated all space images!');
    
    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    const allSpaces = await db.select().from(rentalSpaces);
    
    allSpaces.forEach(space => {
      console.log(`\n📍 ${space.name}:`);
      if (space.photos) {
        try {
          const photos = typeof space.photos === 'string' ? JSON.parse(space.photos) : space.photos;
          if (Array.isArray(photos)) {
            photos.forEach((photo, index) => {
              console.log(`   Image ${index + 1}: ${photo.url}`);
            });
          } else {
            console.log('   Photos data is not an array');
          }
        } catch (e) {
          console.log(`   Error parsing photos: ${e.message}`);
        }
      } else {
        console.log('   No images found');
      }
    });
    
  } catch (error) {
    console.error('❌ Error updating space images:', error);
    process.exit(1);
  }
}

// Run the update
updateSpaceImages();
