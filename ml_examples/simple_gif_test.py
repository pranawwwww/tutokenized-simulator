#!/usr/bin/env python3
"""
Simple GIF test without WARP dependencies - for testing the complete flow
"""

import json
import base64
import io
import numpy as np
from PIL import Image

print("🎨 Creating test GIF animation...")

# Create test frames with simple animation
frames = []
resolution = (200, 150)
num_frames = 8

for i in range(num_frames):
    # Create animated pattern
    frame_data = np.zeros((resolution[1], resolution[0], 3), dtype=np.uint8)
    
    # Moving colorful rectangle
    x_pos = int((i / num_frames) * (resolution[0] - 40))
    y_pos = 50
    
    # Rainbow colors
    r = int(255 * (i / num_frames))
    g = int(255 * (1 - i / num_frames))
    b = 128
    
    frame_data[y_pos:y_pos+30, x_pos:x_pos+40] = [r, g, b]
    
    # Add some background pattern
    frame_data[::5, ::5] = [50, 50, 100]  # Grid pattern
    
    pil_image = Image.fromarray(frame_data)
    frames.append(pil_image)

print(f"Generated {len(frames)} test frames")

# Create GIF
print("Creating GIF...")
gif_buffer = io.BytesIO()
frames[0].save(
    gif_buffer,
    format='GIF',
    save_all=True,
    append_images=frames[1:],
    duration=150,  # 150ms per frame
    loop=0,
    optimize=True
)

# Convert to base64
gif_base64 = base64.b64encode(gif_buffer.getvalue()).decode('utf-8')

# Create output structure matching our backend expectations
gif_output = {
    'type': 'gif_animation',
    'gif_data': gif_base64,
    'fps': 6,  # ~150ms per frame = 6.67 FPS
    'resolution': list(resolution),
    'frame_count': len(frames),
    'duration': len(frames) * 0.15,  # 150ms per frame
    'file_size_bytes': len(gif_buffer.getvalue())
}

print(f"GIF_OUTPUT:{json.dumps(gif_output)}")
print(f"✅ Test GIF created successfully!")
print(f"📊 {len(frames)} frames, {len(gif_buffer.getvalue())} bytes")
print("🎞️ This should display as an animated GIF in the UI!")
