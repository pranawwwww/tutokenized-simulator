import warp as wp
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.animation as animation
import matplotlib.pyplot as plt
import pyglet
import warp.render
import json
import base64
import io
import time
import platform
import psutil
import subprocess
import sys

# Warp config
wp.config.quiet = True
wp.init()

# Enable headless rendering for server environments
pyglet.options["headless"] = True

# ---------- Benchmarking and System Info ----------

class BenchmarkTracker:
    def __init__(self):
        self.frame_times = []
        self.field_generation_times = []
        self.marching_cubes_times = []
        self.rendering_times = []
        self.total_start_time = None
        self.frame_start_time = None
        
    def start_total_timer(self):
        self.total_start_time = time.perf_counter()
        
    def start_frame_timer(self):
        self.frame_start_time = time.perf_counter()
        
    def log_field_generation(self, duration):
        self.field_generation_times.append(duration)
        
    def log_marching_cubes(self, duration):
        self.marching_cubes_times.append(duration)
        
    def log_rendering(self, duration):
        self.rendering_times.append(duration)
        
    def end_frame_timer(self):
        if self.frame_start_time:
            frame_duration = time.perf_counter() - self.frame_start_time
            self.frame_times.append(frame_duration)
            return frame_duration
        return 0
        
    def get_total_time(self):
        if self.total_start_time:
            return time.perf_counter() - self.total_start_time
        return 0
        
    def get_averages(self):
        return {
            'avg_frame_time': np.mean(self.frame_times) if self.frame_times else 0,
            'avg_field_generation': np.mean(self.field_generation_times) if self.field_generation_times else 0,
            'avg_marching_cubes': np.mean(self.marching_cubes_times) if self.marching_cubes_times else 0,
            'avg_rendering': np.mean(self.rendering_times) if self.rendering_times else 0,
            'total_time': self.get_total_time(),
            'frame_count': len(self.frame_times)
        }

def get_gpu_info():
    """Get GPU information if available"""
    gpu_info = {"name": "Unknown", "memory_total": 0, "memory_used": 0, "utilization": 0}
    
    try:
        # Try nvidia-smi for NVIDIA GPUs
        result = subprocess.run(['nvidia-smi', '--query-gpu=name,memory.total,memory.used,utilization.gpu', '--format=csv,noheader,nounits'], 
                               capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            lines = result.stdout.strip().split('\n')
            if lines:
                parts = lines[0].split(', ')
                if len(parts) >= 4:
                    gpu_info = {
                        "name": parts[0].strip(),
                        "memory_total": int(parts[1].strip()),
                        "memory_used": int(parts[2].strip()),
                        "utilization": int(parts[3].strip())
                    }
    except:
        pass
    
    return gpu_info

def get_system_info():
    """Get comprehensive system information"""
    try:
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        gpu_info = get_gpu_info()
        
        return {
            "cpu": {
                "name": platform.processor(),
                "cores": psutil.cpu_count(logical=False),
                "threads": psutil.cpu_count(logical=True),
                "utilization": cpu_percent,
                "frequency": psutil.cpu_freq().current if psutil.cpu_freq() else 0
            },
            "memory": {
                "total": memory.total,
                "used": memory.used,
                "available": memory.available,
                "percent": memory.percent
            },
            "gpu": gpu_info,
            "platform": {
                "system": platform.system(),
                "version": platform.version(),
                "architecture": platform.architecture()[0],
                "python_version": sys.version
            }
        }
    except Exception as e:
        print(f"Warning: Could not get system info: {e}")
        return {}

# ---------- SDF Functions ----------

@wp.func
def sdf_create_box(pos: wp.vec3, size: wp.vec3):
    q = wp.vec3(
        wp.abs(pos[0]) - size[0],
        wp.abs(pos[1]) - size[1],
        wp.abs(pos[2]) - size[2],
    )
    qp = wp.vec3(wp.max(q[0], 0.0), wp.max(q[1], 0.0), wp.max(q[2], 0.0))
    return wp.length(qp) + wp.min(wp.max(q[0], wp.max(q[1], q[2])), 0.0)


@wp.func
def sdf_create_torus(pos: wp.vec3, major_radius: float, minor_radius: float):
    q = wp.vec2(wp.length(wp.vec2(pos[0], pos[2])) - major_radius, pos[1])
    return wp.length(q) - minor_radius


@wp.func
def sdf_translate(pos: wp.vec3, offset: wp.vec3):
    return pos - offset


@wp.func
def sdf_rotate(pos: wp.vec3, angles: wp.vec3):
    rot = wp.quat_rpy(wp.radians(angles[0]), wp.radians(angles[1]), wp.radians(angles[2]))
    return wp.quat_rotate_inv(rot, pos)


@wp.func
def sdf_smooth_min(a: float, b: float, radius: float):
    h = wp.max(radius - wp.abs(a - b), 0.0) / radius
    return wp.min(a, b) - h * h * h * radius * (1.0 / 6.0)


@wp.kernel(enable_backward=False)
def make_field(
    torus_altitude: float,
    torus_major_radius: float,
    torus_minor_radius: float,
    smooth_min_radius: float,
    dim: int,
    time: float,
    out_data: wp.array3d(dtype=float),
):
    i, j, k = wp.tid()

    pos = wp.vec3(
        2.0 * ((float(i) + 0.5) / float(dim)) - 1.0,
        2.0 * ((float(j) + 0.5) / float(dim)) - 1.0,
        2.0 * ((float(k) + 0.5) / float(dim)) - 1.0,
    )

    box = sdf_create_box(sdf_translate(pos, wp.vec3(0.0, -0.7, 0.0)), wp.vec3(0.9, 0.3, 0.9))
    torus = sdf_create_torus(
        sdf_rotate(
            sdf_translate(pos, wp.vec3(0.0, torus_altitude, 0.0)),
            wp.vec3(wp.sin(time) * 90.0, wp.cos(time) * 45.0, 0.0),
        ),
        torus_major_radius,
        torus_minor_radius,
    )

    out_data[i, j, k] = sdf_smooth_min(box, torus, smooth_min_radius)

# ---------- Simulation Settings ----------

# Initialize benchmark tracker
benchmark = BenchmarkTracker()

resolution = (512, 384)
num_frames = 30  # Reduced for faster execution
fps = 30

dim = 32  # Reduced for faster execution
max_verts = int(1e6)
max_tris = int(1e6)

torus_altitude = -0.5
torus_major_radius = 0.5
torus_minor_radius = 0.1
smooth_min_radius = 0.5

field = wp.zeros((dim, dim, dim), dtype=float)
mc = wp.MarchingCubes(dim, dim, dim, max_verts, max_tris)

camera_pos = (16.0, 16.0, 75.0)  # Adjusted for smaller dim
camera_front = (0.0, -0.2, -1.0)

renderer = wp.render.OpenGLRenderer(
    fps=fps,
    screen_width=resolution[0],
    screen_height=resolution[1],
    camera_pos=camera_pos,
    camera_front=camera_front,
    far_plane=200.0,
    draw_grid=False,
    draw_axis=False,
    vsync=False,
    headless=True,  # Enable headless mode for server
)

image = wp.empty(shape=(resolution[1], resolution[0], 3), dtype=float)

# ---------- Frame Rendering Loop ----------

renders = []
print("Starting WARP volume simulation...")
print("Collecting system information...")

# Get initial system info
system_info = get_system_info()
benchmark.start_total_timer()

try:
    for frame in range(num_frames):
        print(f"Rendering frame {frame + 1}/{num_frames}")
        benchmark.start_frame_timer()
        
        # Time field generation
        field_start = time.perf_counter()
        wp.launch(
            make_field,
            dim=field.shape,
            inputs=(
                torus_altitude,
                torus_major_radius,
                torus_minor_radius,
                smooth_min_radius,
                dim,
                frame / fps,
            ),
            outputs=(field,),
        )
        wp.synchronize()  # Ensure GPU work is complete
        field_time = time.perf_counter() - field_start
        benchmark.log_field_generation(field_time)
        
        # Time marching cubes
        mc_start = time.perf_counter()
        mc.surface(field, 0.0)
        wp.synchronize()  # Ensure GPU work is complete
        mc_time = time.perf_counter() - mc_start
        benchmark.log_marching_cubes(mc_time)
        
        # Time rendering
        render_start = time.perf_counter()
        renderer.begin_frame(frame / num_frames)
        renderer.render_mesh(
            "surface",
            mc.verts.numpy(),
            mc.indices.numpy(),
            colors=((0.35, 0.55, 0.9),) * len(mc.verts),
            update_topology=True,
        )
        renderer.end_frame()
        renderer.get_pixels(image, split_up_tiles=False, mode="rgb")
        render_time = time.perf_counter() - render_start
        benchmark.log_rendering(render_time)
        
        # End frame timing
        frame_total = benchmark.end_frame_timer()
        
        # Log frame performance
        print(f"  Frame {frame + 1} timings: Field={field_time:.4f}s, MC={mc_time:.4f}s, Render={render_time:.4f}s, Total={frame_total:.4f}s")
        
        renders.append(wp.clone(image, device="cpu", pinned=True))

except Exception as e:
    print(f"ERROR during frame rendering: {e}")
    # Output error format that VideoSimulation can handle with benchmark data
    error_output = {
        'type': 'gif_animation',
        'error': f'Frame rendering failed: {str(e)}',
        'fps': fps,
        'resolution': resolution,
        'frame_count': 0,
        'duration': 0,
        'file_size_bytes': 0,
        'benchmark_data': {
            'system_info': system_info,
            'performance_metrics': benchmark.get_averages(),
            'error_occurred': True
        }
    }
    print(f"GIF_OUTPUT:{json.dumps(error_output)}")
    exit(1)

# ---------- Convert frames to GIF for frontend ----------

def frame_to_pil_image(frame_array):
    """Convert numpy frame to PIL Image"""
    try:
        # Convert to uint8
        if frame_array.dtype != np.uint8:
            frame_uint8 = (frame_array * 255).astype(np.uint8)
        else:
            frame_uint8 = frame_array
        
        try:
            from PIL import Image
            return Image.fromarray(frame_uint8)
        except ImportError:
            print("WARNING: PIL not available, cannot create GIF")
            return None
    except Exception as e:
        print(f"ERROR: Frame conversion failed: {e}")
        return None

print("Converting frames to GIF animation...")
gif_frames = []
conversion_start = time.perf_counter()

try:
    for i, render in enumerate(renders):
        frame_data = render.numpy()
        pil_image = frame_to_pil_image(frame_data)
        if pil_image:
            gif_frames.append(pil_image)
            if (i + 1) % 5 == 0:  # Progress indicator
                print(f"  Converted frame {i + 1}/{len(renders)}")
        else:
            print(f"WARNING: Failed to convert frame {i + 1}")

    conversion_time = time.perf_counter() - conversion_start
    print(f"Frame conversion completed in {conversion_time:.4f}s")

except Exception as e:
    print(f"ERROR during frame conversion: {e}")
    # Output error format with benchmark data
    error_output = {
        'type': 'gif_animation',
        'error': f'Frame conversion failed: {str(e)}',
        'fps': fps,
        'resolution': resolution,
        'frame_count': 0,
        'duration': 0,
        'file_size_bytes': 0,
        'benchmark_data': {
            'system_info': system_info,
            'performance_metrics': benchmark.get_averages(),
            'error_occurred': True
        }
    }
    print(f"GIF_OUTPUT:{json.dumps(error_output)}")
    exit(1)

# Create GIF in memory
if gif_frames:
    try:
        print("Creating GIF animation...")
        gif_buffer = io.BytesIO()
        gif_frames[0].save(
            gif_buffer,
            format='GIF',
            save_all=True,
            append_images=gif_frames[1:],
            duration=int(1000/fps),  # Duration per frame in milliseconds
            loop=0,  # Infinite loop
            optimize=True
        )
        
        # Get raw byte data for frontend compatibility
        gif_bytes = gif_buffer.getvalue()
        gif_bytestream = list(gif_bytes)  # Convert to list of integers
        
        # Convert to base64 as backup
        gif_base64 = base64.b64encode(gif_bytes).decode('utf-8')
        
        # Output GIF data as JSON for backend to capture
        # This format matches what VideoSimulation.tsx expects
        gif_output = {
            'type': 'gif_animation',
            'gif_data': gif_base64,  # base64 format as backup
            'gif_bytestream': gif_bytestream,  # Raw bytes as integer array (preferred)
            'fps': fps,
            'resolution': resolution,
            'frame_count': len(gif_frames),
            'duration': len(gif_frames) / fps,
            'file_size_bytes': len(gif_bytes),
            'gif_filename': f'warp_volume_{len(gif_frames)}frames.gif'
        }
        
        print(f"GIF_OUTPUT:{json.dumps(gif_output)}")
        print(f"Simulation complete! Generated GIF with {len(gif_frames)} frames.")
        print(f"GIF size: {len(gif_bytes)} bytes")
        print(f"Bytestream length: {len(gif_bytestream)} integers")
    
    except Exception as e:
        print(f"ERROR during GIF creation: {e}")
        # Output error format
        error_output = {
            'type': 'gif_animation',
            'error': f'GIF creation failed: {str(e)}',
            'fps': fps,
            'resolution': resolution,
            'frame_count': len(gif_frames),
            'duration': 0,
            'file_size_bytes': 0
        }
        print(f"GIF_OUTPUT:{json.dumps(error_output)}")

else:
    # Output error format that VideoSimulation can handle
    error_output = {
        'type': 'gif_animation',
        'error': 'No frames were generated for GIF creation',
        'fps': fps,
        'resolution': resolution,
        'frame_count': 0,
        'duration': 0,
        'file_size_bytes': 0
    }
    print(f"GIF_OUTPUT:{json.dumps(error_output)}")
    print("ERROR: No frames were generated for GIF creation.")