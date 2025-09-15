import os
import cloudinary
import cloudinary.uploader
import cloudinary.api
from cloudinary.utils import cloudinary_url
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME', 'your-cloud-name'),
    api_key=os.getenv('CLOUDINARY_API_KEY', 'your-api-key'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET', 'your-api-secret'),
    secure=True
)

class CloudinaryService:
    """Service class for handling Cloudinary operations"""
    
    @staticmethod
    def upload_image(file_path, folder="jrgraham-center", public_id=None, transformation=None):
        """
        Upload an image to Cloudinary
        
        Args:
            file_path: Path to the image file or file object
            folder: Cloudinary folder to organize images
            public_id: Custom public ID for the image
            transformation: Image transformation parameters
            
        Returns:
            dict: Upload result with URL and metadata
        """
        try:
            upload_options = {
                'folder': folder,
                'resource_type': 'image',
                'quality': 'auto',
                'fetch_format': 'auto'
            }
            
            if public_id:
                upload_options['public_id'] = public_id
                
            if transformation:
                upload_options['transformation'] = transformation
            
            result = cloudinary.uploader.upload(file_path, **upload_options)
            
            return {
                'success': True,
                'url': result['secure_url'],
                'public_id': result['public_id'],
                'width': result['width'],
                'height': result['height'],
                'format': result['format'],
                'bytes': result['bytes']
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    @staticmethod
    def upload_multiple_images(file_paths, folder="jrgraham-center"):
        """
        Upload multiple images to Cloudinary
        
        Args:
            file_paths: List of file paths or file objects
            folder: Cloudinary folder to organize images
            
        Returns:
            list: List of upload results
        """
        results = []
        for file_path in file_paths:
            result = CloudinaryService.upload_image(file_path, folder)
            results.append(result)
        return results
    
    @staticmethod
    def delete_image(public_id):
        """
        Delete an image from Cloudinary
        
        Args:
            public_id: Public ID of the image to delete
            
        Returns:
            dict: Deletion result
        """
        try:
            result = cloudinary.uploader.destroy(public_id)
            return {
                'success': result['result'] == 'ok',
                'result': result['result']
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    @staticmethod
    def get_image_url(public_id, transformation=None):
        """
        Generate a Cloudinary URL for an image
        
        Args:
            public_id: Public ID of the image
            transformation: Image transformation parameters
            
        Returns:
            str: Cloudinary URL
        """
        try:
            url, _ = cloudinary_url(public_id, transformation=transformation, secure=True)
            return url
        except Exception as e:
            return None
    
    @staticmethod
    def get_optimized_url(public_id, width=None, height=None, crop="fill", quality="auto"):
        """
        Get an optimized image URL with transformations
        
        Args:
            public_id: Public ID of the image
            width: Target width
            height: Target height
            crop: Crop mode (fill, fit, scale, etc.)
            quality: Image quality (auto, best, good, etc.)
            
        Returns:
            str: Optimized Cloudinary URL
        """
        transformation = {
            'quality': quality,
            'fetch_format': 'auto'
        }
        
        if width:
            transformation['width'] = width
        if height:
            transformation['height'] = height
        if width or height:
            transformation['crop'] = crop
            
        return CloudinaryService.get_image_url(public_id, transformation)
    
    @staticmethod
    def get_thumbnail_url(public_id, size=300):
        """
        Get a thumbnail URL for an image
        
        Args:
            public_id: Public ID of the image
            size: Thumbnail size (width and height)
            
        Returns:
            str: Thumbnail URL
        """
        return CloudinaryService.get_optimized_url(
            public_id, 
            width=size, 
            height=size, 
            crop="fill"
        )
    
    @staticmethod
    def list_images(folder="jrgraham-center", max_results=100):
        """
        List images in a Cloudinary folder
        
        Args:
            folder: Cloudinary folder name
            max_results: Maximum number of results to return
            
        Returns:
            dict: List of images with metadata
        """
        try:
            result = cloudinary.api.resources(
                type="upload",
                prefix=folder,
                max_results=max_results,
                resource_type="image"
            )
            
            images = []
            for resource in result['resources']:
                images.append({
                    'public_id': resource['public_id'],
                    'url': resource['secure_url'],
                    'width': resource['width'],
                    'height': resource['height'],
                    'format': resource['format'],
                    'bytes': resource['bytes'],
                    'created_at': resource['created_at']
                })
            
            return {
                'success': True,
                'images': images,
                'total_count': len(images)
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    @staticmethod
    def create_image_gallery(public_ids, transformation=None):
        """
        Create a gallery of images with consistent transformations
        
        Args:
            public_ids: List of public IDs
            transformation: Common transformation to apply
            
        Returns:
            list: List of image URLs
        """
        gallery = []
        for public_id in public_ids:
            url = CloudinaryService.get_image_url(public_id, transformation)
            if url:
                gallery.append({
                    'public_id': public_id,
                    'url': url,
                    'thumbnail': CloudinaryService.get_thumbnail_url(public_id)
                })
        return gallery
