"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Paperclip, ArrowLeft, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

interface Chat {
  id: number;
  listing: any;
  buyer: any;
  seller: any;
  last_message_at: string;
  lastMessage?: any;
}

interface Message {
  id: number;
  sender_id: number;
  body: string;
  created_at: string;
  sender: any;
}

export default function MessagesPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userData = localStorage.getItem("user");
  const currentUserId = userData && userData !== 'undefined' ? JSON.parse(userData)?.id : null;
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      setShouldAutoScroll(true); // Scroll to bottom on first load
      loadMessages(selectedChat.id);
      setTimeout(() => setShouldAutoScroll(false), 1500); // Disable after initial load
      
      // Set up polling for new messages (simulating real-time)
      const interval = setInterval(() => {
        loadMessages(selectedChat.id);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  useEffect(() => {
    // Only auto-scroll if user is at bottom or it's first load
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages, shouldAutoScroll]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChats = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/chats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      const data = await response.json();
      setChats(data.data || []);
      if (data.data && data.data.length > 0) {
        setSelectedChat(data.data[0]);
      }
    } catch (error) {
      console.error("Failed to load chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: number) => {
    try {
      // This would be a real endpoint - simulating for now
      // const response = await fetch(`/api/v1/chats/${chatId}/messages`);
      // For now, using mock data
      setMessages([
        {
          id: 1,
          sender_id: currentUserId === 1 ? 2 : 1,
          body: "Hi! Is this item still available?",
          created_at: new Date().toISOString(),
          sender: { name: "Buyer" },
        },
        {
          id: 2,
          sender_id: currentUserId,
          body: "Yes, it's still available! Would you like to see it?",
          created_at: new Date().toISOString(),
          sender: { name: "You" },
        },
      ]);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachments([...attachments, ...files]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && attachments.length === 0) || !selectedChat) return;

    try {
      // Upload attachments first if any
      let attachmentUrls: string[] = [];
      
      if (attachments.length > 0) {
        setUploading(true);
        const formData = new FormData();
        attachments.forEach(file => formData.append('files[]', file));
        
        const uploadResponse = await fetch("/api/v1/media/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: formData,
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          attachmentUrls = uploadData.media.map((m: any) => m.url);
        }
        setUploading(false);
      }

      // Send message
      const response = await fetch("/api/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          chat_id: selectedChat.id,
          body: newMessage,
          attachments: attachmentUrls,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        setAttachments([]);
        setShouldAutoScroll(true); // Enable scroll for user's message
        loadMessages(selectedChat.id);
        setTimeout(() => setShouldAutoScroll(false), 1000); // Disable after 1s
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4" />
            <div className="h-96 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <Link href="/dashboard">
            <Button variant="secondary" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="opacity-90">Chat with buyers and sellers</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          {/* Chat List */}
          <Card className="md:col-span-1 overflow-hidden">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-y-auto h-full">
                {chats.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>No conversations yet</p>
                    <p className="text-sm mt-2">
                      Start chatting by contacting a seller from a listing
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {chats.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => setSelectedChat(chat)}
                        className={`w-full p-4 text-left hover:bg-accent transition-colors ${
                          selectedChat?.id === chat.id ? "bg-accent" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                            {(chat.buyer?.name || chat.seller?.name)?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {currentUserId === chat.buyer_id
                                ? chat.seller?.name
                                : chat.buyer?.name}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {chat.listing?.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(chat.last_message_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="md:col-span-2 flex flex-col overflow-hidden">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {(currentUserId === selectedChat.buyer_id
                        ? selectedChat.seller?.name
                        : selectedChat.buyer?.name)?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {currentUserId === selectedChat.buyer_id
                          ? selectedChat.seller?.name
                          : selectedChat.buyer?.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Re: {selectedChat.listing?.title}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.sender_id === currentUserId;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              isOwn
                                ? "bg-gradient-to-r from-balkly-blue to-iris-purple text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            {/* Attachments */}
                            {message.attachments_json && message.attachments_json.length > 0 && (
                              <div className="mb-2 space-y-2">
                                {message.attachments_json.map((url: string, idx: number) => (
                                  <div key={idx}>
                                    {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                      <img 
                                        src={url} 
                                        alt="Attachment" 
                                        className="max-w-full rounded cursor-pointer"
                                        onClick={() => window.open(url, '_blank')}
                                      />
                                    ) : (
                                      <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm underline"
                                      >
                                        <Paperclip className="h-3 w-3" />
                                        View File
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            <p className="whitespace-pre-wrap">{message.body}</p>
                            <p className={`text-xs mt-1 ${isOwn ? "text-white/70" : "text-gray-500"}`}>
                              {new Date(message.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  {/* Attachment Preview */}
                  {attachments.length > 0 && (
                    <div className="mb-3 flex gap-2 flex-wrap">
                      {attachments.map((file, index) => (
                        <div key={index} className="relative group">
                          {file.type.startsWith('image/') ? (
                            <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 rounded-lg border-2 border-gray-200 flex items-center justify-center bg-gray-50">
                              <Paperclip className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <button
                            onClick={() => removeAttachment(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,application/pdf,.doc,.docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <div className="animate-spin">⏳</div>
                      ) : (
                        <Paperclip className="h-4 w-4" />
                      )}
                    </Button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border rounded-lg"
                      disabled={uploading}
                    />
                    <Button type="submit" disabled={(!newMessage.trim() && attachments.length === 0) || uploading}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p>Select a conversation to start chatting</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

