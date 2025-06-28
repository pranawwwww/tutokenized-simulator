
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopBar from '../components/TopBar';
import CodeEditor from '../components/CodeEditor';
import WorkspaceTabs from '../components/WorkspaceTabs';
import StatusBar from '../components/StatusBar';
import ChatbotBubble from '../components/ChatbotBubble';

const Index = () => {
  const [activeTab, setActiveTab] = useState('simulation');
  const [executionResult, setExecutionResult] = useState<any>(null);

  const handleExecutionResult = (result: any) => {
    setExecutionResult(result);
    // Automatically switch to debug tab when code is executed
    setActiveTab('debug');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/50 flex flex-col font-inter">
      <Header />
      <TopBar />
      
      <main className="flex-1 flex gap-8 p-8">
        {/* Left Panel - Code Editor */}
        <div className="w-1/3 hover-lift">
          <CodeEditor onExecutionResult={handleExecutionResult} />
        </div>
        
        {/* Center Workspace */}
        <div className="flex-1 hover-lift">
          <WorkspaceTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            executionResult={executionResult}
          />
        </div>
      </main>
      
      <StatusBar />
      <Footer />
      
      {/* Floating Chatbot Bubble */}
      <ChatbotBubble />
    </div>
  );
};

export default Index;
