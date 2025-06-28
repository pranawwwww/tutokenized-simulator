#!/usr/bin/env python3
"""
Simple test script to verify GIF VIDEO_OUTPUT format
"""
import json
import base64
import io

# Create a simple test GIF (or simulate it)
def create_test_gif():
    """Create a minimal test GIF data"""
    try:
        from PIL import Image
        
        # Create simple colored frames
        frames = []
        colors = [(255, 0, 0), (0, 255, 0), (0, 0, 255)]  # Red, Green, Blue
        
        for color in colors:
            img = Image.new('RGB', (100, 100), color)
            frames.append(img)
        
        # Create GIF in memory
        gif_buffer = io.BytesIO()
        frames[0].save(
            gif_buffer,
            format='GIF',
            save_all=True,
            append_images=frames[1:],
            duration=500,  # 500ms per frame
            loop=0
        )
        
        gif_buffer.seek(0)
        gif_data = gif_buffer.getvalue()
        return base64.b64encode(gif_data).decode('utf-8')
    
    except ImportError:
        # Fallback: create dummy data
        dummy_gif_data = b"GIF89a\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x04\x01\x00\x3b"
        return base64.b64encode(dummy_gif_data).decode('utf-8')

print("Starting test GIF simulation...")
print("Creating animated GIF...")

gif_data = create_test_gif()

video_output = {
    'type': 'gif',
    'gif_data': gif_data,
    'fps': 2,  # 2 fps for test
    'resolution': [100, 100],
    'frame_count': 3
}

print(f"VIDEO_OUTPUT:{json.dumps(video_output)}")
print("Test GIF simulation complete!")
