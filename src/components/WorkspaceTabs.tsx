
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RealTimeSimulation from './RealTimeSimulation';
import Benchmarks from './Benchmarks';
import VideoSimulation from './VideoSimulation';
import Debug from './Debug';
import ExecutorSettings from './ExecutorSettings';

interface WorkspaceTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  executionResult?: any;
}

const WorkspaceTabs = ({ activeTab, setActiveTab, executionResult }: WorkspaceTabsProps) => {
  return (
    <div className="glass-card bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6 border-b border-white/20">
          <TabsList className="glass-card bg-white/50 backdrop-blur-sm border border-white/30 p-2 rounded-2xl shadow-lg">
            <TabsTrigger 
              value="simulation" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              ⚡ Realtime
            </TabsTrigger>            
            <TabsTrigger 
              value="video"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              🎥 Video
            </TabsTrigger>
            <TabsTrigger 
              value="benchmarks"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              📊 Benchmarks
            </TabsTrigger>
            <TabsTrigger 
              value="debug"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              🐛 Debug
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-600 data-[state=active]:to-gray-700 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              ⚙️ Settings
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="simulation" className="p-6 h-[550px]">
          <RealTimeSimulation />
        </TabsContent>
          <TabsContent value="video" className="p-6 h-[550px]">
          <VideoSimulation />
        </TabsContent>
        
        <TabsContent value="benchmarks" className="p-6 h-[550px]">
          <Benchmarks />
        </TabsContent>
        
        <TabsContent value="debug" className="p-6 h-[550px]">
          <Debug executionResult={executionResult} />
        </TabsContent>
        
        <TabsContent value="settings" className="p-6 h-[550px] overflow-y-auto">
          <ExecutorSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkspaceTabs;
