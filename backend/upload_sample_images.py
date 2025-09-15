#!/usr/bin/env python3
"""
Script to upload sample images to Cloudinary for the JR Graham Center
"""

import os
import sys
import requests
from io import BytesIO
sys.path.insert(0, os.path.dirname(__file__))

from src.services.cloudinary_service import CloudinaryService
from src.main import app
from src.models.rental_models import db, RentalSpace

# Sample images from Unsplash (free to use)
SAMPLE_IMAGES = {
    "fellowship_hall": [
        "https://images.unsplash.com/photo-1519167758481-83f29c7c8b8b?w=800&h=600&fit=crop",  # Church interior
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",  # Event hall
    ],
    "outdoor_pavilion": [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",  # Outdoor pavilion
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",  # Picnic area
    ],
    "conference_room": [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",  # Conference room
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",  # Meeting room
    ],
    "softball_field": [
        "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&h=600&fit=crop",  # Baseball field
        "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop",  # Sports field
    ],
    "kitchen_facility": [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",  # Commercial kitchen
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",  # Kitchen equipment
    ]
}

def download_image(url):
    """Download an image from URL"""
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        return BytesIO(response.content)
    except Exception as e:
        print(f"Error downloading image from {url}: {str(e)}")
        return None

def upload_sample_images():
    """Upload sample images to Cloudinary and update database"""
    
    print("Uploading sample images to Cloudinary...")
    print("=" * 60)
    
    with app.app_context():
        # Get all rental spaces
        spaces = RentalSpace.query.all()
        
        for space in spaces:
            print(f"\nProcessing space: {space.name}")
            
            # Determine which images to use based on space name
            space_key = None
            if "fellowship" in space.name.lower() or "hall" in space.name.lower():
                space_key = "fellowship_hall"
            elif "pavilion" in space.name.lower() or "outdoor" in space.name.lower():
                space_key = "outdoor_pavilion"
            elif "conference" in space.name.lower() or "meeting" in space.name.lower():
                space_key = "conference_room"
            elif "softball" in space.name.lower() or "field" in space.name.lower():
                space_key = "softball_field"
            elif "kitchen" in space.name.lower():
                space_key = "kitchen_facility"
            
            if not space_key or space_key not in SAMPLE_IMAGES:
                print(f"  ⚠️  No sample images defined for {space.name}")
                continue
            
            uploaded_urls = []
            
            for i, image_url in enumerate(SAMPLE_IMAGES[space_key]):
                print(f"  📥 Downloading image {i+1}...")
                
                # Download image
                image_data = download_image(image_url)
                if not image_data:
                    continue
                
                # Upload to Cloudinary
                folder = f"jrgraham-center/spaces/{space.id}"
                public_id = f"{space.name.lower().replace(' ', '_')}_image_{i+1}"
                
                print(f"  ☁️  Uploading to Cloudinary...")
                result = CloudinaryService.upload_image(
                    image_data,
                    folder=folder,
                    public_id=public_id
                )
                
                if result['success']:
                    uploaded_urls.append(result['url'])
                    print(f"  ✅ Uploaded: {result['url']}")
                else:
                    print(f"  ❌ Upload failed: {result['error']}")
            
            # Update space photos in database
            if uploaded_urls:
                space.photos = uploaded_urls
                db.session.commit()
                print(f"  💾 Updated database with {len(uploaded_urls)} photos")
            else:
                print(f"  ⚠️  No photos uploaded for {space.name}")
        
        print("\n" + "=" * 60)
        print("Sample image upload completed!")
        
        # Print summary
        spaces = RentalSpace.query.all()
        total_photos = sum(len(space.photos or []) for space in spaces)
        print(f"Total photos uploaded: {total_photos}")
        
        for space in spaces:
            photo_count = len(space.photos or [])
            print(f"  {space.name}: {photo_count} photos")

if __name__ == "__main__":
    upload_sample_images()
