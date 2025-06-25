
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Play, RotateCcw, Copy, Download, Settings } from 'lucide-react';

const CodeEditor = () => {
  const [code, setCode] = useState(`# GPU Acceleration Example
import cupy as cp
import numpy as np

# Create arrays on GPU
gpu_array = cp.array([1, 2, 3, 4, 5])
cpu_array = np.array([1, 2, 3, 4, 5])

# Perform GPU computation
result = cp.sum(gpu_array ** 2)
print(f"GPU Result: {result}")

# Transfer back to CPU if needed
cpu_result = cp.asnumpy(result)
print(f"CPU Result: {cpu_result}")`);

  const handleSubmit = () => {
    console.log("Submitting code:", code);
    // Add submission logic here
  };

  const handleRefresh = () => {
    setCode(`# GPU Acceleration Example
import cupy as cp
import numpy as np

# Create arrays on GPU
gpu_array = cp.array([1, 2, 3, 4, 5])
cpu_array = np.array([1, 2, 3, 4, 5])

# Perform GPU computation
result = cp.sum(gpu_array ** 2)
print(f"GPU Result: {result}")

# Transfer back to CPU if needed
cpu_result = cp.asnumpy(result)
print(f"CPU Result: {cpu_result}")`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="glass-card bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-2xl font-bold">Code Editor</span>
            <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
              LLM-Assisted
            </span>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={handleCopy} className="text-white hover:bg-white/20 rounded-xl">
              <Copy className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 rounded-xl">
              <Download className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 rounded-xl">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-[600px]">
        <div className="flex-1 relative">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full font-mono text-sm border-0 resize-none focus:ring-0 rounded-none bg-slate-50/50 backdrop-blur-sm p-6 leading-relaxed"
            placeholder="Write your GPU-accelerated code here..."
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Monaco', monospace"
            }}
          />
          
          {/* Line numbers overlay */}
          <div className="absolute left-2 top-6 flex flex-col text-xs text-gray-400 font-mono select-none pointer-events-none">
            {Array.from({ length: code.split('\n').length }, (_, i) => (
              <div key={i} className="h-6 flex items-center pr-4">
                {i + 1}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex gap-3 p-6 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm border-t border-white/30">
          <Button 
            onClick={handleSubmit} 
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Play className="w-5 h-5 mr-2" />
            Run Code
          </Button>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            className="flex items-center gap-2 glass-card bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white/80 px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </div>
  );
};

export default CodeEditor;
