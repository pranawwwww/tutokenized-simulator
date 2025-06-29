import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: number;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

const LLMChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingBotMessage, setPendingBotMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll chat to bottom when messages or loading changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    // Do NOT focus the textarea here or anywhere else
  }, [messages, isLoading, pendingBotMessage]);

  // Auto-resize textarea and scroll to caret
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 120) + "px"; // 5 lines max (approx 120px)
      inputRef.current.scrollTop = inputRef.current.scrollHeight;
    }
  }, [inputMessage]);

  const API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0X2lkIjoiNmNhMGI4NjlhYTJkNDY2MmJiMWYxZWM2NDJkMzljZjQiLCJzZXJ2aWNlX2FwcCI6ImtlLXNvbF9oYWNrYXRob25fMTciLCJrZXlfaWQiOiI4NWM4ZWFiMi0zYzQ1LTRiOTItYmZhNy05NzJlNTllNjI0ODAiLCJ0eXBlIjoic2VydmljZSIsImFwaSI6Im1haW4iLCJpYXQiOjE3NTA2MzYxMDEsImlzcyI6ImFkbWluLWJldGEifQ.yf2H-jZxX1zWOpl-a33j6bY8u7ojr9DCXs4V7S1tmek";

  const sendApiQuery = async (query: string): Promise<string> => {
    const body = {
      query,
      endpoint: "queryV2",
      model_provider: "openai",
      model_name: "gpt4o",
      model_params: {
        temperature: 0.5,
        max_tokens: 2000,
        top_p: 0.9,
        top_k: 3,
      },
      enable_search: false,
      enable_history: true,
      semantic_caching: false,
      response_format: { type: "text" },
      enhance_prompt: {
        timezone: "MST",
        time: false,
        date: false,
        verbosity: "none",
      },
    };

    try {
      const res = await fetch("https://api-main-beta.aiml.asu.edu/query", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("API error");
      }
      const data = await res.json();
      // Only return the 'response' field as markdown
      return data.response || "No response from model.";
    } catch (err) {
      return "Sorry, there was an error fetching the response.";
    }
  };

  // Typing animation for bot response (word by word)
  const animateBotMessage = async (fullText: string) => {
    setPendingBotMessage("");
    setIsLoading(true);
    const words = fullText.split(" ");
    let current = "";
    for (let i = 0; i < words.length; i++) {
      current += (i === 0 ? "" : " ") + words[i];
      setPendingBotMessage(current);
      await new Promise((res) => setTimeout(res, 30)); // 30ms per word
    }
    setPendingBotMessage("");
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        type: "bot",
        content: fullText,
        timestamp: new Date(),
      },
    ]);
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const botReply = await sendApiQuery(userMessage.content);
      await animateBotMessage(botReply);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full shadow-lg flex flex-col">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          LLM GPU Tutor
          <Badge variant="secondary" className="ml-auto bg-white/20 text-white">
            {isLoading ? "Thinking..." : "Online"}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* Fixed height, scrollable chat area */}
        <div
          className="flex-1"
          style={{
            maxHeight: 400,
            minHeight: 200,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "1rem",
          }}
        >
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === "user"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                <div
                  className={`flex-1 max-w-[80%] ${
                    message.type === "user" ? "text-right" : ""
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-purple-500 text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    }`}
                    style={{
                      wordBreak: "break-word",
                      overflowX: "auto",
                      maxWidth: "100%",
                    }}
                  >
                    <div
                      className="text-sm leading-relaxed break-words"
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        overflowX: "auto",
                        maxWidth: "100%",
                      }}
                    >
                      {message.type === "bot" ? (
                        <ReactMarkdown
                          components={{
                            code({ inline, className, children, ...props }: any) {
                              return (
                                <code
                                  className={`bg-gray-200 px-1 py-0.5 rounded text-xs font-mono ${className || ""}`}
                                  style={{
                                    wordBreak: "break-word",
                                    overflowX: "auto",
                                    display: inline ? "inline" : "block",
                                  }}
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {/* Typing animation for bot */}
            {pendingBotMessage && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 max-w-[80%]">
                  <div className="inline-block p-3 rounded-lg bg-gray-100 text-gray-800 rounded-bl-sm">
                    <div
                      className="text-sm"
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        overflowX: "auto",
                        maxWidth: "100%",
                      }}
                    >
                      <ReactMarkdown>{pendingBotMessage}</ReactMarkdown>
                      <span className="animate-pulse">|</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isLoading && !pendingBotMessage && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 max-w-[80%]">
                  <div className="inline-block p-3 rounded-lg bg-gray-100 text-gray-800 rounded-bl-sm">
                    <div className="text-sm">Thinking...</div>
                  </div>
                </div>
              </div>
            )}
            {/* This div is used for scrolling to bottom */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t p-4 flex-shrink-0">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about GPU programming..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 resize-none rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isLoading}
              rows={1}
              style={{
                maxHeight: 120,
                minHeight: 40,
                overflowY: "auto",
              }}
            />
            <Button
              onClick={handleSendMessage}
              className="bg-purple-500 hover:bg-purple-600"
              size="icon"
              disabled={isLoading || !inputMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2 mt-2">
            <Badge
              variant="outline"
              className="text-xs cursor-pointer hover:bg-gray-50"
            >
              CUDA basics
            </Badge>
            <Badge
              variant="outline"
              className="text-xs cursor-pointer hover:bg-gray-50"
            >
              Memory optimization
            </Badge>
            <Badge
              variant="outline"
              className="text-xs cursor-pointer hover:bg-gray-50"
            >
              Performance tuning
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LLMChatbot;