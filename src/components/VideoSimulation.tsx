
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Volume2, Maximize2 } from 'lucide-react';
import SimpleVideoPlayer from './SimpleVideoPlayer';
import GifPlayer from './GifPlayer';

interface VideoSimulationProps {
  executionResult?: {
    success: boolean;
    output: string;
    error: string;
    video_data?: {
      type?: string;
      frames?: Array<{
        frame: number;
        timestamp: number;
        image: string;
      }>;
      fps?: number;
      resolution?: [number, number];
      frame_count?: number;
      duration?: number;
      // GIF-specific data
      gif_data?: string;
      file_size_bytes?: number;
    };
  };
}

const VideoSimulation: React.FC<VideoSimulationProps> = ({ executionResult }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(120); // 2 minutes fallback

  // Debug logging
  useEffect(() => {
    console.log('🎬 VideoSimulation received executionResult:', {
      hasResult: !!executionResult,
      success: executionResult?.success,
      hasVideoData: !!executionResult?.video_data,
      videoDataType: executionResult?.video_data?.type,
      frameCount: executionResult?.video_data?.frames?.length,
      outputLength: executionResult?.output?.length
    });
  }, [executionResult]);

  // Check if we have video frame data or GIF data
  const hasVideoFrames = executionResult?.video_data?.type === 'video_frames' && 
                        executionResult?.video_data?.frames && 
                        executionResult.video_data.frames.length > 0;

  const hasGifData = executionResult?.video_data?.type === 'gif_animation' && 
                    executionResult?.video_data?.gif_data;

  const videoData = executionResult?.video_data;
  const frames = videoData?.frames || [];
  const fps = videoData?.fps || 30;
  const resolution = videoData?.resolution || [512, 384];

  console.log('🎬 VideoSimulation render:', {
    hasVideoFrames,
    hasGifData,
    frameCount: frames.length,
    fps,
    resolution,
    executionSuccess: executionResult?.success,
    videoDataType: videoData?.type
  });

  // If we have GIF data, use the GifPlayer
  if (hasGifData) {
    return (
      <div className="space-y-6">
        <div className="glass-card bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover-lift">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              🎞️ WARP Volume Animation
              <Badge className="bg-green-100 text-green-800 border-green-300">
                GIF • {videoData?.frame_count} frames
              </Badge>
            </h3>
            <GifPlayer 
              gifData={videoData?.gif_data}
              fps={fps}
              resolution={resolution}
              frameCount={videoData?.frame_count}
              duration={videoData?.duration}
              fileSizeBytes={videoData?.file_size_bytes}
            />
          </div>
        </div>

        {/* Video Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card bg-gradient-to-br from-blue-50/80 to-cyan-50/80 backdrop-blur-sm border border-blue-200/50 p-6 rounded-2xl hover-lift">
            <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
              🎞️ Animation Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Resolution:</span>
                <span className="font-mono text-blue-700">{resolution[0]}x{resolution[1]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frame Rate:</span>
                <span className="font-mono text-blue-700">{fps} FPS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frames:</span>
                <span className="font-mono text-blue-700">{videoData?.frame_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-mono text-blue-700">{videoData?.duration?.toFixed(2)}s</span>
              </div>
            </div>
          </div>

          <div className="glass-card bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm border border-purple-200/50 p-6 rounded-2xl hover-lift">
            <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
              🧠 Simulation Status
            </h3>
            <div className="space-y-3">
              <Badge className="bg-green-100 text-green-800 border-green-300">
                Completed
              </Badge>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-mono text-purple-700">WARP Volume</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-mono text-purple-700">Animated GIF</span>
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
                <span className="text-gray-600">Status:</span>
                <span className="font-mono text-green-700">Success</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">File Size:</span>
                <span className="font-mono text-green-700">
                  {videoData?.file_size_bytes ? `${(videoData.file_size_bytes / 1024).toFixed(1)} KB` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GPU:</span>
                <span className="font-mono text-green-700">Auto-detect</span>
              </div>
            </div>
          </div>
        </div>

        {/* Execution Output if available */}
        {(executionResult?.output || executionResult?.error) && (
          <div className="glass-card bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
            <h4 className="font-bold mb-4 flex items-center gap-3">
              <Badge variant="outline" className={executionResult?.success ? "bg-green-50 text-green-700 border-green-300" : "bg-red-50 text-red-700 border-red-300"}>
                {executionResult?.success ? 'Output' : 'Error'}
              </Badge>
              Execution Log
            </h4>
            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-green-400 max-h-40 overflow-y-auto">
              <div className="space-y-1">
                {executionResult?.success ? (
                  <pre className="whitespace-pre-wrap">{executionResult.output}</pre>
                ) : (
                  <pre className="text-red-400 whitespace-pre-wrap">{executionResult?.error}</pre>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If we have video frames, use the AdvancedVideoPlayer
  if (hasVideoFrames) {
    return (
      <div className="space-y-6">
        <div className="glass-card bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover-lift">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              🎥 WARP Volume Simulation
              <Badge className="bg-green-100 text-green-800 border-green-300">
                {frames.length} frames
              </Badge>
            </h3>
            <SimpleVideoPlayer 
              frames={frames}
              fps={fps}
              resolution={resolution}
            />
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
                <span className="font-mono text-blue-700">{resolution[0]}x{resolution[1]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frame Rate:</span>
                <span className="font-mono text-blue-700">{fps} FPS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frames:</span>
                <span className="font-mono text-blue-700">{frames.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-mono text-blue-700">{(frames.length / fps).toFixed(2)}s</span>
              </div>
            </div>
          </div>

          <div className="glass-card bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm border border-purple-200/50 p-6 rounded-2xl hover-lift">
            <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
              🧠 Simulation Status
            </h3>
            <div className="space-y-3">
              <Badge className={executionResult?.success ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}>
                {executionResult?.success ? 'Completed' : 'Failed'}
              </Badge>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-mono text-purple-700">WARP Volume</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-mono text-purple-700">Frame Sequence</span>
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
                <span className="text-gray-600">Execution:</span>
                <span className="font-mono text-green-700">
                  {executionResult?.success ? 'Success' : 'Failed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frame Size:</span>
                <span className="font-mono text-green-700">
                  {frames.length > 0 ? `${Math.round(frames[0].image.length * 0.75 / 1024)}KB` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Size:</span>
                <span className="font-mono text-green-700">
                  {frames.length > 0 ? `${Math.round(frames.reduce((sum, f) => sum + f.image.length, 0) * 0.75 / 1024 / 1024)}MB` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Execution Output */}
        {(executionResult?.output || executionResult?.error) && (
          <div className="glass-card bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
            <h4 className="font-bold mb-4 flex items-center gap-3">
              <Badge variant="outline" className={executionResult?.success ? "bg-green-50 text-green-700 border-green-300" : "bg-red-50 text-red-700 border-red-300"}>
                {executionResult?.success ? 'Output' : 'Error'}
              </Badge>
              Execution Log
            </h4>
            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-green-400 max-h-40 overflow-y-auto">
              <div className="space-y-1">
                {executionResult?.success ? (
                  <pre className="whitespace-pre-wrap">{executionResult.output}</pre>
                ) : (
                  <pre className="text-red-400 whitespace-pre-wrap">{executionResult?.error}</pre>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback UI when no video data is available  
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
    <div className="space-y-6">
      {/* Placeholder Video Player Section */}
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
              <h3 className="text-xl font-semibold mb-2">WARP Volume Simulation</h3>
              <p className="text-blue-200">
                {executionResult ? 
                  (executionResult.success ? 
                    "No video data generated" : 
                    "Execution failed - check logs below") : 
                  "Run volume.py to generate simulation video"}
              </p>
              {executionResult && !executionResult.success && (
                <Badge className="mt-2 bg-red-100 text-red-800 border-red-300">
                  Execution Error
                </Badge>
              )}
            </div>
          </div>
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <Button
                  onClick={togglePlayPause}
                  disabled={!hasVideoFrames}
                  className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 p-0 disabled:opacity-50"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </Button>
                <Button
                  onClick={resetVideo}
                  disabled={!hasVideoFrames}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 p-0 disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <span className="text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 p-0 disabled:opacity-50" disabled>
                  <Volume2 className="w-4 h-4" />
                </Button>
                <Button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 p-0 disabled:opacity-50" disabled>
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

      {/* Execution Output if available */}
      {(executionResult?.output || executionResult?.error) && (
        <div className="glass-card bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
          <h4 className="font-bold mb-4 flex items-center gap-3">
            <Badge variant="outline" className={executionResult?.success ? "bg-green-50 text-green-700 border-green-300" : "bg-red-50 text-red-700 border-red-300"}>
              {executionResult?.success ? 'Output' : 'Error'}
            </Badge>
            Execution Log
          </h4>
          <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-green-400 max-h-40 overflow-y-auto">
            <div className="space-y-1">
              {executionResult?.success ? (
                <pre className="whitespace-pre-wrap">{executionResult.output}</pre>
              ) : (
                <pre className="text-red-400 whitespace-pre-wrap">{executionResult?.error}</pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card bg-gradient-to-br from-blue-50/80 to-cyan-50/80 backdrop-blur-sm border border-blue-200/50 p-6 rounded-2xl hover-lift">
          <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
            📹 Video Details
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Resolution:</span>
              <span className="font-mono text-blue-700">
                {executionResult?.video_data?.resolution ? 
                  `${executionResult.video_data.resolution[0]}x${executionResult.video_data.resolution[1]}` : 
                  'Not available'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Frame Rate:</span>
              <span className="font-mono text-blue-700">
                {executionResult?.video_data?.fps ? `${executionResult.video_data.fps} FPS` : 'Not available'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-mono text-blue-700">
                {executionResult?.video_data?.duration ? 
                  `${executionResult.video_data.duration.toFixed(2)}s` : 
                  'Not available'}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm border border-purple-200/50 p-6 rounded-2xl hover-lift">
          <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
            🧠 Simulation Status
          </h3>
          <div className="space-y-3">
            <Badge className={
              !executionResult ? "bg-gray-100 text-gray-800 border-gray-300" :
              executionResult.success ? "bg-green-100 text-green-800 border-green-300" : 
              "bg-red-100 text-red-800 border-red-300"
            }>
              {!executionResult ? 'Waiting' : 
               executionResult.success ? 'Completed' : 'Failed'}
            </Badge>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-mono text-purple-700">WARP Volume</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frames:</span>
                <span className="font-mono text-purple-700">
                  {executionResult?.video_data?.frame_count || 'None'}
                </span>
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
              <span className="text-gray-600">Status:</span>
              <span className="font-mono text-green-700">
                {!executionResult ? 'Ready' : 
                 executionResult.success ? 'Success' : 'Failed'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Format:</span>
              <span className="font-mono text-green-700">
                {executionResult?.video_data?.type || 'Frame Sequence'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">GPU:</span>
              <span className="font-mono text-green-700">Auto-detect</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSimulation;
