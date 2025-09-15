const { drizzle } = require('drizzle-orm/neon-http');
const { neon } = require('@neondatabase/serverless');
const { rentalSpaces } = require('./db/schema.ts');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

const jrgrahamSpaces = [
  {
    id: uuidv4(),
    name: 'Main Fellowship Hall',
    description: 'Large fellowship hall with classroom-style seating arrangement, perfect for conferences, workshops, training sessions, and large group meetings. Features modern amenities and professional setup with capacity for up to 60 people.',
    pricePerHour: '75.00',
    capacity: 60,
    photos: JSON.stringify([
      {
        url: 'https://res.cloudinary.com/jrgraham/image/upload/v1/fellowship_hall_classroom',
        alt: 'Main Fellowship Hall with classroom setup',
        caption: 'Spacious fellowship hall with professional table and chair arrangement'
      }
    ]),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    name: 'Conference Room',
    description: 'Professional conference room with U-shaped table configuration, ideal for board meetings, small conferences, and intimate group discussions. Modern setup with excellent acoustics and capacity for up to 35 people.',
    pricePerHour: '50.00',
    capacity: 35,
    photos: JSON.stringify([
      {
        url: 'https://res.cloudinary.com/jrgraham/image/upload/v1/conference_room_u_shape',
        alt: 'Conference room with U-shaped table setup',
        caption: 'Professional conference room with modern amenities'
      }
    ]),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    name: 'Small Meeting Room',
    description: 'Intimate meeting space perfect for small group discussions, one-on-one meetings, and private consultations. Comfortable and professional environment with capacity for up to 12 people.',
    pricePerHour: '30.00',
    capacity: 12,
    photos: JSON.stringify([
      {
        url: 'https://res.cloudinary.com/jrgraham/image/upload/v1/small_meeting_room',
        alt: 'Small meeting room with intimate setup',
        caption: 'Cozy meeting space for small groups and consultations'
      }
    ]),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    name: 'Outdoor Pavilion & Field',
    description: 'Large outdoor space featuring covered pavilion area and open field, perfect for outdoor events, recreational activities, and large gatherings. Ideal for community events and celebrations with capacity for up to 150 people.',
    pricePerHour: '100.00',
    capacity: 150,
    photos: JSON.stringify([
      {
        url: 'https://res.cloudinary.com/jrgraham/image/upload/v1/outdoor_pavilion_field',
        alt: 'Outdoor pavilion and field area',
        caption: 'Spacious outdoor venue with covered pavilion and open field'
      }
    ]),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function populateSpaces() {
  try {
    console.log('Starting to populate JR Graham Center rental spaces...');
    
    // Insert all spaces
    for (const space of jrgrahamSpaces) {
      await db.insert(rentalSpaces).values(space);
      console.log(`✅ Inserted: ${space.name}`);
    }
    
    console.log('🎉 Successfully populated all JR Graham Center rental spaces!');
    console.log(`📊 Total spaces added: ${jrgrahamSpaces.length}`);
    
    // Display summary
    console.log('\n📋 Summary of added spaces:');
    jrgrahamSpaces.forEach((space, index) => {
      console.log(`${index + 1}. ${space.name} - $${space.pricePerHour}/hour (Capacity: ${space.capacity})`);
    });
    
  } catch (error) {
    console.error('❌ Error populating spaces:', error);
    process.exit(1);
  }
}

// Run the population script
populateSpaces();
