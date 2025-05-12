"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
// uuid 설치 필요: npm install uuid @types/uuid
import { v4 as uuidv4 } from "uuid";

// 경로 별칭 사용 권장 (@/...)
import ChatHistoryModal from "./ChatHistoryModal";
import {
  useSendChatMessage,
  HistoryMessage,
  ChatApiRequest,
} from "@/action/chat"; // 경로 별칭 예시
import ChatPageHeader from "../component/ChatPageHeader"; // 경로 별칭 예시

// 표시용 메시지 타입 (임시 ID 포함)
type DisplayMessage = HistoryMessage & { tempId?: string };

// --- 컴포넌트 분리 제안 ---
// 아래 컴포넌트들을 별도 파일로 분리하는 것을 고려해보세요.
// 1. CharacterDisplay (캐릭터 이미지 표시)
// 2. SpeechBubble (말풍선 표시)
// 3. ChatInputForm (입력 폼)
// 4. ApiErrorNotification (API 에러 알림)
// -------------------------

export default function ChatPage() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null); // API 에러 상태
  const chatAreaRef = useRef<HTMLDivElement | null>(null); // 채팅 영역 전체 ref (스크롤용)

  const characterNameFromQuery = searchParams.get("characterName") || "상담사";
  const characterImageFromQuery =
    searchParams.get("characterImage") || "/assets/img/default_bot.png";
  const characterBgImage =
    searchParams.get("characterBg") || "/assets/img/bg_default.png"; // 캐릭터별 배경 이미지

  const botImage = characterImageFromQuery;
  const selectedCharacter = characterNameFromQuery;

  const {
    mutate: sendMessage,
    isPending, // isLoading -> isPending 으로 변경 (React Query v5 기준)
  } = useSendChatMessage({
    onSuccess: (newBotMessage) => {
      setApiError(null); // 성공 시 에러 메시지 초기화
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);
    },
    onError: (err, variables) => {
      // variables 에 요청 시 사용된 데이터 포함 (tempId 포함)
      console.error("메시지 전송 실패:", err);
      // Optimistic Update 롤백: 실패 시 보냈던 사용자 메시지를 tempId 기준으로 제거
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.tempId !== variables.tempId)
      );
      // 사용자에게 보여줄 에러 메시지 설정
      setApiError(`⚠️ 오류 발생: ${err.message} (잠시 후 다시 시도해주세요)`);
    },
  });

  const handleSendMessage = () => {
    if (!input.trim() || isPending) return;

    // 이전 에러 메시지 숨김
    setApiError(null);

    const tempId = uuidv4(); // 임시 고유 ID 생성
    const userMessage: DisplayMessage = {
      role: "user",
      part: [{ text: input }],
      tempId: tempId, // 메시지에 임시 ID 추가
    };

    // Optimistic Update: 사용자 메시지를 즉시 화면에 추가
    // API 요청 history에는 tempId 없는 확정된 메시지만 사용
    const currentHistory = messages.filter((msg) => !msg.tempId);
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // API 요청 데이터 구성 (tempId 포함하여 onError에서 롤백 시 사용)
    const requestData: ChatApiRequest & { tempId: string } = {
      systemInstruction: selectedCharacter,
      history: currentHistory,
      prompt: input,
      tempId: tempId, // onError 콜백에서 참조하기 위해 tempId 추가
    };

    // 메시지 전송 API 호출
    sendMessage(requestData);
    setInput(""); // 입력창 비우기
  };

  // 마지막 메시지 (봇 또는 사용자) 가져오기 - UI 표시용
  const lastMessage = messages[messages.length - 1];

  // 메시지 목록이 변경될 때마다 채팅 영역 맨 아래로 스크롤
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]); // messages 배열이 변경될 때마다 실행

  return (
    // 전체 컨테이너: 픽셀 스타일 배경, 테두리 등
    <div className="flex flex-col h-screen w-full max-w-2xl mx-auto shadow-2xl border-4 border-black bg-blue-100 overflow-hidden font-pixel">
      <ChatPageHeader
        onShowHistory={() => setShowModal(true)}
        onResetChat={() => {
          setMessages([]); // 메시지 초기화
          setApiError(null); // 에러 상태도 초기화
        }}
      />

      {/* 모달 */}
      <ChatHistoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        messages={messages} // 모든 메시지 전달 (DisplayMessage[])
      />

      {/* 채팅 영역: 배경 이미지, 캐릭터, 말풍선 */}
      <div
        ref={chatAreaRef}
        className="flex-1 relative h-full p-4"
        style={{
          backgroundImage: `url(${characterBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} // 캐릭터별 배경
      >
        {/* API 에러 표시 */}
        {apiError && (
          // ApiErrorNotification 컴포넌트로 분리 가능
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md z-30 p-2 bg-red-500 text-white border-2 border-black rounded shadow-md text-center text-sm font-bold">
            {apiError}
          </div>
        )}

        {/* 캐릭터 이미지 */}
        {/* CharacterDisplay 컴포넌트로 분리 가능 */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10 mb-[-20px] w-full">
          <Image
            src={botImage}
            alt={selectedCharacter}
            width={500} // 크기 조정
            height={800} // 크기 조정
            className="object-contain drop-shadow-lg" // 그림자 효과
            priority
          />
        </div>

        {/* 말풍선 영역 */}
        {/* SpeechBubble 컴포넌트로 분리 가능 */}
        <div className="absolute bottom-36 left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm z-20 min-h-[80px]">
          {/* 마지막 메시지가 모델(봇) 메시지일 때만 표시 */}
          {lastMessage && lastMessage.role === "model" && (
            <div
              key={
                lastMessage.id ||
                lastMessage.tempId ||
                `bot-msg-${messages.length}`
              } // key 안정성 확보
              className="bg-white text-black rounded-lg p-3 shadow-md border-2 border-black min-h-[80px] text-sm leading-relaxed break-words" // 스타일 변경
            >
              <p>{lastMessage.part[0]?.text}</p>
            </div>
          )}
          {/* 마지막 메시지가 사용자 메시지이고 전송중일 때 임시 표시 (선택 사항) */}
          {lastMessage &&
            lastMessage.role === "user" &&
            isPending &&
            lastMessage.tempId && (
              <div
                key={lastMessage.tempId}
                className="bg-gray-200 text-gray-500 italic rounded-lg p-3 shadow-sm border-2 border-gray-400 min-h-[80px] text-sm leading-relaxed break-words"
              >
                <p>전송 중...</p>
              </div>
            )}
        </div>
      </div>

      {/* 입력 영역 */}
      {/* ChatInputForm 컴포넌트로 분리 가능 */}
      <div className="p-3 border-t-4 border-black bg-gray-300">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2 items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 p-2 bg-white text-black border-2 border-gray-500 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none placeholder-gray-500 text-sm disabled:opacity-60 font-pixel"
            disabled={isPending} // 전송 중 비활성화
            aria-label="채팅 메시지 입력"
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded border-2 border-black font-bold text-base transition-all duration-150 ease-in-out shadow-sm ${
              isPending
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-yellow-400 text-black hover:bg-yellow-500 active:bg-yellow-600 transform hover:scale-105"
            }`}
            disabled={isPending}
          >
            {isPending ? "뿅..." : "전송!"}
          </button>
        </form>
      </div>
    </div>
  );
}
