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
import ChatPageHeader from "../component/ChatPageHeader";

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
    <div className="retro-container flex flex-col h-screen w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto  shadow-2xl bg-[#2d3748] overflow-hidden">
      <ChatPageHeader
        characterName={selectedCharacter}
        onShowHistory={() => setShowModal(true)}
        onResetChat={() => setMessages([])}
      />

      {/* 모달 */}
      <ChatHistoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        messages={messages}
      />

      {/* 이미지 + 말풍선 */}
      <div className="relative flex-1 bg-gray-400 overflow-hidden p-4">
        {/* 예시 배경 이미지 패턴 */}
        <Image
          src={botImage}
          alt={selectedCharacter}
          width={400} // 이미지 크기 증가
          height={400} // 이미지 크기 증가
          className="absolute bottom-0 left-0 z-10 object-contain" // z-index 수정
          priority // LCP 요소일 경우
        />
        {/* 말풍선 컨테이너, ref를 여기에 연결합니다. */}
        <div
          ref={speechBubbleRef}
          className="absolute bottom-10 left-4 right-4 px-4 z-20" // z-index 추가 및 위치 조정
        >
          {/* 마지막 상담사 메시지가 있을 경우에만 말풍선을 표시합니다. */}
          {lastBotMessage && (
            <div
              key={`bot-msg-${lastBotMessage.part[0]?.text.slice(0, 20)}`}
              className="bg-white text-black rounded-md p-3 shadow-md min-h-40 overflow-y-auto overflow-x-hidden text-sm border-2 border-gray-500 leading-normal" // 스타일 변경
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
      <div className="p-4 border-t-2 min-h-30 border-gray-500 bg-gray-200">
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
            className="flex-1 p-2 bg-white text-black border border-gray-400 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-500 text-sm disabled:opacity-70"
            disabled={isPending}
          />
          <button
            type="submit"
            className="px-5 py-2 bg-blue-500 text-white rounded-sm border border-blue-700 hover:bg-blue-600 active:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-semibold text-sm"
            // style={{ fontFamily: "'Press Start 2P', cursive" }} // 픽셀 폰트 제거 또는 변경
            disabled={isPending}
          >
            {isPending ? "전송중..." : "전송"}
          </button>
        </form>
      </div>
    </div>
  );
}
