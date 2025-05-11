"use client";

import { useEffect, useRef } from "react";
import type { HistoryMessage } from "../../action/chat"; // 상대 경로로 수정

type ChatHistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  messages: HistoryMessage[]; // Message -> HistoryMessage
};

export default function ChatHistoryModal({
  isOpen,
  onClose,
  messages,
}: ChatHistoryModalProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  return (
    // 모달 배경은 투명하게, 대신 모달 컨텐츠에 배경색과 테두리 적용
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-purple-700 p-5 rounded-lg w-full max-w-sm md:max-w-lg lg:max-w-xl shadow-2xl border-4 border-yellow-400 text-yellow-300">
        <h2
          className="text-2xl font-bold mb-5 text-center"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          대화 목록
        </h2>
        <ul
          className="space-y-3 max-h-60 md:max-h-80 lg:max-h-[500px] overflow-y-auto overflow-x-hidden p-3 bg-purple-800/70 rounded-md border-2 border-yellow-500/80"
          style={{ scrollbarColor: "#f1c40f #4a044e" }}
        >
          {/* thumb track for firefox */}
          {messages.map((m, idx) => (
            <li
              // key를 좀 더 안정적으로 변경: m.part[0]?.text가 없을 수도 있음을 고려
              key={
                m.part[0]?.text
                  ? `${m.role}-${idx}-${m.part[0].text.slice(0, 10)}`
                  : `${m.role}-${idx}`
              }
              className="text-base border-b-2 border-yellow-500/40 pb-2 mb-2 break-words leading-snug"
            >
              <span
                className={`font-bold ${
                  m.role === "user" ? "text-green-400" : "text-pink-400"
                }`}
              >
                [{m.role === "user" ? "나" : "상담사"}]:
              </span>
              {m.part[0]?.text}
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-yellow-400 text-purple-800 rounded-md border-2 border-purple-900 hover:bg-yellow-500 active:bg-yellow-600 shadow-md hover:shadow-lg transition-all font-bold text-lg"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
