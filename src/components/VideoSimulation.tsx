
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Volume2, Maximize2 } from 'lucide-react';

const VideoSimulation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(120); // 2 minutes

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetVideo = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full space-y-6">
      {/* Video Player Section */}
      <div className="glass-card bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover-lift">
        <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative flex items-center justify-center">
          {/* Video Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                {isPlaying ? (
                  <Pause className="w-12 h-12" />
                ) : (
                  <Play className="w-12 h-12 ml-1" />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">GPU Training Simulation</h3>
              <p className="text-blue-200">Neural Network Model Training in Real-time</p>
            </div>
          </div>
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <Button
                  onClick={togglePlayPause}
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
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 p-0"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <span className="text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
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
                className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Video Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card bg-gradient-to-br from-blue-50/80 to-cyan-50/80 backdrop-blur-sm border border-blue-200/50 p-6 rounded-2xl hover-lift">
          <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
            📹 Video Details
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Resolution:</span>
              <span className="font-mono text-blue-700">1920x1080</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Frame Rate:</span>
              <span className="font-mono text-blue-700">60 FPS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-mono text-blue-700">2:00 min</span>
            </div>
          </div>
        </div>

        <div className="glass-card bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm border border-purple-200/50 p-6 rounded-2xl hover-lift">
          <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
            🧠 Model Status
          </h3>
          <div className="space-y-3">
            <Badge className="bg-green-100 text-green-800 border-green-300">Training Active</Badge>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Epoch:</span>
                <span className="font-mono text-purple-700">45/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-mono text-purple-700">94.2%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm border border-green-200/50 p-6 rounded-2xl hover-lift">
          <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
            ⚡ Performance
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">GPU Usage:</span>
              <span className="font-mono text-green-700">78%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Memory:</span>
              <span className="font-mono text-green-700">6.2/16 GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Temperature:</span>
              <span className="font-mono text-green-700">72°C</span>
            </div>
          </div>
        </div>
      </div>

      {/* Training Logs */}
      <div className="glass-card bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
        <h4 className="font-bold mb-4 flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Live Logs</Badge>
          Training Output
        </h4>
        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-green-400 max-h-40 overflow-y-auto">
          <div className="space-y-1">
            <div>[2024-06-25 14:30:15] Starting epoch 45/100...</div>
            <div>[2024-06-25 14:30:16] Batch 1/250 - Loss: 0.0234, Acc: 94.1%</div>
            <div>[2024-06-25 14:30:17] Batch 2/250 - Loss: 0.0229, Acc: 94.3%</div>
            <div>[2024-06-25 14:30:18] Batch 3/250 - Loss: 0.0225, Acc: 94.2%</div>
            <div className="text-yellow-400">[2024-06-25 14:30:19] GPU memory usage: 6.2GB/16GB</div>
            <div>[2024-06-25 14:30:20] Batch 4/250 - Loss: 0.0221, Acc: 94.4%</div>
            <div className="animate-pulse">▊</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSimulation;
