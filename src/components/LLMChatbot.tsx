
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const LLMChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI GPU tutor. I can help you with CUDA programming, GPU optimization, parallel computing concepts, and performance analysis. What would you like to learn today?",
      timestamp: new Date(),
    },
  ]);
  
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        type: 'bot',
        content: getBotResponse(inputMessage),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputMessage('');
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('cuda') || input.includes('gpu programming')) {
      return "CUDA (Compute Unified Device Architecture) is NVIDIA's parallel computing platform. It allows you to harness GPU power for general-purpose computing. Key concepts include:\n\n• **Threads & Blocks**: GPU work is organized in threads grouped into blocks\n• **Memory Hierarchy**: Global, shared, and local memory types\n• **Kernel Functions**: Functions that run on GPU\n\nWould you like me to explain any of these concepts in detail?";
    } else if (input.includes('memory') || input.includes('bandwidth')) {
      return "GPU memory optimization is crucial for performance! Here are the key types:\n\n• **Global Memory**: Largest but slowest, accessible by all threads\n• **Shared Memory**: Fast, on-chip memory shared within a block\n• **Constant Memory**: Read-only, cached memory for uniform data\n• **Texture Memory**: Optimized for spatial locality\n\nTip: Always minimize global memory accesses and maximize memory coalescing!";
    } else if (input.includes('performance') || input.includes('optimization')) {
      return "GPU performance optimization strategies:\n\n• **Occupancy**: Maximize active warps per SM\n• **Memory Coalescing**: Align memory accesses\n• **Bank Conflicts**: Avoid shared memory conflicts\n• **Divergence**: Minimize thread divergence\n• **Async Operations**: Use streams for overlap\n\nWhich optimization technique would you like to explore further?";
    } else {
      return "That's a great question! I can help you with various GPU computing topics including CUDA programming, memory optimization, parallel algorithms, performance tuning, and debugging techniques. Could you be more specific about what you'd like to learn?";
    }
  };

  return (
    <Card className="h-full shadow-lg flex flex-col">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          LLM GPU Tutor
          <Badge variant="secondary" className="ml-auto bg-white/20 text-white">
            Online
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {message.type === 'user' ? 
                    <User className="w-4 h-4" /> : 
                    <Bot className="w-4 h-4" />
                  }
                </div>
                
            <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-purple-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about GPU programming..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-purple-500 hover:bg-purple-600"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-50">
              CUDA basics
            </Badge>
            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-50">
              Memory optimization
            </Badge>
            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-50">
              Performance tuning
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LLMChatbot;
