import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Download, Maximize2, Volume2 } from 'lucide-react';

interface FramePlayerProps {
  frames: Array<{
    frame: number;
    image: string;
  }>;
  fps?: number;
  resolution?: [number, number];
}

const FramePlayer: React.FC<FramePlayerProps> = ({ 
  frames, 
  fps = 30, 
  resolution = [512, 384] 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play when frames are available
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
      }, 1000 / fps);
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

  const downloadFrame = () => {
    if (frames && frames.length > 0) {
      const frame = frames[currentFrame] || frames[frames.length - 1];
      const link = document.createElement('a');
      link.href = `data:image/jpeg;base64,${frame.image}`;
      link.download = `warp_frame_${frame.frame}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const fullscreen = () => {
    if (canvasRef.current && canvasRef.current.requestFullscreen) {
      canvasRef.current.requestFullscreen();
    }
  };

  return (
    <div className="space-y-4">
      {/* Frame Player */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-xl border border-white/20">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center gap-2">
              🎬 WARP Volume Simulation
              <Badge variant="secondary" className="ml-2">
                {frames.length} frames • {fps} FPS
              </Badge>
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={togglePlayPause}
                disabled={frames.length === 0}
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                onClick={resetVideo}
                disabled={frames.length === 0}
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                onClick={downloadFrame}
                disabled={frames.length === 0}
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                onClick={fullscreen}
                disabled={frames.length === 0}
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-b-lg overflow-hidden">
            <div className="aspect-video flex items-center justify-center relative">
              {frames.length > 0 ? (
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-full object-contain"
                  style={{ imageRendering: 'crisp-edges' }}
                />
              ) : (
                <div className="flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-12 h-12 ml-1" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">WARP Volume Simulation</h3>
                    <p className="text-blue-200">Ready for frame-based playback</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Progress and controls overlay */}
            {frames.length > 0 && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span>{isPlaying ? '▶️ Playing' : '⏸️ Paused'}</span>
                    <span>Frame {currentFrame + 1} of {frames.length}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                      style={{ 
                        width: `${((currentFrame + 1) / frames.length) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Frame Info */}
      {frames.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Format:</span>
                <span className="ml-2 text-white font-mono">JPEG Frames</span>
              </div>
              <div>
                <span className="text-gray-400">Resolution:</span>
                <span className="ml-2 text-white font-mono">{resolution[0]}×{resolution[1]}</span>
              </div>
              <div>
                <span className="text-gray-400">Frame Rate:</span>
                <span className="ml-2 text-white font-mono">{fps} FPS</span>
              </div>
              <div>
                <span className="text-gray-400">Total Frames:</span>
                <span className="ml-2 text-white font-mono">{frames.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FramePlayer;
