
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Cpu, Zap, Battery } from 'lucide-react';

const RealTimeSimulation = () => {
  const [cpuUsage] = useState(45);
  const [gpuUsage] = useState(78);
  const [energyUsage] = useState(62);

  return (
    <Card className="h-full shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
        <CardTitle>Real-time GPU Simulation</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="cpu" className="h-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="cpu" className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              CPU
            </TabsTrigger>
            <TabsTrigger value="gpu" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              GPU
            </TabsTrigger>
            <TabsTrigger value="energy" className="flex items-center gap-2">
              <Battery className="w-4 h-4" />
              Energy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cpu" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">CPU Utilization</h3>
                <Progress value={cpuUsage} className="mb-2" />
                <p className="text-sm text-blue-600">{cpuUsage}% Active</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Thread Count</h3>
                <div className="text-2xl font-bold text-green-700">12/16</div>
                <p className="text-sm text-green-600">Threads in use</p>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Badge variant="outline">Real-time</Badge>
                CPU Performance Metrics
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Clock Speed:</span>
                  <span className="font-mono">3.2 GHz</span>
                </div>
                <div className="flex justify-between">
                  <span>Cache Hit Rate:</span>
                  <span className="font-mono">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory Usage:</span>
                  <span className="font-mono">8.4/32 GB</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gpu" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">GPU Utilization</h3>
                <Progress value={gpuUsage} className="mb-2" />
                <p className="text-sm text-purple-600">{gpuUsage}% Active</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">CUDA Cores</h3>
                <div className="text-2xl font-bold text-orange-700">2048/2560</div>
                <p className="text-sm text-orange-600">Cores in use</p>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Badge variant="outline">NVIDIA RTX 4080</Badge>
                GPU Performance Metrics
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Memory Clock:</span>
                  <span className="font-mono">1.4 GHz</span>
                </div>
                <div className="flex justify-between">
                  <span>VRAM Usage:</span>
                  <span className="font-mono">6.2/16 GB</span>
                </div>
                <div className="flex justify-between">
                  <span>Temperature:</span>
                  <span className="font-mono">72°C</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="energy" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Power Consumption</h3>
                <Progress value={energyUsage} className="mb-2" />
                <p className="text-sm text-green-600">{energyUsage}% of 350W TDP</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Efficiency Score</h3>
                <div className="text-2xl font-bold text-yellow-700">A+</div>
                <p className="text-sm text-yellow-600">Power efficiency</p>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Badge variant="outline">Energy Monitor</Badge>
                Power Analysis
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Current Draw:</span>
                  <span className="font-mono">217W</span>
                </div>
                <div className="flex justify-between">
                  <span>Peak Power:</span>
                  <span className="font-mono">285W</span>
                </div>
                <div className="flex justify-between">
                  <span>Energy Cost/Hour:</span>
                  <span className="font-mono">$0.034</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RealTimeSimulation;
