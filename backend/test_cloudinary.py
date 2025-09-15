#!/usr/bin/env python3
"""
Test script to verify Cloudinary integration
"""

import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from src.services.cloudinary_service import CloudinaryService

def test_cloudinary_connection():
    """Test basic Cloudinary connection and functionality"""
    
    print("Testing Cloudinary Integration...")
    print("=" * 50)
    
    # Test 1: List existing images
    print("1. Testing image listing...")
    try:
        result = CloudinaryService.list_images(folder="jrgraham-center", max_results=10)
        if result['success']:
            print(f"✅ Successfully connected to Cloudinary")
            print(f"   Found {result['total_count']} images in jrgraham-center folder")
            if result['images']:
                print("   Sample images:")
                for img in result['images'][:3]:
                    print(f"   - {img['public_id']} ({img['format']}, {img['bytes']} bytes)")
        else:
            print(f"❌ Failed to list images: {result['error']}")
    except Exception as e:
        print(f"❌ Error testing image listing: {str(e)}")
    
    print()
    
    # Test 2: Generate optimized URLs
    print("2. Testing URL generation...")
    try:
        # Test with a sample public ID (this might not exist, but should generate URL)
        test_public_id = "jrgraham-center/sample_image"
        
        # Generate different URL variations
        original_url = CloudinaryService.get_image_url(test_public_id)
        thumbnail_url = CloudinaryService.get_thumbnail_url(test_public_id, size=200)
        optimized_url = CloudinaryService.get_optimized_url(test_public_id, width=800, height=600)
        
        print(f"✅ URL generation working:")
        print(f"   Original: {original_url}")
        print(f"   Thumbnail: {thumbnail_url}")
        print(f"   Optimized: {optimized_url}")
        
    except Exception as e:
        print(f"❌ Error testing URL generation: {str(e)}")
    
    print()
    
    # Test 3: Configuration check
    print("3. Testing Cloudinary configuration...")
    try:
        import cloudinary
        config = cloudinary.config()
        
        print(f"✅ Cloudinary configured:")
        print(f"   Cloud Name: {config.cloud_name}")
        print(f"   API Key: {config.api_key[:8]}...")
        print(f"   Secure: {config.secure}")
        
    except Exception as e:
        print(f"❌ Error checking configuration: {str(e)}")
    
    print()
    print("=" * 50)
    print("Cloudinary integration test completed!")

if __name__ == "__main__":
    test_cloudinary_connection()
