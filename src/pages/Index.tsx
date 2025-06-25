
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopBar from '../components/TopBar';
import CodeEditor from '../components/CodeEditor';
import WorkspaceTabs from '../components/WorkspaceTabs';
import StatusBar from '../components/StatusBar';

const Index = () => {
  const [activeTab, setActiveTab] = useState('simulation');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex flex-col">
      <Header />
      <TopBar />
      
      <main className="flex-1 flex gap-6 p-6">
        {/* Left Panel - Code Editor */}
        <div className="w-1/3">
          <CodeEditor />
        </div>
        
        {/* Center Workspace */}
        <div className="flex-1">
          <WorkspaceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </main>
      
      <StatusBar />
      <Footer />
    </div>
  );
};

export default Index;
