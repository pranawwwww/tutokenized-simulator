import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Benchmarks from "./Benchmarks";
import VideoSimulation from "./VideoSimulation";
import LLMChatbot from "./LLMChatbot";

const WorkspaceTabs = ({ activeTab, setActiveTab, executionResult }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
      <div className="p-4 border-b border-white/20 bg-white/80 dark:bg-black/40">
        <TabsList className="flex gap-2 bg-transparent shadow-none border-none p-0">
          <TabsTrigger
            value="benchmarks"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "benchmarks"
                ? "bg-purple-500 text-white"
                : "bg-transparent text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-900"
            }`}
          >
            📊 Benchmarks
          </TabsTrigger>
          <TabsTrigger
            value="video"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "video"
                ? "bg-purple-500 text-white"
                : "bg-transparent text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-900"
            }`}
          >
            🎥 Video
          </TabsTrigger>
          <TabsTrigger
            value="tutor"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "tutor"
                ? "bg-purple-500 text-white"
                : "bg-transparent text-gray-700 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-purple-900"
            }`}
          >
            🤖 Tutor
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="benchmarks" className="p-0 h-[550px]">
        <ScrollArea className="h-full p-6">
          <Benchmarks executionResult={executionResult} />
        </ScrollArea>
      </TabsContent>
      <TabsContent value="video" className="p-0 h-[550px]">
        <ScrollArea className="h-full p-6">
          <VideoSimulation executionResult={executionResult} />
        </ScrollArea>
      </TabsContent>
      <TabsContent value="tutor" className="p-0 h-[550px]">
        <div className="h-full p-6 flex flex-col">
          <LLMChatbot />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default WorkspaceTabs;