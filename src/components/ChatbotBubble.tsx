
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from 'lucide-react';
import LLMChatbot from './LLMChatbot';

const ChatbotBubble = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[500px] z-50 shadow-2xl rounded-lg overflow-hidden">
          <LLMChatbot />
        </div>
      )}

      {/* Floating Bubble Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg z-50 p-0"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </Button>
    </>
  );
};

export default ChatbotBubble;
