
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RealTimeSimulation from './RealTimeSimulation';
import Benchmarks from './Benchmarks';

interface WorkspaceTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const WorkspaceTabs = ({ activeTab, setActiveTab }: WorkspaceTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
      <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
        <TabsTrigger 
          value="simulation" 
          className="data-[state=active]:bg-purple-500 data-[state=active]:text-white font-medium"
        >
          Realtime Simulation
        </TabsTrigger>
        <TabsTrigger 
          value="benchmarks"
          className="data-[state=active]:bg-purple-500 data-[state=active]:text-white font-medium"
        >
          Benchmarks
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="simulation" className="mt-4 h-[600px]">
        <RealTimeSimulation />
      </TabsContent>
      
      <TabsContent value="benchmarks" className="mt-4 h-[600px]">
        <Benchmarks />
      </TabsContent>
    </Tabs>
  );
};

export default WorkspaceTabs;
