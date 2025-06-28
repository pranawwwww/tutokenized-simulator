
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Volume2, Maximize2, Download } from 'lucide-react';
import GifPlayer from './GifPlayer';
import FramePlayer from './FramePlayer';

interface VideoSimulationProps {
  executionResult?: {
    video_data?: {
      type?: 'gif' | 'frames';
      gif_data?: string;
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
  // Debug logging
  useEffect(() => {
    console.log('🎬 VideoSimulation received executionResult:', executionResult);
    if (executionResult?.video_data) {
      console.log('🎬 Video data found:', executionResult.video_data);
      if (executionResult.video_data.type === 'gif') {
        console.log('🎬 GIF data available');
      } else {
        console.log('🎬 Frames count:', executionResult.video_data.frames?.length || 0);
      }
    } else {
      console.log('🎬 No video_data in executionResult');
    }
  }, [executionResult]);

  const videoData = executionResult?.video_data;
  const isGif = videoData?.type === 'gif';
  const gifData = videoData?.gif_data;
  const frames = videoData?.frames || [];
  const fps = videoData?.fps || 30;
  const frameCount = videoData?.frame_count || frames.length;

  // Render appropriate player based on data type
  if (isGif && gifData) {
    return (
      <div className="space-y-6">
        <GifPlayer
          gifData={gifData}
          fps={fps}
          resolution={videoData?.resolution}
          frameCount={frameCount}
        />
        
        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-300 space-y-1">
                <p>Execution Result: {executionResult ? 'Available' : 'None'}</p>
                <p>Video Data: {videoData ? 'Available' : 'None'}</p>
                <p>Type: {videoData?.type || 'Unknown'}</p>
                <p>GIF Data: {gifData ? `${Math.round(gifData.length / 1024)}KB` : 'None'}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Render frame player for frame-based data or fallback
  if (frames.length > 0) {
    return (
      <div className="space-y-6">
        <FramePlayer
          frames={frames}
          fps={fps}
          resolution={videoData?.resolution}
        />
        
        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-300 space-y-1">
                <p>Execution Result: {executionResult ? 'Available' : 'None'}</p>
                <p>Video Data: {videoData ? 'Available' : 'None'}</p>
                <p>Type: {videoData?.type || 'frames'}</p>
                <p>Frames: {frames.length}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Default state - no video data available
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-xl border border-white/20">
        <CardContent className="p-8">
          <div className="aspect-video bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center rounded-lg">
            <div className="text-center text-white">
              <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Play className="w-12 h-12 ml-1" />
              </div>
              <h3 className="text-xl font-semibold mb-2">WARP Volume Simulation</h3>
              <p className="text-blue-200 mb-4">
                GPU Volumetric Rendering with WARP
              </p>
              <p className="text-sm text-gray-300">
                Run volume.py code to see the simulation
              </p>
              
              {/* Debug info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 text-xs text-gray-300">
                  <p>Execution Result: {executionResult ? 'Available' : 'None'}</p>
                  <p>Video Data: {videoData ? 'Available' : 'None'}</p>
                  <p>Type: {videoData?.type || 'Unknown'}</p>
                  {executionResult && (
                    <pre className="mt-2 text-left bg-black/30 p-2 rounded text-xs overflow-auto max-h-32">
                      {JSON.stringify(executionResult, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">WARP Volume Rendering</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-gray-200 mb-2">Rendering Engine</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• WARP GPU Framework</li>
                <li>• Real-time SDF Rendering</li>
                <li>• Marching Cubes Algorithm</li>
                <li>• OpenGL Backend</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-200 mb-2">Output Formats</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• Animated GIF (Preferred)</li>
                <li>• JPEG Frame Sequence</li>
                <li>• Real-time Canvas</li>
                <li>• Base64 Encoded</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-200 mb-2">Features</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• GPU-Accelerated Compute</li>
                <li>• Headless Rendering</li>
                <li>• Multiple Executors</li>
                <li>• Download Support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoSimulation;
