"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation"; // 캐릭터 정보 수신용
import Image from "next/image";
import ChatHistoryModal from "./ChatHistoryModal";
import {
  useSendChatMessage,
  HistoryMessage,
  ChatApiRequest,
} from "../..//action/chat";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<HistoryMessage[]>([]);
  const [input, setInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const speechBubbleRef = useRef<HTMLDivElement | null>(null); // 말풍선 영역을 위한 ref

  // 캐릭터 선택 페이지에서 전달된 값 사용 (예시)
  const characterNameFromQuery = searchParams.get("characterName") || "상담사";
  const characterImageFromQuery =
    searchParams.get("characterImage") || "/assets/img/default_bot.png"; // 기본 이미지

  const botImage = characterImageFromQuery;
  const selectedCharacter = characterNameFromQuery; // API의 systemInstruction에 사용될 값

  const {
    mutate: sendMessage,
    // useSendChatMessage 훅에서 isLoading 상태를 가져옵니다.
    error: apiError, // 변수 이름 변경 (기존 error와 충돌 방지)
    isPending,
  } = useSendChatMessage({
    onSuccess: (newBotMessage) => {
      // API 응답(봇 메시지)을 메시지 목록에 추가
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);
    },
    onError: (err) => {
      console.error("메시지 전송 실패:", err);
      const errorMessage: HistoryMessage = {
        role: "model",
        part: [
          {
            text: `상담 중 오류가 발생했어요: ${err.message}. 잠시 후 다시 시도해주세요.`,
          },
        ],
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    },
  });

  const handleSendMessage = () => {
    if (!input.trim() || isPending) return; // isLoading 상태에서도 전송 방지

    const userMessage: HistoryMessage = {
      role: "user",
      part: [{ text: input }],
    };

    // 사용자의 메시지를 먼저 화면에 표시 (Optimistic Update)
    // API 요청 시 history에는 이 메시지가 포함되지 않도록 이전 상태를 사용합니다.
    const currentHistory = [...messages];
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const requestData: ChatApiRequest = {
      systemInstruction: selectedCharacter,
      history: currentHistory, // 현재 사용자 메시지 추가 전의 히스토리
      prompt: input,
    };

    sendMessage(requestData);
    setInput("");
  };

  // 항상 마지막 상담사 메시지만 가져옵니다.
  const lastBotMessage = messages.filter((msg) => msg.role === "model").pop();

  // 새 메시지(특히 봇 메시지)가 추가되면 말풍선 영역으로 스크롤
  useEffect(() => {
    if (speechBubbleRef.current) {
      speechBubbleRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [lastBotMessage?.part[0]?.text]); // 마지막 봇 메시지 텍스트가 변경될 때 스크롤

  return (
    <div className="retro-container flex flex-col h-screen w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto border-8 border-yellow-400 shadow-2xl bg-[#2d3748] overflow-hidden">
      {/* 헤더 */}
      <div className="flex justify-between items-center p-3 bg-purple-700 text-yellow-300 border-b-4 border-yellow-400 shadow-md">
        <h1
          className="text-2xl md:text-3xl font-bold tracking-wider"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          {selectedCharacter}와(과) 상담중
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-yellow-400 text-purple-700 rounded-md border-2 border-purple-900 hover:bg-yellow-500 active:bg-yellow-600 shadow-md hover:shadow-lg transition-all text-sm font-semibold"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          대화 목록
        </button>
      </div>

      {/* 모달 */}
      <ChatHistoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        messages={messages}
      />

      {/* 이미지 + 말풍선 */}
      <div
        className="relative flex-1 bg-blue-900/30 overflow-hidden p-4 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/img/retro_bg_pattern.png')" }}
      >
        {" "}
        {/* 예시 배경 이미지 패턴 */}
        <Image
          src={botImage}
          alt={selectedCharacter}
          width={180} // 크기 조정
          height={180} // 크기 조정
          className="absolute bottom-5 right-5 z-10 drop-shadow-[0_5px_5px_rgba(0,0,0,0.4)] object-contain" // 캐릭터 이미지 스타일
          priority // LCP 요소일 경우
        />
        {/* 말풍선 컨테이너, ref를 여기에 연결합니다. */}
        <div
          ref={speechBubbleRef}
          className="absolute bottom-28 left-4 right-4 px-4"
        >
          {/* 마지막 상담사 메시지가 있을 경우에만 말풍선을 표시합니다. */}
          {lastBotMessage && (
            <div
              // 이 div는 항상 "마지막 상담사 메시지"를 표시하므로, 메시지 내용이나 고유 ID를 key로 사용할 수 있습니다.
              // 여기서는 메시지 텍스트를 기반으로 간단한 key를 생성합니다. (더 견고한 ID가 있다면 그것을 사용하세요)
              key={`bot-msg-${lastBotMessage.part[0]?.text.slice(0, 20)}`}
              className="bg-gray-200 text-black rounded-lg p-4 shadow-lg max-h-48 overflow-y-auto overflow-x-hidden text-base border-4 border-gray-700 leading-relaxed" // 말풍선 스타일
              style={{
                scrollbarWidth: "thin", // Firefox 스크롤바 스타일
                scrollbarColor: "#f1c40f #34495e", // Firefox 스크롤바 색상 (thumb track)
              }}
            >
              <p className="font-mono">{lastBotMessage.part[0]?.text}</p>
            </div>
          )}
        </div>
      </div>

      {/* 입력창 */}
      <div className="p-4 border-t-4 border-yellow-400 bg-purple-700">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-3 items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="상담 내용을 입력하세요..."
            className="flex-1 p-3 bg-gray-200 text-black border-2 border-gray-700 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none placeholder-gray-500 font-mono text-base disabled:opacity-70"
            disabled={isPending}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-green-500 text-white rounded-md border-2 border-green-700 hover:bg-green-600 active:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg font-bold text-lg"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
            disabled={isPending}
          >
            {isPending ? "전송중..." : "전송"}
          </button>
        </form>
        {apiError && (
          <p className="text-red-400 text-sm mt-2 font-mono text-center">
            오류: {apiError.message}
          </p>
        )}
      </div>
    </div>
  );
}
