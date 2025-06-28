import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Maximize2, Play } from 'lucide-react';

interface GifPlayerProps {
  gifData?: string; // base64-encoded GIF data
  gifBytestream?: number[]; // raw GIF bytestream as array of ints
  gifUrl?: string;
  gifFilename?: string;
  fps?: number;
  resolution?: [number, number];
  frameCount?: number;
  duration?: number;
  fileSizeBytes?: number;
}

const GifPlayer: React.FC<GifPlayerProps> = ({ 
  gifData,
  gifBytestream,
  gifUrl,
  gifFilename, 
  fps = 10, 
  resolution = [400, 300], 
  frameCount = 0,
  duration = 0,
  fileSizeBytes = 0
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Prefer gifBytestream if present, then gifData (base64), else gifUrl, else filename
  const getGifBlobUrl = () => {
    if (gifBytestream && gifBytestream.length > 0) {
      try {
        console.log('🔧 Creating blob from bytestream:', {
          length: gifBytestream.length,
          firstBytes: gifBytestream.slice(0, 10),
          isValidArray: Array.isArray(gifBytestream) && gifBytestream.every(b => typeof b === 'number' && b >= 0 && b <= 255)
        });
        const byteArray = new Uint8Array(gifBytestream);
        const blob = new Blob([byteArray], { type: 'image/gif' });
        const url = URL.createObjectURL(blob);
        console.log('✅ Bytestream blob created successfully:', { blobSize: blob.size, url });
        return url;
      } catch (e) {
        console.error('❌ Bytestream blob creation failed:', e);
        return null;
      }
    } else if (gifData) {
      try {
        console.log('🔧 Creating blob from base64:', {
          length: gifData.length,
          validBase64: /^[A-Za-z0-9+/]*={0,2}$/.test(gifData)
        });
        const byteCharacters = atob(gifData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/gif' });
        const url = URL.createObjectURL(blob);
        console.log('✅ Base64 blob created successfully:', { blobSize: blob.size, url });
        return url;
      } catch (e) {
        console.error('❌ Base64 blob creation failed:', e);
        return null;
      }
    }
    console.log('⚠️ No valid GIF data found for blob creation');
    return null;
  };

  const gifBlobUrl = getGifBlobUrl();
  const actualGifUrl = gifData
    ? `data:image/gif;base64,${gifData}`
    : gifUrl || (gifFilename ? `http://localhost:3001/gifs/${gifFilename}` : null);

  console.log('🎞️ GifPlayer props:', { gifData, gifUrl, gifFilename, actualGifUrl, frameCount, fps });
  // --- Enhanced debugging for gif data reception ---
  console.log('🔍 GifPlayer Debug (Enhanced):', {
    hasGifData: !!gifData,
    gifDataLength: gifData ? gifData.length : 0,
    gifDataStart: gifData ? gifData.substring(0, 20) : null,
    gifDataValidBase64: gifData ? /^[A-Za-z0-9+/]*={0,2}$/.test(gifData) : false,
    hasGifBytestream: !!gifBytestream,
    gifBytestreamLength: gifBytestream ? gifBytestream.length : 0,
    gifBytestreamType: typeof gifBytestream,
    gifBytestreamIsArray: Array.isArray(gifBytestream),
    hasGifUrl: !!gifUrl,
    hasGifFilename: !!gifFilename,
    actualGifUrl,
    gifBlobUrl,
    // Test if bytestream looks like valid GIF data
    bytestreamStartsWithGIF: gifBytestream && gifBytestream.length >= 6 ? 
      String.fromCharCode(...gifBytestream.slice(0, 6)) === 'GIF89a' || String.fromCharCode(...gifBytestream.slice(0, 6)) === 'GIF87a' : false
  });

  // --- Test bytestream conversion ---
  if (gifBytestream && gifBytestream.length > 0) {
    console.log('🔧 Testing bytestream conversion:', {
      bytestreamType: typeof gifBytestream,
      isArray: Array.isArray(gifBytestream),
      firstFewBytes: gifBytestream.slice(0, 10),
      lastFewBytes: gifBytestream.slice(-10)
    });
    
    try {
      const testByteArray = new Uint8Array(gifBytestream);
      const testBlob = new Blob([testByteArray], { type: 'image/gif' });
      console.log('✅ Bytestream conversion successful:', {
        uint8ArrayLength: testByteArray.length,
        blobSize: testBlob.size,
        blobType: testBlob.type
      });
    } catch (e) {
      console.error('❌ Bytestream conversion failed:', e);
    }
  }

  // --- Test base64 conversion ---
  if (gifData && !gifBytestream) {
    console.log('🔧 Testing base64 conversion:', {
      base64Length: gifData.length,
      startsWithGifHeader: gifData.startsWith('R0lGOD') // GIF header in base64
    });
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadGif = () => {
    if (!actualGifUrl) return;
    
    const link = document.createElement('a');
    link.href = actualGifUrl;
    link.download = gifFilename || 'warp_simulation.gif';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!actualGifUrl) {
    return (
      <Card className="bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-xl border border-white/20">
        <CardContent className="p-8">
          <div className="aspect-video bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center rounded-lg">
            <div className="text-center text-white">
              <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Play className="w-12 h-12 ml-1" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No GIF Generated</h3>
              <p className="text-blue-200">Run the simulation to generate an animated GIF</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* GIF Player */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-xl border border-white/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center gap-2">
              🎞️ WARP Volume Animation
              <Badge variant="secondary" className="ml-2">
                {frameCount} frames • {fps} FPS
              </Badge>
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={downloadGif}
                variant="outline"
                size="sm"
                className="text-white border-white/30 hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download GIF
              </Button>
              <Button
                onClick={toggleFullscreen}
                variant="outline"
                size="sm"
                className="text-white border-white/30 hover:bg-white/10"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-b-lg overflow-hidden">            {/* --- Enhanced GIF display with multiple fallbacks --- */}
            {gifBlobUrl ? (
              <div className="relative">
                <video
                  src={gifBlobUrl}
                  autoPlay
                  loop
                  muted
                  controls
                  className="max-w-full max-h-full object-contain rounded"
                  style={{ aspectRatio: `${resolution[0]}/${resolution[1]}` }}
                  onError={(e) => {
                    console.error('❌ Video tag failed to load GIF blob:', e);
                  }}
                  onLoadStart={() => {
                    console.log('🎬 Video tag started loading GIF blob');
                  }}
                  onLoadedData={() => {
                    console.log('✅ Video tag successfully loaded GIF blob');
                  }}
                >
                  {/* Fallback to img tag if video fails */}
                  <img
                    src={gifBlobUrl}
                    alt="WARP Volume Animation"
                    className="max-w-full max-h-full object-contain rounded"
                    style={{ imageRendering: 'crisp-edges', aspectRatio: `${resolution[0]}/${resolution[1]}` }}
                    onError={(e) => {
                      console.error('❌ Img tag also failed to load GIF blob:', e);
                    }}
                    onLoad={() => {
                      console.log('✅ Img tag successfully loaded GIF blob');
                    }}
                  />
                  Your browser does not support the video tag or the GIF format.
                </video>
                {/* Debug overlay */}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs p-2 rounded opacity-50 hover:opacity-100 transition-opacity">
                  Blob URL: {gifBlobUrl.substring(0, 30)}...
                </div>
              </div>
            ) : actualGifUrl ? (
              <img
                src={actualGifUrl}
                alt="WARP Volume Animation"
                className="max-w-full max-h-full object-contain rounded"
                style={{ imageRendering: 'crisp-edges', aspectRatio: `${resolution[0]}/${resolution[1]}` }}
              />
            ) : (
              <div className="aspect-video bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center rounded-lg">
                <div className="text-center text-white">
                  <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Play className="w-12 h-12 ml-1" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No GIF Generated</h3>
                  <p className="text-blue-200">Run the simulation to generate an animated GIF</p>
                </div>
              </div>
            )}
            {isFullscreen && (
              <Button
                onClick={() => setIsFullscreen(false)}
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 text-white border-white/30 hover:bg-white/10 z-10"
              >
                Exit Fullscreen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* GIF Info */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Resolution:</span>
              <span className="ml-2 text-white font-mono">{resolution[0]}×{resolution[1]}</span>
            </div>
            <div>
              <span className="text-gray-400">Frame Rate:</span>
              <span className="ml-2 text-white font-mono">{fps} FPS</span>
            </div>
            <div>
              <span className="text-gray-400">Duration:</span>
              <span className="ml-2 text-white font-mono">{duration.toFixed(2)}s</span>
            </div>
            <div>
              <span className="text-gray-400">File Size:</span>
              <span className="ml-2 text-white font-mono">{formatFileSize(fileSizeBytes)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GifPlayer;
