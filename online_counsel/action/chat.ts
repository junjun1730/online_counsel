import { useMutation, UseMutationOptions } from "@tanstack/react-query";

// 환경 변수를 사용하여 API URL 관리 (프로덕션 빌드 시 fallback URL 노출 주의)
const CHAT_API_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:8080/api/v1/chat"; // 개발용 fallback

export type ChatMessagePart = {
  text: string;
};

// 메시지 객체에 고유 ID 필드 추가 고려 (key 관리 및 상태 업데이트 용이)
export type ResponseMessage = string;
export type HistoryMessage = {
  id?: string; // 백엔드에서 고유 ID를 부여하거나 프론트에서 생성
  role: "user" | "model";
  part: ChatMessagePart[];
};

export type ChatApiRequest = {
  systemInstruction: string;
  history: HistoryMessage[]; // API 요청 시에는 확정된 히스토리만 전달
  prompt: string;
};

// API 응답 타입 정의 (현재는 HistoryMessage 와 동일)
export type ChatApiResponse = HistoryMessage;

/**
 * 채팅 메시지를 API로 전송하는 함수 (네트워크 에러 포함 처리 강화)
 * @param requestData - 채팅 API 요청 데이터
 * @returns API 응답 (새로운 model 메시지)
 */
export const apiSendChatMessage = async (
  requestDataWithTempId: ChatApiRequest & { tempId: string }
): Promise<ResponseMessage> => {
  const { tempId, ...requestData } = requestDataWithTempId;

  try {
    const response = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 필요하다면 다른 헤더 추가 (e.g., 인증 토큰)
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      try {
        const contentType = response.headers.get("Content-Type");
        if (contentType?.includes("application/json")) {
          const errorData = await response.json();
          errorMessage =
            errorData.message || JSON.stringify(errorData) || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
      } catch (parseError) {
        console.error("Failed to parse error response body:", parseError);
      }
      throw new Error(errorMessage);
    }

    // 성공 시 응답 JSON 파싱 (ChatApiResponse 타입으로 가정)
    return response.text();
  } catch (error) {
    // 네트워크 에러 또는 위에서 throw된 에러 처리
    console.error("API call failed:", error);
    // Error 객체가 아닌 경우를 대비해 문자열로 변환
    const message = error instanceof Error ? error.message : String(error);
    // 일관된 에러 처리를 위해 Error 객체 throw
    throw new Error(`Failed to send message: ${message}`);
  }
};

/**
 * 채팅 메시지 전송을 위한 TanStack Query useMutation 훅
 * onSuccess, onError 콜백은 사용하는 컴포넌트에서 정의
 */
export const useSendChatMessage = (
  options?: UseMutationOptions<
    string,
    Error,
    ChatApiRequest & { tempId: string }
  > // tempId 포함
) => {
  // 명시적으로 제네릭 타입을 지정하여 타입 안정성 강화
  return useMutation<string, Error, ChatApiRequest & { tempId: string }>({
    mutationFn: apiSendChatMessage,
    ...options, // 컴포넌트에서 전달된 onSuccess, onError 등 옵션 적용
  });
};
