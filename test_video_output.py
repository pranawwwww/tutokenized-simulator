#!/usr/bin/env python3
"""
Simple test script to verify VIDEO_OUTPUT format
"""
import json
import base64

# Create dummy video data in the expected format
dummy_frame_data = b"dummy_image_data_here"
encoded_frame = base64.b64encode(dummy_frame_data).decode('utf-8')

video_output = {
    'frames': [
        {'frame': 0, 'image': encoded_frame},
        {'frame': 1, 'image': encoded_frame},
        {'frame': 2, 'image': encoded_frame}
    ],
    'fps': 30,
    'resolution': [512, 384],
    'frame_count': 3
}

print("Starting test video simulation...")
print("Processing frames...")
print(f"VIDEO_OUTPUT:{json.dumps(video_output)}")
print(f"Test complete! Generated {len(video_output['frames'])} frames.")
