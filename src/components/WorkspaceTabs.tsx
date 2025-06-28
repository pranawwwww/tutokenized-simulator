
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Benchmarks from './Benchmarks';
import VideoSimulation from './VideoSimulation';
import Debug from './Debug';

interface WorkspaceTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  executionResult?: any;
}

const WorkspaceTabs = ({ activeTab, setActiveTab, executionResult }: WorkspaceTabsProps) => {
  // Extract streaming data if available
  const streamingData = executionResult?.streaming_data;
  const isStreaming = executionResult?.is_streaming || false;
  
  console.log('🎯 WorkspaceTabs - executionResult:', executionResult);
  console.log('🎯 WorkspaceTabs - streamingData:', streamingData);
  console.log('🎯 WorkspaceTabs - isStreaming:', isStreaming);
  
  return (
    <div className="glass-card bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6 border-b border-white/20">
          <TabsList className="glass-card bg-white/50 backdrop-blur-sm border border-white/30 p-2 rounded-2xl shadow-lg">
            <TabsTrigger 
              value="benchmarks"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              📊 Benchmarks
            </TabsTrigger>
            <TabsTrigger 
              value="video"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              🎥 Video
            </TabsTrigger>
            <TabsTrigger 
              value="debug"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              🐛 Debug
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="benchmarks" className="p-0 h-[550px]">
          <ScrollArea className="h-full p-6">
            <Benchmarks 
              streamBenchmarks={streamingData?.benchmarks}
              plotImage={streamingData?.plots?.[0]}
            />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="video" className="p-0 h-[550px]">
          <ScrollArea className="h-full p-6">
            <VideoSimulation 
              streamData={streamingData}
              isStreaming={isStreaming}
            />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="debug" className="p-0 h-[550px]">
          <ScrollArea className="h-full p-6">
            <Debug executionResult={executionResult} />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkspaceTabs;
