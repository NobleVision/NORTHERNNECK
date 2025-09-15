from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
import tempfile
from src.services.cloudinary_service import CloudinaryService
from src.models.rental_models import db, RentalSpace

images_bp = Blueprint('images', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@images_bp.route('/upload', methods=['POST'])
def upload_image():
    """Upload a single image to Cloudinary"""
    try:
        # Check if file is present in request
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No file provided'
            }), 400
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400
        
        # Check file extension
        if not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'error': f'File type not allowed. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'
            }), 400
        
        # Get optional parameters
        folder = request.form.get('folder', 'jrgraham-center/general')
        public_id = request.form.get('public_id')
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file.filename.rsplit('.', 1)[1].lower()}") as temp_file:
            file.save(temp_file.name)
            
            # Upload to Cloudinary
            result = CloudinaryService.upload_image(
                temp_file.name,
                folder=folder,
                public_id=public_id
            )
            
            # Clean up temporary file
            os.unlink(temp_file.name)
            
            if result['success']:
                return jsonify({
                    'success': True,
                    'data': {
                        'url': result['url'],
                        'public_id': result['public_id'],
                        'width': result['width'],
                        'height': result['height'],
                        'format': result['format'],
                        'size_bytes': result['bytes']
                    }
                }), 200
            else:
                return jsonify({
                    'success': False,
                    'error': result['error']
                }), 500
                
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@images_bp.route('/upload-multiple', methods=['POST'])
def upload_multiple_images():
    """Upload multiple images to Cloudinary"""
    try:
        # Check if files are present in request
        if 'files' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No files provided'
            }), 400
        
        files = request.files.getlist('files')
        
        if not files or all(file.filename == '' for file in files):
            return jsonify({
                'success': False,
                'error': 'No files selected'
            }), 400
        
        # Get optional parameters
        folder = request.form.get('folder', 'jrgraham-center/general')
        
        uploaded_images = []
        errors = []
        
        for i, file in enumerate(files):
            if file.filename == '':
                continue
                
            if not allowed_file(file.filename):
                errors.append(f'File {file.filename}: Invalid file type')
                continue
            
            try:
                # Create temporary file
                with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file.filename.rsplit('.', 1)[1].lower()}") as temp_file:
                    file.save(temp_file.name)
                    
                    # Upload to Cloudinary
                    result = CloudinaryService.upload_image(
                        temp_file.name,
                        folder=folder
                    )
                    
                    # Clean up temporary file
                    os.unlink(temp_file.name)
                    
                    if result['success']:
                        uploaded_images.append({
                            'url': result['url'],
                            'public_id': result['public_id'],
                            'width': result['width'],
                            'height': result['height'],
                            'format': result['format'],
                            'size_bytes': result['bytes'],
                            'original_filename': file.filename
                        })
                    else:
                        errors.append(f'File {file.filename}: {result["error"]}')
                        
            except Exception as e:
                errors.append(f'File {file.filename}: {str(e)}')
        
        return jsonify({
            'success': len(uploaded_images) > 0,
            'data': {
                'uploaded_images': uploaded_images,
                'upload_count': len(uploaded_images),
                'errors': errors
            }
        }), 200 if len(uploaded_images) > 0 else 400
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@images_bp.route('/spaces/<space_id>/images', methods=['POST'])
def upload_space_images(space_id):
    """Upload images for a specific rental space"""
    try:
        # Verify space exists
        space = RentalSpace.query.get(space_id)
        if not space:
            return jsonify({
                'success': False,
                'error': 'Space not found'
            }), 404
        
        # Check if files are present in request
        if 'files' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No files provided'
            }), 400
        
        files = request.files.getlist('files')
        
        if not files or all(file.filename == '' for file in files):
            return jsonify({
                'success': False,
                'error': 'No files selected'
            }), 400
        
        # Create folder name for this space
        folder = f'jrgraham-center/spaces/{space_id}'
        
        uploaded_images = []
        errors = []
        
        for file in files:
            if file.filename == '':
                continue
                
            if not allowed_file(file.filename):
                errors.append(f'File {file.filename}: Invalid file type')
                continue
            
            try:
                # Create temporary file
                with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file.filename.rsplit('.', 1)[1].lower()}") as temp_file:
                    file.save(temp_file.name)
                    
                    # Upload to Cloudinary
                    result = CloudinaryService.upload_image(
                        temp_file.name,
                        folder=folder
                    )
                    
                    # Clean up temporary file
                    os.unlink(temp_file.name)
                    
                    if result['success']:
                        uploaded_images.append(result['url'])
                    else:
                        errors.append(f'File {file.filename}: {result["error"]}')
                        
            except Exception as e:
                errors.append(f'File {file.filename}: {str(e)}')
        
        # Update space photos in database
        if uploaded_images:
            current_photos = space.photos or []
            updated_photos = current_photos + uploaded_images
            space.photos = updated_photos
            db.session.commit()
        
        return jsonify({
            'success': len(uploaded_images) > 0,
            'data': {
                'space_id': space_id,
                'uploaded_images': uploaded_images,
                'upload_count': len(uploaded_images),
                'total_photos': len(space.photos or []),
                'errors': errors
            }
        }), 200 if len(uploaded_images) > 0 else 400
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@images_bp.route('/delete/<path:public_id>', methods=['DELETE'])
def delete_image(public_id):
    """Delete an image from Cloudinary"""
    try:
        result = CloudinaryService.delete_image(public_id)
        
        if result['success']:
            return jsonify({
                'success': True,
                'message': 'Image deleted successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result.get('error', 'Failed to delete image')
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@images_bp.route('/spaces/<space_id>/images/<path:public_id>', methods=['DELETE'])
def delete_space_image(space_id, public_id):
    """Delete an image from a rental space"""
    try:
        # Verify space exists
        space = RentalSpace.query.get(space_id)
        if not space:
            return jsonify({
                'success': False,
                'error': 'Space not found'
            }), 404
        
        # Delete from Cloudinary
        result = CloudinaryService.delete_image(public_id)
        
        if result['success']:
            # Remove from space photos
            if space.photos:
                # Find and remove the URL containing this public_id
                updated_photos = []
                for photo_url in space.photos:
                    if public_id not in photo_url:
                        updated_photos.append(photo_url)
                
                space.photos = updated_photos
                db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Image deleted successfully',
                'remaining_photos': len(space.photos or [])
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result.get('error', 'Failed to delete image')
            }), 500
            
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@images_bp.route('/gallery/<folder_name>', methods=['GET'])
def get_image_gallery(folder_name):
    """Get a gallery of images from a Cloudinary folder"""
    try:
        max_results = request.args.get('max_results', 100, type=int)
        
        result = CloudinaryService.list_images(
            folder=f'jrgraham-center/{folder_name}',
            max_results=max_results
        )
        
        if result['success']:
            return jsonify({
                'success': True,
                'data': {
                    'folder': folder_name,
                    'images': result['images'],
                    'total_count': result['total_count']
                }
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@images_bp.route('/transform/<path:public_id>', methods=['GET'])
def get_transformed_image(public_id):
    """Get a transformed version of an image"""
    try:
        # Get transformation parameters from query string
        width = request.args.get('width', type=int)
        height = request.args.get('height', type=int)
        crop = request.args.get('crop', 'fill')
        quality = request.args.get('quality', 'auto')
        
        url = CloudinaryService.get_optimized_url(
            public_id,
            width=width,
            height=height,
            crop=crop,
            quality=quality
        )
        
        if url:
            return jsonify({
                'success': True,
                'data': {
                    'public_id': public_id,
                    'transformed_url': url,
                    'parameters': {
                        'width': width,
                        'height': height,
                        'crop': crop,
                        'quality': quality
                    }
                }
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to generate transformed URL'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
