import React, { useState, useRef, useEffect } from "react";
import { Search, Send, Sparkles, Bot, User, AlertCircle } from "lucide-react";

export default function App() {
  // State management for the chat interface
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm DREW GPT, your creative research assistant. What would you like to explore today?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reference to scroll to bottom of messages
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔧 BACKEND CONNECTION FUNCTION
  const sendMessageToBackend = async (userMessage) => {
    try {
      // backend endpoint - URL
      const BACKEND_URL = "https://llm-backend-6b4x.onrender.com/chat";

      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: userMessage,
        }),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // 📝 Adjust this based on your backend response format
      // Common formats: data.response, data.message, data.reply, data.content
      return data.response;
    } catch (error) {
      console.error("Backend connection error:", error);
      throw error;
    }
  };

  // Handle form submission and API calls
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim() || isLoading) return;

    // Clear any previous errors
    setError(null);

    // Create user message
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString(),
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Clear input field
    const currentQuery = query;
    setQuery("");

    try {
      // 🚀 Call backend API
      const botResponse = await sendMessageToBackend(currentQuery);

      // Create bot response message
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: botResponse,
        timestamp: new Date().toLocaleTimeString(),
      };

      // Add bot response to chat
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // Handle errors gracefully
      console.error("Error sending message:", error);
      setError("Failed to get response. Please try again.");

      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content:
          "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date().toLocaleTimeString(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press in input field
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Sparkles className="w-12 h-12 text-yellow-400 animate-spin-slow" />
              <div className="absolute inset-0 w-12 h-12 bg-yellow-400/20 rounded-full blur-lg"></div>
            </div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              DREW GPT
            </h1>
            <div className="relative">
              <Bot className="w-12 h-12 text-cyan-400 animate-bounce" />
              <div className="absolute inset-0 w-12 h-12 bg-cyan-400/20 rounded-full blur-lg"></div>
            </div>
          </div>
          <p className="text-xl text-gray-300 font-medium">
            Your Creative Research Companion
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 w-6 h-6" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="w-full pl-14 pr-16 py-4 bg-transparent text-white placeholder-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 rounded-2xl disabled:opacity-50"
              />
              <button
                onClick={handleSubmit}
                disabled={!query.trim() || isLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white p-2 rounded-xl transition-all duration-200 hover:scale-105 disabled:scale-100 shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Output Area */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 px-6 py-4 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Bot className="w-6 h-6 text-cyan-400" />
              OUTPUT
            </h2>
          </div>

          <div className="h-96 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.type === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-green-400 to-blue-500"
                      : message.isError
                      ? "bg-gradient-to-r from-red-500 to-orange-500"
                      : "bg-gradient-to-r from-purple-500 to-pink-500"
                  } shadow-lg`}
                >
                  {message.type === "user" ? (
                    <User className="w-5 h-5 text-white" />
                  ) : message.isError ? (
                    <AlertCircle className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>

                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 text-white ml-auto"
                      : message.isError
                      ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 text-white"
                      : "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-white"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {typeof message.content === "object" &&
                    message.content !== null ? (
                      <div>
                        {message.content.topic && (
                          <div>
                            <strong>Topic:</strong> {message.content.topic}
                          </div>
                        )}
                        {message.content.summary && (
                          <div>
                            <strong>Summary:</strong> {message.content.summary}
                          </div>
                        )}
                        {message.content.sources &&
                          Array.isArray(message.content.sources) && (
                            <div>
                              <strong>Sources:</strong>
                              <ul className="list-disc list-inside">
                                {message.content.sources.map((src, idx) => (
                                  <li key={idx}>{src}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        {message.content.tools_used &&
                          Array.isArray(message.content.tools_used) && (
                            <div>
                              <strong>Tools Used:</strong>
                              <ul className="list-disc list-inside">
                                {message.content.tools_used.map((tool, idx) => (
                                  <li key={idx}>{tool}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    ) : (
                      message.content
                    )}
                  </p>
                  <p className="text-xs text-gray-300 mt-2 opacity-70">
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 px-4 py-3 rounded-2xl shadow-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Invisible element to scroll to bottom */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400">
          <p className="text-sm">
            Created by Dreww | Powered by creativity and imagination ✨
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-purple-500\\/50::-webkit-scrollbar-thumb {
          background-color: rgba(168, 85, 247, 0.5);
          border-radius: 3px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
