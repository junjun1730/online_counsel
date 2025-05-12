import Image from "next/image"; // next/image 사용
import Link from "next/link"; // Link 컴포넌트 사용

type CharacterCardProps = {
  name: string;
  description: string;
  image: string;
  bgImage?: string; // 캐릭터 배경 이미지 prop 추가 (선택적)
};

export default function CharacterCard({
  name,
  description,
  image,
  bgImage, // 배경 이미지 prop 사용
}: CharacterCardProps) {
  // 캐릭터 상세 정보 URL 생성 (예시: 이름 기준)
  const chatUrl = `/chat?characterName=${encodeURIComponent(
    name
  )}&characterImage=${encodeURIComponent(image)}${
    bgImage ? `&characterBg=${encodeURIComponent(bgImage)}` : "" // 배경 이미지 파라미터 추가
  }`;

  return (
    // Link 컴포넌트로 감싸서 클릭 시 채팅 페이지로 이동
    <Link href={chatUrl} legacyBehavior>
      <a className="block cursor-pointer bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg shadow-md p-4 hover:shadow-lg transition w-full sm:w-60 border-4 border-purple-400 hover:border-pink-500 transform hover:-translate-y-1 font-pixel">
        {/* next/image 사용 */}
        <div className="relative w-full h-40 mb-3 border-2 border-black rounded overflow-hidden bg-white">
          <Image
            src={image}
            alt={name}
            layout="fill" // 부모 요소에 맞춰 채우기
            objectFit="contain" // 비율 유지하며 포함
            className="rounded-lg"
          />
        </div>
        <h2 className="text-lg font-bold text-purple-800 mb-1 truncate">
          {name}
        </h2>
        <p className="text-sm text-gray-700 h-10 overflow-hidden">
          {description}
        </p>
      </a>
    </Link>
  );
}

/* CSS 추가 필요 (예: global.css) */
/*
.font-pixel {
  font-family: 'YourPixelFont', sans-serif; // 실제 픽셀 폰트 이름으로 변경
}
*/
