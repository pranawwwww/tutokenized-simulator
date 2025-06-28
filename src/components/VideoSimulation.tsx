
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Volume2, Maximize2, Download } from 'lucide-react';

interface VideoSimulationProps {
  executionResult?: {
    video_data?: {
      frames?: Array<{
        frame: number;
        image: string;
      }>;
      fps?: number;
      resolution?: [number, number];
      frame_count?: number;
    };
  };
}

const VideoSimulation: React.FC<VideoSimulationProps> = ({ executionResult }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const videoData = executionResult?.video_data;
  const frames = videoData?.frames || [];
  const fps = videoData?.fps || 30;
  const frameCount = videoData?.frame_count || frames.length;

  // Auto-play when video data is available
  useEffect(() => {
    if (frames.length > 0) {
      setIsPlaying(true);
    }
  }, [frames.length]);

  // Update frame display
  useEffect(() => {
    if (frames.length > 0 && canvasRef.current) {
      const frame = frames[Math.min(currentFrame, frames.length - 1)];
      if (frame && frame.image) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
        };
        
        img.src = `data:image/jpeg;base64,${frame.image}`;
      }
    }
  }, [currentFrame, frames]);

  // Animation loop
  useEffect(() => {
    if (isPlaying && frames && frames.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => {
          const next = prev + 1;
          if (next >= frames.length) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }, 1000 / fps); // Use actual FPS from video data
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, frames, fps]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetVideo = () => {
    setCurrentFrame(0);
    setIsPlaying(false);
  };

  const downloadVideo = () => {
    // Create a simple download of the last frame or trigger server video download
    if (frames && frames.length > 0) {
      const lastFrame = frames[frames.length - 1];
      const link = document.createElement('a');
      link.href = `data:image/jpeg;base64,${lastFrame.image}`;
      link.download = 'warp_simulation_frame.jpg';
      link.click();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentMetrics = () => {
    // No metrics data in our simple frame structure
    return null;
  };

  const metrics = getCurrentMetrics();
  return (
    <div className="space-y-6">
      {/* Video Player Section */}
      <div className="glass-card bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover-lift">
        <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative">
          {/* Canvas for WARP video frames */}
          {frames && frames.length > 0 ? (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-contain"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  {isPlaying ? (
                    <Pause className="w-12 h-12" />
                  ) : (
                    <Play className="w-12 h-12 ml-1" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">WARP Volume Simulation</h3>
                <p className="text-blue-200">
                  GPU Volumetric Rendering with WARP
                </p>
              </div>
            </div>
          )}
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <Button
                  onClick={togglePlayPause}
                  disabled={!frames || frames.length === 0}
                  className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 p-0"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </Button>
                <Button
                  onClick={resetVideo}
                  disabled={!frames || frames.length === 0}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 p-0"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  onClick={downloadVideo}
                  disabled={!frames || frames.length === 0}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 p-0"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <span className="text-sm font-mono">
                  {frames ? `${currentFrame + 1}/${frames.length}` : '0/0'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 p-0">
                  <Volume2 className="w-4 h-4" />
                </Button>
                <Button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 p-0">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ 
                  width: frames && frames.length > 0 
                    ? `${((currentFrame + 1) / frames.length) * 100}%` 
                    : '0%' 
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <div className="text-sm font-medium text-blue-800">FPS</div>
              <div className="text-lg font-bold text-blue-900">{metrics.fps.toFixed(1)}</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-3">
              <div className="text-sm font-medium text-green-800">Frame Time</div>
              <div className="text-lg font-bold text-green-900">{metrics.frame_time_ms.toFixed(1)}ms</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-3">
              <div className="text-sm font-medium text-purple-800">GPU Kernel</div>
              <div className="text-lg font-bold text-purple-900">{metrics.kernel_time_ms.toFixed(1)}ms</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-3">
              <div className="text-sm font-medium text-orange-800">Vertices</div>
              <div className="text-lg font-bold text-orange-900">{metrics.vertex_count.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-pink-50 border-pink-200">
            <CardContent className="p-3">
              <div className="text-sm font-medium text-pink-800">Triangles</div>
              <div className="text-lg font-bold text-pink-900">{metrics.triangle_count.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Technical Specifications */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Technical Specifications</span>
            <Badge variant="outline" className="bg-white">
              Ready
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Rendering Engine</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• WARP GPU Framework</li>
                <li>• Real-time SDF Rendering</li>
                <li>• Marching Cubes Algorithm</li>
                <li>• OpenGL Backend</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Performance Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• GPU-Accelerated Compute</li>
                <li>• Real-time Streaming</li>
                <li>• Live Metrics Monitoring</li>
                <li>• Dynamic Geometry</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Output Format</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Streaming: JPEG frames</li>
                <li>• Resolution: 512×384</li>
                <li>• Target FPS: 60</li>
                <li>• Color Space: RGB</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoSimulation;
