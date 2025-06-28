import warp as wp
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.animation as animation
import matplotlib.pyplot as plt
import pyglet
import warp.render
import time
import json
import base64
import io
import cv2

# Warp config
wp.config.quiet = True
wp.init()

# Enable OpenGL window rendering
pyglet.options["headless"] = False  # Set True if you don't want a window

# ---------- Simple Metrics Collection ----------

class SimpleMetrics:
    """Lightweight metrics for WARP performance showcase"""
    
    def __init__(self):
        # Core performance metrics
        self.frame_times = []
        self.kernel_times = []
        
        # Geometry complexity metrics  
        self.vertex_counts = []
        self.triangle_counts = []
        
        # Real-time streaming data
        self.realtime_data = []
        self.benchmark_data = {}
        
    def time_operation(self, operation, *args, **kwargs):
        """Time any operation and return result + timing"""
        start_time = time.perf_counter()
        result = operation(*args, **kwargs)
        wp.synchronize()  # Ensure GPU completion for WARP operations
        end_time = time.perf_counter()
        return result, end_time - start_time
        
    def log_geometry(self, vertices, triangles):
        """Log geometry complexity"""
        self.vertex_counts.append(len(vertices) if vertices is not None else 0)
        self.triangle_counts.append(len(triangles) if triangles is not None else 0)
        
    def log_realtime_data(self, frame_idx, frame_time, kernel_time, vertex_count):
        """Log real-time data for streaming to frontend"""
        fps = 1.0 / frame_time if frame_time > 0 else 0
        self.realtime_data.append({
            'frame': frame_idx,
            'timestamp': time.time(),
            'fps': fps,
            'frame_time_ms': frame_time * 1000,
            'kernel_time_ms': kernel_time * 1000,
            'vertex_count': vertex_count,
            'triangle_count': len(self.triangle_counts) - 1 if self.triangle_counts else 0
        })
        
    def encode_frame_as_base64(self, image_array):
        """Convert numpy image array to base64 string for web streaming"""
        try:
            # Convert from float [0,1] to uint8 [0,255]
            if image_array.dtype == np.float32 or image_array.dtype == np.float64:
                image_uint8 = (image_array * 255).astype(np.uint8)
            else:
                image_uint8 = image_array
            
            # Convert RGB to BGR for OpenCV
            image_bgr = cv2.cvtColor(image_uint8, cv2.COLOR_RGB2BGR)
            
            # Encode as JPEG
            success, buffer = cv2.imencode('.jpg', image_bgr, [cv2.IMWRITE_JPEG_QUALITY, 85])
            if success:
                return base64.b64encode(buffer).decode('utf-8')
            else:
                return None
        except Exception as e:
            print(f"Error encoding frame: {e}")
            return None
        
    def output_stream_data(self, frame_idx, image_array):
        """Output streaming data in JSON format for web consumption"""
        # Get current metrics
        if len(self.realtime_data) > 0:
            current_data = self.realtime_data[-1].copy()
        else:
            current_data = {
                'frame': frame_idx,
                'timestamp': time.time(),
                'fps': 0,
                'frame_time_ms': 0,
                'kernel_time_ms': 0,
                'vertex_count': 0,
                'triangle_count': 0
            }
        
        # Encode frame
        encoded_frame = self.encode_frame_as_base64(image_array)
        
        # Output streaming data
        stream_data = {
            'type': 'frame_data',
            'frame': frame_idx,
            'image': encoded_frame,
            'metrics': current_data
        }
        
        # Print as JSON for backend to capture
        print(f"STREAM_DATA:{json.dumps(stream_data)}")
        
    def generate_summary_plots(self):
        """Generate clean performance visualization"""
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
        
        # Performance timing
        frames = range(len(self.frame_times))
        ax1.plot(frames, np.array(self.frame_times) * 1000, 'b-', label='Total Frame Time', linewidth=2)
        ax1.plot(frames, np.array(self.kernel_times) * 1000, 'r-', label='GPU Kernel Time', linewidth=2)
        ax1.set_title('WARP Performance Timing')
        ax1.set_xlabel('Frame Number')
        ax1.set_ylabel('Time (ms)')
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        
        # Geometry complexity
        ax2.plot(frames, self.vertex_counts, 'g-', label='Vertices', linewidth=2)
        ax2.plot(frames, self.triangle_counts, 'orange', label='Triangles', linewidth=2)
        ax2.set_title('Dynamic Geometry Complexity')
        ax2.set_xlabel('Frame Number') 
        ax2.set_ylabel('Count')
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        
        plt.tight_layout()
        
        # Save plot as base64 for web
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', dpi=150, bbox_inches='tight')
        buffer.seek(0)
        plot_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        
        # Output plot data
        plot_data = {
            'type': 'benchmark_plot',
            'image': plot_base64
        }
        print(f"PLOT_DATA:{json.dumps(plot_data)}")
        
        plt.close(fig)
        return fig
        
    def print_summary(self):
        """Print concise performance summary and output as JSON"""
        if not self.frame_times:
            return
            
        avg_fps = 1.0 / np.mean(self.frame_times)
        avg_frame_ms = np.mean(self.frame_times) * 1000
        avg_kernel_ms = np.mean(self.kernel_times) * 1000
        avg_vertices = np.mean(self.vertex_counts)
        avg_triangles = np.mean(self.triangle_counts)
        
        # Create benchmark summary for frontend
        self.benchmark_data = {
            'warp_volume_simulation': {
                'score': int(avg_fps * 100),  # FPS-based score
                'status': 'Excellent' if avg_fps > 45 else 'Good' if avg_fps > 30 else 'Average',
                'time': avg_frame_ms / 1000,
                'avg_fps': avg_fps,
                'avg_frame_ms': avg_frame_ms,
                'avg_kernel_ms': avg_kernel_ms,
                'avg_vertices': int(avg_vertices),
                'avg_triangles': int(avg_triangles),
                'total_frames': len(self.frame_times)
            }
        }
        
        # Output benchmark data for frontend
        print(f"BENCHMARK_DATA:{json.dumps(self.benchmark_data)}")
        
        print("\n" + "="*50)
        print("WARP PERFORMANCE SUMMARY")
        print("="*50)
        print(f"Average FPS: {avg_fps:.1f}")
        print(f"Frame Time: {avg_frame_ms:.2f}ms")
        print(f"GPU Kernel: {avg_kernel_ms:.2f}ms")
        print(f"Avg Vertices: {avg_vertices:.0f}")
        print(f"Avg Triangles: {avg_triangles:.0f}")
        print("="*50)

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

resolution = (512, 384)
num_frames = 120
fps = 60

dim = 64
max_verts = int(1e6)
max_tris = int(1e6)

torus_altitude = -0.5
torus_major_radius = 0.5
torus_minor_radius = 0.1
smooth_min_radius = 0.5

field = wp.zeros((dim, dim, dim), dtype=float)
mc = wp.MarchingCubes(dim, dim, dim, max_verts, max_tris)

# Initialize simple metrics collector
metrics = SimpleMetrics()

camera_pos = (32.0, 32.0, 150.0)
camera_front = (0.0, -0.2, -1.0)

camera_pos = (32.0, 32.0, 150.0)
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
    vsync=True,
    headless=False,  # Set to True if you want to render in background only
)

image = wp.empty(shape=(resolution[1], resolution[0], 3), dtype=float)

# ---------- Enhanced Frame Rendering Loop with Web Streaming ----------

renders = []
print("Starting WARP simulation with web streaming...")
print(f"Target: {num_frames} frames at {fps} FPS")
print("-" * 40)

# Output initial status
initial_status = {
    'type': 'simulation_start',
    'total_frames': num_frames,
    'target_fps': fps,
    'resolution': resolution
}
print(f"STATUS_DATA:{json.dumps(initial_status)}")

for frame in range(num_frames):
    frame_start = time.perf_counter()
    
    # Time the SDF field generation (GPU kernel)
    _, kernel_time = metrics.time_operation(
        wp.launch,
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
    
    # Marching cubes surface extraction
    mc.surface(field, 0.0)
    
    # Get geometry data and log complexity
    verts_numpy = mc.verts.numpy()
    indices_numpy = mc.indices.numpy()
    metrics.log_geometry(verts_numpy, indices_numpy)
    
    # Render frame
    renderer.begin_frame(frame / num_frames)
    renderer.render_mesh(
        "surface",
        verts_numpy,
        indices_numpy,
        colors=((0.35, 0.55, 0.9),) * len(verts_numpy),
        update_topology=True,
    )
    renderer.end_frame()
    renderer.get_pixels(image, split_up_tiles=False, mode="rgb")
    
    # Convert image for streaming
    image_numpy = image.numpy()
    renders.append(wp.clone(image, device="cpu", pinned=True))
    
    # Record total frame time
    frame_time = time.perf_counter() - frame_start
    metrics.frame_times.append(frame_time)
    metrics.kernel_times.append(kernel_time)
    
    # Log real-time data for streaming
    metrics.log_realtime_data(frame, frame_time, kernel_time, len(verts_numpy))
    
    # Stream frame data to frontend every few frames to avoid overwhelming
    if frame % 5 == 0 or frame == num_frames - 1:
        metrics.output_stream_data(frame, image_numpy)
    
    # Progress update every 20 frames
    if frame % 20 == 0 or frame == num_frames - 1:
        current_fps = 1.0 / frame_time if frame_time > 0 else 0
        progress = (frame + 1) / num_frames * 100
        print(f"Frame {frame+1:3d}/{num_frames} ({progress:5.1f}%) | "
              f"FPS: {current_fps:6.1f} | "
              f"Kernel: {kernel_time*1000:5.2f}ms | "
              f"Geometry: {len(verts_numpy):5d} verts")

wp.synchronize()

# Generate and display performance metrics
print("\nGenerating performance analysis...")
metrics.print_summary()
performance_fig = metrics.generate_summary_plots()

# Output completion status
completion_status = {
    'type': 'simulation_complete',
    'total_frames': num_frames,
    'total_time': sum(metrics.frame_times),
    'avg_fps': 1.0 / np.mean(metrics.frame_times) if metrics.frame_times else 0
}
print(f"STATUS_DATA:{json.dumps(completion_status)}")

# Create video from frames (optional - for fallback)
try:
    print("Creating video file...")
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    video_path = 'warp_simulation.mp4'
    out = cv2.VideoWriter(video_path, fourcc, fps, (resolution[0], resolution[1]))
    
    for render in renders:
        frame_img = render.numpy()
        if frame_img.dtype == np.float32 or frame_img.dtype == np.float64:
            frame_img = (frame_img * 255).astype(np.uint8)
        frame_bgr = cv2.cvtColor(frame_img, cv2.COLOR_RGB2BGR)
        out.write(frame_bgr)
    
    out.release()
    print(f"Video saved as {video_path}")
    
    # Output video file info
    video_info = {
        'type': 'video_ready',
        'path': video_path,
        'frames': num_frames,
        'fps': fps,
        'duration': num_frames / fps
    }
    print(f"VIDEO_DATA:{json.dumps(video_info)}")
    
except Exception as e:
    print(f"Error creating video: {e}")

# ---------- Matplotlib Animation (Optional - for local viewing) ----------
if False:  # Disable for web streaming
    plt.figure(figsize=(resolution[0]/100, resolution[1]/100))
    plt.subplots_adjust(left=0, bottom=0, right=1, top=1)
    plot_img = plt.imshow(renders[0], animated=True)
    plt.axis("off")

    plot_anim = animation.FuncAnimation(
        plt.gcf(),
        lambda f: plot_img.set_data(renders[f]),
        frames=num_frames,
        interval=(1.0 / fps) * 1000.0,
        repeat=True,
    )

    plt.show()
