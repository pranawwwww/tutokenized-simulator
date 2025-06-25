
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Clock, BarChart3 } from 'lucide-react';

const Benchmarks = () => {
  const benchmarkData = [
    { name: "Matrix Multiplication", score: 8950, progress: 89, status: "Excellent" },
    { name: "Neural Network Training", score: 7240, progress: 72, status: "Good" },
    { name: "Image Processing", score: 9100, progress: 91, status: "Excellent" },
    { name: "Parallel Reduction", score: 6800, progress: 68, status: "Average" },
    { name: "Memory Bandwidth", score: 7950, progress: 79, status: "Good" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent": return "bg-green-100 text-green-800";
      case "Good": return "bg-blue-100 text-blue-800";
      case "Average": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="h-full shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Performance Benchmarks
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Overall Score</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">8,028</div>
            <p className="text-sm text-blue-600">+12% from last run</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Peak Performance</span>
            </div>
            <div className="text-2xl font-bold text-green-700">9,100</div>
            <p className="text-sm text-green-600">Image Processing</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-800">Avg. Runtime</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">2.4s</div>
            <p className="text-sm text-purple-600">Per benchmark</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Benchmark Results</h3>
          
          {benchmarkData.map((benchmark, index) => (
            <div key={index} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-800">{benchmark.name}</span>
                  <Badge className={getStatusColor(benchmark.status)}>
                    {benchmark.status}
                  </Badge>
                </div>
                <span className="font-mono text-lg font-semibold text-gray-700">
                  {benchmark.score.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Progress value={benchmark.progress} className="flex-1" />
                <span className="text-sm text-gray-600 w-12">{benchmark.progress}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Benchmark Configuration</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">GPU Model:</span>
              <span className="ml-2 font-mono">RTX 4080</span>
            </div>
            <div>
              <span className="text-gray-600">CUDA Version:</span>
              <span className="ml-2 font-mono">12.2</span>
            </div>
            <div>
              <span className="text-gray-600">Driver Version:</span>
              <span className="ml-2 font-mono">537.13</span>
            </div>
            <div>
              <span className="text-gray-600">Test Duration:</span>
              <span className="ml-2 font-mono">12.1s</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Benchmarks;
