import { useMutation, UseMutationOptions } from "@tanstack/react-query";

const CHAT_API_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:8080/api/v1/chat"; // fallback

export type ChatMessagePart = {
  text: string;
};

export type HistoryMessage = {
  role: "user" | "model"; // "model" 오타 수정
  part: ChatMessagePart[];
};

export type ChatApiRequest = {
  systemInstruction: string;
  history: HistoryMessage[];
  prompt: string;
};

// API 응답이 새로운 'model' 메시지 형태라고 가정합니다.
export type ChatApiResponse = HistoryMessage;

/**
 * 채팅 메시지를 API로 전송하는 함수
 * @param requestData - 채팅 API 요청 데이터
 * @returns API 응답 (새로운 model 메시지)
 */
export const apiSendChatMessage = async (
  requestData: ChatApiRequest
): Promise<ChatApiResponse> => {
  const response = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || JSON.stringify(errorData) || errorMessage;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // 응답 본문이 JSON이 아니거나 파싱에 실패한 경우
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<ChatApiResponse>;
};

/**
 * 채팅 메시지 전송을 위한 TanStack Query useMutation 훅
 */
export const useSendChatMessage = (
  options?: UseMutationOptions<ChatApiResponse, Error, ChatApiRequest>
) => {
  console.log(options);
  return useMutation<ChatApiResponse, Error, ChatApiRequest>({
    mutationFn: apiSendChatMessage,
    ...options,
  });
};
