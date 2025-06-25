import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Cpu, Zap, Battery, Activity, Thermometer } from 'lucide-react';

const RealTimeSimulation = () => {
  const [cpuUsage] = useState(45);
  const [gpuUsage] = useState(78);
  const [energyUsage] = useState(62);

  return (
    <div className="h-full">
      <Tabs defaultValue="cpu" className="h-full">
        <TabsList className="glass-card bg-white/50 backdrop-blur-sm border border-white/30 p-2 rounded-2xl shadow-lg mb-6">
          <TabsTrigger 
            value="cpu" 
            className="flex items-center gap-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <Cpu className="w-5 h-5" />
            CPU
          </TabsTrigger>
          <TabsTrigger 
            value="gpu" 
            className="flex items-center gap-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <Zap className="w-5 h-5" />
            GPU
          </TabsTrigger>
          <TabsTrigger 
            value="energy" 
            className="flex items-center gap-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <Battery className="w-5 h-5" />
            Energy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cpu" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="glass-card bg-gradient-to-br from-blue-50/80 to-cyan-50/80 backdrop-blur-sm border border-blue-200/50 p-6 rounded-2xl hover-lift">
              <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                CPU Utilization
              </h3>
              <Progress value={cpuUsage} className="mb-4 h-3 bg-blue-100" />
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-blue-700">{cpuUsage}%</p>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">Active</Badge>
              </div>
            </div>
            
            <div className="glass-card bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm border border-green-200/50 p-6 rounded-2xl hover-lift">
              <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                Thread Count
              </h3>
              <div className="text-4xl font-bold text-green-700 mb-2">12/16</div>
              <p className="text-green-600 font-medium">Threads in use</p>
            </div>
          </div>
          
          <div className="glass-card bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
            <h4 className="font-bold mb-4 flex items-center gap-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Real-time</Badge>
              CPU Performance Metrics
            </h4>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-600 font-medium">Clock Speed:</span>
                <span className="font-mono text-gray-800">3.2 GHz</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-600 font-medium">Cache Hit Rate:</span>
                <span className="font-mono text-gray-800">94.2%</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-600 font-medium">Memory Usage:</span>
                <span className="font-mono text-gray-800">8.4/32 GB</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gpu" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="glass-card bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm border border-purple-200/50 p-6 rounded-2xl hover-lift pulse-glow">
              <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                GPU Utilization
              </h3>
              <Progress value={gpuUsage} className="mb-4 h-3 bg-purple-100" />
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-purple-700">{gpuUsage}%</p>
                <Badge className="bg-purple-100 text-purple-800 border-purple-300">High Load</Badge>
              </div>
            </div>
            
            <div className="glass-card bg-gradient-to-br from-orange-50/80 to-red-50/80 backdrop-blur-sm border border-orange-200/50 p-6 rounded-2xl hover-lift">
              <h3 className="font-bold text-orange-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                CUDA Cores
              </h3>
              <div className="text-4xl font-bold text-orange-700 mb-2">2048/2560</div>
              <p className="text-orange-600 font-medium">Cores in use</p>
            </div>
          </div>
          
          <div className="glass-card bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
            <h4 className="font-bold mb-4 flex items-center gap-3">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">NVIDIA RTX 4080</Badge>
              GPU Performance Metrics
            </h4>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-600 font-medium">Memory Clock:</span>
                <span className="font-mono text-gray-800">1.4 GHz</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-600 font-medium">VRAM Usage:</span>
                <span className="font-mono text-gray-800">6.2/16 GB</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-600 font-medium">Temperature:</span>
                <span className="font-mono text-gray-800">72°C</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="energy" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="glass-card bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm border border-green-200/50 p-6 rounded-2xl hover-lift">
              <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                <Battery className="w-5 h-5" />
                Power Consumption
              </h3>
              <Progress value={energyUsage} className="mb-4 h-3 bg-green-100" />
              <div className="flex items-center justify-between">
                <p className="text-lg text-green-600">{energyUsage}% of 350W TDP</p>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-semibold">72°C</span>
                </div>
              </div>
            </div>
            
            <div className="glass-card bg-gradient-to-br from-yellow-50/80 to-amber-50/80 backdrop-blur-sm border border-yellow-200/50 p-6 rounded-2xl hover-lift">
              <h3 className="font-bold text-yellow-800 mb-4">Efficiency Score</h3>
              <div className="text-6xl font-bold text-yellow-700 mb-2">A+</div>
              <p className="text-yellow-600 font-medium">Power efficiency</p>
            </div>
          </div>
          
          <div className="glass-card bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
            <h4 className="font-bold mb-4 flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Energy Monitor</Badge>
              Power Analysis
            </h4>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-600 font-medium">Current Draw:</span>
                <span className="font-mono text-gray-800">217W</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-600 font-medium">Peak Power:</span>
                <span className="font-mono text-gray-800">285W</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-600 font-medium">Energy Cost/Hour:</span>
                <span className="font-mono text-gray-800">$0.034</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealTimeSimulation;
