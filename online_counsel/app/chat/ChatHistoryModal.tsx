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
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-gray-100 p-5 rounded-md w-full max-w-sm md:max-w-lg lg:max-w-xl shadow-xl border-2 border-gray-400 text-gray-800">
        <h2
          className="text-xl font-bold mb-4 text-center text-gray-700"
          // style={{ fontFamily: "'Press Start 2P', cursive" }} // 픽셀 폰트 제거 또는 변경
        >
          대화 목록
        </h2>
        <ul
          className="space-y-2 max-h-60 md:max-h-80 lg:max-h-[500px] overflow-y-auto overflow-x-hidden p-2 bg-white rounded border border-gray-300"
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
              className="text-sm border-b border-gray-200 pb-1.5 mb-1.5 break-words leading-normal"
            >
              <span
                className={`font-bold ${
                  m.role === "user" ? "text-blue-600" : "text-green-600"
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
            className="px-6 py-2 bg-gray-500 text-white rounded-sm border border-gray-600 hover:bg-gray-600 active:bg-gray-700 shadow-sm font-semibold text-sm"
            // style={{ fontFamily: "'Press Start 2P', cursive" }} // 픽셀 폰트 제거 또는 변경
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
