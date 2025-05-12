"use client";

import { useEffect, useRef } from "react";
// 경로 별칭 사용 권장 (tsconfig.json 설정 필요)
import type { HistoryMessage } from "@/action/chat"; // 예: @/action/chat

type ChatHistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  messages: HistoryMessage[]; // HistoryMessage 타입 사용 (id 필드 포함 가능성)
};

export default function ChatHistoryModal({
  isOpen,
  onClose,
  messages,
}: ChatHistoryModalProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 모달이 열릴 때마다 맨 아래로 스크롤
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages]); // messages 배열이 변경될 때마다 스크롤

  if (!isOpen) return null;

  return (
    // ARIA 속성 추가 및 키보드 이벤트 처리 고려 (접근성 향상)
    <div
      className="fixed inset-0 flex justify-center items-center z-50 p-4 bg-black/70 backdrop-blur-sm" // 배경 어둡게, 블러 효과
      onClick={onClose} // 배경 클릭 시 닫기
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-history-title"
    >
      <div
        className="bg-gradient-to-b from-blue-100 to-blue-200 p-5 rounded-lg w-full max-w-sm md:max-w-md lg:max-w-lg shadow-lg border-4 border-blue-500 text-gray-800 font-pixel" // 픽셀 폰트, 그라데이션 배경, 두꺼운 테두리
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록 이벤트 전파 중단
      >
        <h2
          id="chat-history-title"
          className="text-2xl font-bold mb-4 text-center text-blue-800" // 폰트 크기, 색상 변경
        >
          ✨ 대화 기록 ✨
        </h2>
        <ul
          className="space-y-2 max-h-60 md:max-h-80 lg:max-h-[500px] overflow-y-auto p-3 bg-white/80 rounded border-2 border-blue-300 custom-scrollbar" // 반투명 배경, 커스텀 스크롤바 클래스
        >
          {messages.map((m, idx) => (
            <li
              // 메시지에 고유 ID가 있다면 m.id 사용 권장, 없다면 인덱스 사용 (최후의 수단)
              key={m.id || `msg-${idx}`}
              className="text-sm border-b-2 border-dashed border-blue-200 pb-2 mb-2 break-words leading-relaxed" // 점선 테두리, 줄 간격
            >
              <span
                className={`font-bold mr-1 ${
                  m.role === "user" ? "text-purple-600" : "text-green-600"
                }`}
              >
                {m.role === "user" ? "😎 나:" : "🤖 상담사:"}{" "}
                {/* 이모지 추가 */}
              </span>
              {/* 메시지 텍스트 렌더링 */}
              {m.part[0]?.text}
            </li>
          ))}
          {/* 스크롤 타겟용 빈 div */}
          <div ref={messagesEndRef} />
        </ul>
        <div className="mt-6 text-center">
          {/* 닫기 버튼 스타일 변경 */}
          <button
            onClick={onClose}
            className="px-6 py-2 bg-yellow-400 text-black rounded border-2 border-yellow-600 hover:bg-yellow-500 active:bg-yellow-600 shadow-md font-bold text-lg transform hover:scale-105 transition-transform"
            aria-label="대화 기록 닫기"
          >
            닫기!
          </button>
        </div>
      </div>
    </div>
  );
}
