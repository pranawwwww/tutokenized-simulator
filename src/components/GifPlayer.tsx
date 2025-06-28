import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Download, Maximize2, Volume2 } from 'lucide-react';

interface GifPlayerProps {
  gifData: string;
  fps?: number;
  resolution?: [number, number];
  frameCount?: number;
}

const GifPlayer: React.FC<GifPlayerProps> = ({ 
  gifData, 
  fps = 30, 
  resolution = [512, 384], 
  frameCount = 0 
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load and display the GIF
  useEffect(() => {
    if (gifData && imgRef.current) {
      const img = imgRef.current;
      
      img.onload = () => {
        setIsLoaded(true);
        setError(null);
        console.log('🎬 GIF loaded successfully');
        
        // Draw to canvas for better control
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx?.drawImage(img, 0, 0);
        }
      };
      
      img.onerror = () => {
        setError('Failed to load GIF');
        setIsLoaded(false);
        console.error('❌ Failed to load GIF');
      };
      
      img.src = `data:image/gif;base64,${gifData}`;
    }
  }, [gifData]);

  const togglePlayPause = () => {
    if (imgRef.current) {
      const img = imgRef.current;
      if (isPlaying) {
        // Pause by replacing with a static frame
        img.src = img.src; // This stops the animation
        setIsPlaying(false);
      } else {
        // Resume by reloading the GIF
        img.src = `data:image/gif;base64,${gifData}`;
        setIsPlaying(true);
      }
    }
  };

  const resetGif = () => {
    if (imgRef.current) {
      // Reset by reloading the GIF
      imgRef.current.src = `data:image/gif;base64,${gifData}`;
      setIsPlaying(true);
    }
  };

  const downloadGif = () => {
    try {
      const link = document.createElement('a');
      link.href = `data:image/gif;base64,${gifData}`;
      link.download = 'warp_simulation.gif';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const fullscreen = () => {
    if (imgRef.current && imgRef.current.requestFullscreen) {
      imgRef.current.requestFullscreen();
    }
  };

  return (
    <div className="space-y-4">
      {/* GIF Player */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-xl border border-white/20">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center gap-2">
              🎬 WARP Volume Simulation
              {isLoaded && (
                <Badge variant="secondary" className="ml-2">
                  {frameCount} frames • {fps} FPS
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={togglePlayPause}
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                onClick={resetGif}
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                onClick={downloadGif}
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                onClick={fullscreen}
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
            {error ? (
              <div className="aspect-video flex items-center justify-center text-red-400">
                <div className="text-center">
                  <p className="text-lg font-semibold mb-2">⚠️ Error Loading GIF</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center relative">
                {/* Hidden image for GIF loading */}
                <img
                  ref={imgRef}
                  className="hidden"
                  alt="WARP Simulation GIF"
                />
                
                {/* Canvas for display */}
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-full object-contain"
                  style={{ 
                    display: isLoaded ? 'block' : 'none',
                    imageRendering: 'crisp-edges' 
                  }}
                />
                
                {/* Visible GIF */}
                {isLoaded && (
                  <img
                    src={`data:image/gif;base64,${gifData}`}
                    alt="WARP Simulation"
                    className="max-w-full max-h-full object-contain absolute inset-0"
                    style={{ 
                      imageRendering: 'crisp-edges',
                      display: isPlaying ? 'block' : 'none'
                    }}
                  />
                )}
                
                {/* Loading state */}
                {!isLoaded && !error && (
                  <div className="flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-lg">Loading GIF...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Status overlay */}
            {isLoaded && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
                  <div className="flex justify-between items-center text-sm">
                    <span>{isPlaying ? '▶️ Playing' : '⏸️ Paused'}</span>
                    <span>{resolution[0]}×{resolution[1]}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* GIF Info */}
      {isLoaded && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Format:</span>
                <span className="ml-2 text-white font-mono">GIF</span>
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
                <span className="text-gray-400">Frames:</span>
                <span className="ml-2 text-white font-mono">{frameCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GifPlayer;
