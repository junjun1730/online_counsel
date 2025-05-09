"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const botImage = "/assets/img/2.png"; // 캐릭터 이미지 경로

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    const botMsg: Message = {
      sender: "bot",
      text: `상담사 응답: "${input}"에 대한 조언입니다.`,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  const handleReset = () => {
    if (confirm("대화 내용을 초기화할까요?")) {
      setMessages([]);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <div className="flex justify-between items-center p-4 bg-blue-600 text-white">
        <h1 className="text-xl font-bold">상담 챗봇</h1>
        <button
          onClick={handleReset}
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
        >
          대화 초기화
        </button>
      </div>

      {/* 대화 내역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <div className="w-10 h-10 mr-2 relative shrink-0">
                <Image
                  src={botImage}
                  alt="bot"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )}
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-200 text-right"
                  : "bg-white border text-left"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div className="p-4 bg-white border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 p-2 border rounded"
          placeholder="메시지를 입력하세요..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          전송
        </button>
      </div>
    </div>
  );
}
