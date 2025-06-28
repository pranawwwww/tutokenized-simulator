import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Loader2, Cloud, Monitor } from 'lucide-react';

interface CodeEditorProps {
  onExecutionResult?: (result: any) => void;
}

const WorkingCodeEditor: React.FC<CodeEditorProps> = ({ onExecutionResult }) => {
  console.log('WorkingCodeEditor rendering...');
  
  const [code, setCode] = useState(`print("*** Hello World from SOL VM! ***")
print("=" * 40)
x = 15
y = 25
result = x + y
print(f"Calculation: {x} + {y} = {result}")
numbers = [1, 2, 3, 4, 5]
squares = [n**2 for n in numbers]
print(f"Numbers: {numbers}")
print(f"Squares: {squares}")
print("Counting:")
for i in range(1, 6):
    print(f"Count {i}")
def greet(name):
    return f"Hello, {name}!"
print(greet("SOL VM User"))
import time
time.sleep(0.1)
print("Code execution completed successfully!")`);

  const [isExecuting, setIsExecuting] = useState(false);
  const [currentExecutor, setCurrentExecutor] = useState<'local' | 'hybrid'>('hybrid');

  const executeCode = async () => {
    if (!code.trim()) {
      console.warn('No code to execute');
      return;
    }

    setIsExecuting(true);
    
    try {
      // Import executorManager dynamically to avoid initialization issues
      const { executorManager } = await import('@/utils/executorManager');
      const result = await executorManager.executeCode(code);
      
      console.log('Code execution result:', result);
      
      if (onExecutionResult) {
        onExecutionResult({
          ...result,
          timestamp: new Date().toISOString(),
          code: code
        });
      }
      
    } catch (error: any) {
      console.error('Code execution failed:', error);
      
      if (onExecutionResult) {
        onExecutionResult({
          id: Date.now().toString(),
          success: false,
          output: '',
          error: `Execution failed: ${error.message}`,
          execution_time: 0,
          timestamp: new Date().toISOString(),
          code: code,
          executor_type: currentExecutor,
          system_info: {}
        });
      }
    } finally {
      setIsExecuting(false);
    }
  };

  const handleRefresh = () => {
    setCode(`print("Hello World from SOL VM!")
x = 10
y = 20
result = x + y
print(f"{x} + {y} = {result}")
print("Counting to 5:")
for i in range(1, 6):
    print(f"Count {i}")
print("Code execution completed!")`);
  };

  const getExecutorIcon = () => {
    switch (currentExecutor) {
      case 'hybrid':
        return <Cloud className="w-4 h-4" />;
      case 'local':
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getExecutorColor = () => {
    switch (currentExecutor) {
      case 'hybrid':
        return 'bg-blue-500/20 text-blue-700 border-blue-300';
      case 'local':
      default:
        return 'bg-green-500/20 text-green-700 border-green-300';
    }
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            Python Code Editor
          </span>
          <Badge variant="outline" className={`${getExecutorColor()} flex items-center gap-1 font-medium`}>
            {getExecutorIcon()}
            {currentExecutor === 'hybrid' ? 'SOL VM' : 'Local'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your Python code here..."
          className="min-h-[300px] font-mono text-sm resize-none border-slate-200 focus:border-blue-400 focus:ring-blue-400"
        />
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={executeCode}
            disabled={isExecuting || !code.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
          >
            {isExecuting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isExecuting ? 'Running...' : 'Run Code'}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isExecuting}
            className="flex items-center gap-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkingCodeEditor;
