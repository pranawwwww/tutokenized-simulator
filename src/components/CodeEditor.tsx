
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Play, RotateCcw } from 'lucide-react';

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

  return (
    <Card className="h-full shadow-lg border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <span className="text-lg">Code Editor</span>
          <span className="text-sm font-normal bg-purple-400/30 px-2 py-1 rounded">
            LLM-Assisted
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-[600px]">
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 font-mono text-sm border-0 resize-none focus:ring-0 rounded-none"
          placeholder="Write your GPU-accelerated code here..."
        />
        <div className="flex gap-2 p-4 bg-gray-50 border-t">
          <Button onClick={handleSubmit} className="flex-1 bg-purple-600 hover:bg-purple-700">
            <Play className="w-4 h-4 mr-2" />
            Submit
          </Button>
          <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeEditor;
