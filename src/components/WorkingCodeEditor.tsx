import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Loader2, Cloud, Monitor, Upload, FileText } from 'lucide-react';

interface CodeEditorProps {
  onExecutionResult?: (result: any) => void;
}

const WorkingCodeEditor: React.FC<CodeEditorProps> = ({ onExecutionResult }) => {
  console.log('WorkingCodeEditor rendering...');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
    const [code, setCode] = useState(`# 🎞️ WARP Volume Simulation - GIF Generation
# This creates an animated GIF of a 3D volume simulation

# === WARP VOLUME SIMULATION WITH GIF OUTPUT ===
# Run this to see the new GIF animation flow:

import warp as wp
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import pyglet
import warp.render
import json
import base64
import io

# WARP config
wp.config.quiet = True
wp.init()
pyglet.options["headless"] = True

# Simple SDF functions
@wp.func
def sdf_create_sphere(pos: wp.vec3, radius: float):
    return wp.length(pos) - radius

@wp.func
def sdf_translate(pos: wp.vec3, offset: wp.vec3):
    return pos - offset

@wp.kernel(enable_backward=False)
def make_field(time: float, dim: int, out_data: wp.array3d(dtype=float)):
    i, j, k = wp.tid()
    pos = wp.vec3(
        2.0 * ((float(i) + 0.5) / float(dim)) - 1.0,
        2.0 * ((float(j) + 0.5) / float(dim)) - 1.0,
        2.0 * ((float(k) + 0.5) / float(dim)) - 1.0,
    )
    
    # Animated sphere
    sphere_pos = wp.vec3(wp.sin(time) * 0.5, wp.cos(time) * 0.3, 0.0)
    sphere = sdf_create_sphere(sdf_translate(pos, sphere_pos), 0.4)
    out_data[i, j, k] = sphere

# Simulation settings
resolution = (300, 225)  # Smaller for faster GIF
num_frames = 15
fps = 8
dim = 24

field = wp.zeros((dim, dim, dim), dtype=float)
mc = wp.MarchingCubes(dim, dim, dim, int(5e5), int(5e5))

renderer = wp.render.OpenGLRenderer(
    fps=fps, screen_width=resolution[0], screen_height=resolution[1],
    camera_pos=(12.0, 12.0, 30.0), camera_front=(0.0, -0.2, -1.0),
    far_plane=100.0, draw_grid=False, draw_axis=False,
    vsync=False, headless=True
)

image = wp.empty(shape=(resolution[1], resolution[0], 3), dtype=float)

print("🎬 Starting WARP volume GIF generation...")
gif_frames = []

for frame in range(num_frames):
    print(f"Frame {frame + 1}/{num_frames}")
    
    wp.launch(make_field, dim=field.shape, inputs=(frame / fps, dim), outputs=(field,))
    mc.surface(field, 0.0)
    
    renderer.begin_frame(frame / num_frames)
    renderer.render_mesh("surface", mc.verts.numpy(), mc.indices.numpy(), 
                        colors=((0.2, 0.7, 1.0),) * len(mc.verts), update_topology=True)
    renderer.end_frame()
    
    renderer.get_pixels(image, split_up_tiles=False, mode="rgb")
    frame_data = image.numpy()
    
    if frame_data.dtype != np.uint8:
        frame_data = (frame_data * 255).astype(np.uint8)
    
    try:
        from PIL import Image as PILImage
        pil_image = PILImage.fromarray(frame_data)
        gif_frames.append(pil_image)
    except ImportError:
        print("PIL not available - install with: pip install Pillow")
        break

wp.synchronize()

# Create GIF
if gif_frames:
    print("Creating GIF...")
    gif_buffer = io.BytesIO()
    gif_frames[0].save(gif_buffer, format='GIF', save_all=True, 
                      append_images=gif_frames[1:], duration=int(1000/fps), 
                      loop=0, optimize=True)
    
    gif_base64 = base64.b64encode(gif_buffer.getvalue()).decode('utf-8')
    
    gif_output = {
        'type': 'gif_animation',
        'gif_data': gif_base64,
        'fps': fps,
        'resolution': resolution,
        'frame_count': len(gif_frames),
        'duration': len(gif_frames) / fps,
        'file_size_bytes': len(gif_buffer.getvalue())
    }
    
    print(f"GIF_OUTPUT:{json.dumps(gif_output)}")
    print(f"✅ GIF complete! {len(gif_frames)} frames, {len(gif_buffer.getvalue())} bytes")

# === ALTERNATIVE: Simple Test Pattern ===
# Uncomment this for a basic test without WARP dependencies:

"""
import numpy as np
import json
import base64
import io

try:
    from PIL import Image
    
    print("🎨 Creating test animation...")
    frames = []
    for i in range(10):
        # Create animated pattern
        frame = np.zeros((100, 100, 3), dtype=np.uint8)
        x = int((i / 10) * 80)
        frame[40:60, x:x+20] = [255, 100, 100]  # Moving red box
        frames.append(Image.fromarray(frame))
    
    # Create GIF
    gif_buffer = io.BytesIO()
    frames[0].save(gif_buffer, format='GIF', save_all=True,
                  append_images=frames[1:], duration=100, loop=0)
    
    gif_output = {
        'type': 'gif_animation',
        'gif_data': base64.b64encode(gif_buffer.getvalue()).decode('utf-8'),
        'fps': 10, 'resolution': [100, 100], 'frame_count': 10,
        'duration': 1.0, 'file_size_bytes': len(gif_buffer.getvalue())
    }
    
    print(f"GIF_OUTPUT:{json.dumps(gif_output)}")
    print("✅ Test GIF created!")
    
except ImportError:
    print("Install Pillow: pip install Pillow")
"""

# Check GPU availability
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Device: {device}")

if torch.cuda.is_available():
    print(f"GPU: {torch.cuda.get_device_name(0)}")
else:
    print("Running on CPU - GPU would provide 10-50x speedup!")

# Create a large dataset
print("\\nGenerating training data...")
data_size = 10000
X = torch.randn(data_size, 100, device=device)
y = torch.randint(0, 10, (data_size,), device=device)

# Simple neural network
model = torch.nn.Sequential(
    torch.nn.Linear(100, 256),
    torch.nn.ReLU(),
    torch.nn.Linear(256, 128),
    torch.nn.ReLU(),
    torch.nn.Linear(128, 10)
).to(device)

optimizer = torch.optim.Adam(model.parameters())
criterion = torch.nn.CrossEntropyLoss()

# Training loop with timing
print("\\n🚀 Starting training...")
start_time = time.time()

for epoch in range(100):
    optimizer.zero_grad()
    outputs = model(X)
    loss = criterion(outputs, y)
    loss.backward()
    optimizer.step()
    
    if epoch % 20 == 0:
        print(f"Epoch {epoch}, Loss: {loss.item():.4f}")

training_time = time.time() - start_time
print(f"\\n✅ Training completed in {training_time:.2f} seconds")
print("GPU provides massive speedup for matrix operations!")
"""

# === EXAMPLE 2: Image Processing Acceleration ===
# Uncomment this section to test computer vision acceleration:

"""
import torch
import torch.nn.functional as F
import time
import numpy as np

print("🖼️ Computer Vision GPU Acceleration Test")
print("=" * 40)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Device: {device}")

# Generate batch of images
batch_size = 50
image_size = 256
print(f"\\nGenerating {batch_size} images ({image_size}x{image_size})...")

images = torch.randn(batch_size, 1, image_size, image_size, device=device)

# GPU-accelerated image processing
print("\\n🚀 Starting GPU image processing...")
start_time = time.time()

# Apply Gaussian blur
blur_kernel = torch.ones(1, 1, 5, 5, device=device) / 25
blurred = F.conv2d(images, blur_kernel, padding=2)

# Edge detection with Sobel
sobel_x = torch.tensor([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], 
                      device=device, dtype=torch.float32).view(1, 1, 3, 3)
edges = F.conv2d(blurred, sobel_x, padding=1)

# Batch normalization
normalized = F.normalize(edges, dim=(2, 3))

processing_time = time.time() - start_time
pixels_processed = batch_size * image_size * image_size

print(f"\\n✅ Processed {batch_size} images in {processing_time:.3f} seconds")
print(f"Throughput: {pixels_processed/processing_time/1e6:.1f} megapixels/second")
print("GPU parallel processing >> CPU sequential processing!")
"""

# === SIMPLE DEMO (Currently Active) ===
print("*** NVIDIA GPU Acceleration Showcase ***")
print("=" * 45)

# Simulate CPU vs GPU comparison
import time
import random

print("💻 Simulating computational workload...")
print("\\nCPU Performance (Sequential):")
start_cpu = time.time()
cpu_result = 0
for i in range(100000):
    cpu_result += i * random.random()
    if i % 20000 == 0:
        print(f"  CPU Progress: {i//1000}K operations")
cpu_time = time.time() - start_cpu

print(f"\\n🚀 GPU Performance (Parallel):")
print("  Simulating parallel execution...")
start_gpu = time.time()
# Simulate much faster parallel processing
time.sleep(0.05)  # GPU would complete much faster
gpu_time = time.time() - start_gpu

print(f"\\n📊 Performance Comparison:")
print(f"CPU Time: {cpu_time:.2f} seconds")
print(f"GPU Time: {gpu_time:.2f} seconds") 
speedup = cpu_time / gpu_time if gpu_time > 0 else 0
print(f"GPU Speedup: {speedup:.1f}x faster!")

print(f"\\n🎯 NVIDIA GPU Advantages:")
print("✅ Thousands of parallel CUDA cores")
print("✅ High memory bandwidth")
print("✅ Optimized for AI/ML workloads")
print("✅ Hardware acceleration for deep learning")
print("✅ Massive parallel computation capability")

print("\\n💡 Uncomment the examples above to see real GPU acceleration!")`);

  const [isExecuting, setIsExecuting] = useState(false);
  const [currentExecutor, setCurrentExecutor] = useState<'local' | 'hybrid'>('hybrid');

  const executeCode = async () => {
    if (!code.trim()) {
      console.warn('No code to execute');
      return;
    }

    setIsExecuting(true);
    
    try {
      // Import executorManager dynamically to avoid initialization issues
      const { executorManager } = await import('@/utils/executorManager');
      // Detect if this is volume.py or other video generation code
      const isVideoGeneration = code.includes('volume.py') || 
                                code.includes('warp.render') || 
                                code.includes('VIDEO_OUTPUT') ||
                                code.includes('warp as wp');
      
      const timeout = isVideoGeneration ? 120 : 30; // 2 minutes for video, 30s for others
      
      const result = await executorManager.executeCode(code, timeout);
      
      console.log('Code execution result:', result);
      
      if (onExecutionResult) {
        onExecutionResult({
          ...result,
          timestamp: new Date().toISOString(),
          code: code
        });
      }
      
    } catch (error: any) {
      console.error('Code execution failed:', error);
      
      if (onExecutionResult) {
        onExecutionResult({
          id: Date.now().toString(),
          success: false,
          output: '',
          error: `Execution failed: ${error.message}`,
          execution_time: 0,
          timestamp: new Date().toISOString(),
          code: code,
          executor_type: currentExecutor,
          system_info: {}
        });
      }
    } finally {
      setIsExecuting(false);
    }
  };
  const handleRefresh = () => {
    setCode(`print("Hello World from SOL VM!")
x = 10
y = 20
result = x + y
print(f"{x} + {y} = {result}")
print("Counting to 5:")
for i in range(1, 6):
    print(f"Count {i}")
print("Code execution completed!")`);
    setUploadedFileName('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if it's a Python file
      if (!file.name.endsWith('.py')) {
        alert('Please upload only Python (.py) files');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        setUploadedFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  const triggerFileUpload = () => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    fileInput?.click();
  };

  const getExecutorIcon = () => {
    switch (currentExecutor) {
      case 'hybrid':
        return <Cloud className="w-4 h-4" />;
      case 'local':
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getExecutorColor = () => {
    switch (currentExecutor) {
      case 'hybrid':
        return 'bg-blue-500/20 text-blue-700 border-blue-300';
      case 'local':
      default:
        return 'bg-green-500/20 text-green-700 border-green-300';
    }
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            Python Code Editor
            {uploadedFileName && (
              <span className="flex items-center gap-1 text-sm font-normal text-blue-600">
                <FileText className="w-4 h-4" />
                {uploadedFileName}
              </span>
            )}
          </span>
          <Badge variant="outline" className={`${getExecutorColor()} flex items-center gap-1 font-medium`}>
            {getExecutorIcon()}
            {currentExecutor === 'hybrid' ? 'SOL VM' : 'Local'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your Python code here..."
          className="min-h-[300px] font-mono text-sm resize-none border-slate-200 focus:border-blue-400 focus:ring-blue-400"
        />
          <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={executeCode}
            disabled={isExecuting || !code.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
          >
            {isExecuting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isExecuting ? 'Running...' : 'Run Code'}
          </Button>
          
          <Button
            variant="outline"
            onClick={triggerFileUpload}
            disabled={isExecuting}
            className="flex items-center gap-2 border-purple-300 text-purple-700 hover:border-purple-400 hover:bg-purple-50"
          >
            <Upload className="w-4 h-4" />
            Upload .py File
          </Button>
          
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isExecuting}
            className="flex items-center gap-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          
          <input
            id="file-upload"
            type="file"
            accept=".py"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkingCodeEditor;
