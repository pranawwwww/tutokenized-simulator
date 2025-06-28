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
    const [code, setCode] = useState(`# 🚀 NVIDIA GPU Acceleration Demo
# Choose one of these examples to see GPU vs CPU performance:

# === EXAMPLE 1: Neural Network Training ===
# Uncomment this section to test ML training acceleration:

"""
import torch
import time
import numpy as np

print("🧠 Neural Network GPU Acceleration Test")
print("=" * 40)

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
      
      // Check if this is WARP/volume.py code that needs streaming
      const isWarpCode = code.includes('warp') || code.includes('STREAM_DATA') || 
                        code.includes('volume.py') || uploadedFileName === 'volume.py';
      
      if (isWarpCode) {
        console.log('🎬 Detected WARP simulation code - using streaming execution');
        
        // Collect streaming data
        const streamingData = {
          frames: [] as any[],
          benchmarks: {} as any,
          plots: [] as string[],
          status: 'running'
        };
        
        const result = await executorManager.executeCodeWithStreaming(
          code,
          (data: any) => {
            console.log('📡 Received stream data:', data);
            
            // Handle different types of streaming data
            if (data.type === 'frame_data' && data.image && data.metrics) {
              streamingData.frames.push({
                frame: data.frame,
                image: data.image,
                metrics: data.metrics
              });
              console.log(`🎬 Added frame ${data.frame}, total frames: ${streamingData.frames.length}`);
            } else if (data.type === 'benchmark_data') {
              streamingData.benchmarks = data.benchmarks || data;
              console.log('📊 Updated benchmark data:', streamingData.benchmarks);
            } else if (data.type === 'benchmark_plot' && data.image) {
              streamingData.plots.push(data.image);
              console.log('📈 Added plot image');
            } else if (data.type === 'simulation_complete') {
              streamingData.status = 'complete';
              console.log('✅ Simulation marked as complete');
            }
          },
          120 // 2 minute timeout for WARP simulations
        );
        
        // Add streaming data to result
        const enhancedResult = {
          ...result,
          timestamp: new Date().toISOString(),
          code: code,
          streaming_data: streamingData,
          is_streaming: true
        };
        
        console.log('✅ WARP streaming execution completed:', enhancedResult);
        console.log(`📊 Final streaming data - Frames: ${streamingData.frames.length}, Benchmarks:`, streamingData.benchmarks);
        
        if (onExecutionResult) {
          onExecutionResult(enhancedResult);
        }
        
      } else {
        // Standard execution for non-WARP code
        const result = await executorManager.executeCode(code);
        
        console.log('Code execution result:', result);
        
        if (onExecutionResult) {
          onExecutionResult({
            ...result,
            timestamp: new Date().toISOString(),
            code: code
          });
        }
      }
      
    } catch (error: any) {
      console.error('Code execution failed:', error);
      
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred during execution';
      
      if (onExecutionResult) {
        onExecutionResult({
          id: Date.now().toString(),
          success: false,
          output: '',
          error: `Execution failed: ${errorMessage}`,
          execution_time: 0,
          timestamp: new Date().toISOString(),
          code: code,
          executor_type: currentExecutor,
          system_info: {
            error_details: error,
            executor_config: 'SOL VM Queue-based execution'
          }
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
