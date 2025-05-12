"use client";

import { useState } from "react";
import Link from "next/link"; // Link 컴포넌트 import
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const characters = [
  {
    name: "70대 교회 목사님",
    description: "따뜻하고 인자한 말투로 인생 상담을 해주는 목사님",
    image: "/assets/img/3.png",
    background: "/assets/img/bg3.png",
  },
  {
    name: "30대 비즈니스맨",
    description: "속도감 있고 날카로운 조언을 해주는 커리어 전문가",
    image: "/assets/img/1.png",
    background: "/assets/img/bg1.png",
  },
  {
    name: "정 많은 할머니",
    description: "사투리가 섞인 푸근한 조언을 해주는 이웃집 할머니",
    image: "/assets/img/2.png",
    background: "/assets/img/bg2.png",
  },
];
export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentChar = characters[currentIndex];

  const handleChange = (direction: "next" | "prev") => {
    setCurrentIndex((prev) =>
      direction === "next"
        ? (prev + 1) % characters.length
        : (prev - 1 + characters.length) % characters.length
    );
  };

  return (
    <div className="relative min-h-screen max-w-5xl m-auto">
      {/* Background Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentChar.background}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentChar.background})` }}
        />
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen p-4 backdrop-brightness-75">
        <h1 className="text-white text-2xl font-bold bg-black/60 p-2 rounded-md mt-6">
          캐릭터를 선택해주세요
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-black/40 p-6 rounded-xl w-full max-w-5xl mt-6">
          {/* 캐릭터 이미지 영역 */}
          <div className="relative w-48 h-64 sm:w-64 sm:h-80">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentChar.image}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <Image
                  src={currentChar.image}
                  alt={currentChar.name}
                  fill
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 설명 영역 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChar.name}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="text-white max-w-md text-center sm:text-left"
            >
              <h2 className="text-xl font-bold mb-2">{currentChar.name}</h2>
              <p className="text-md">{currentChar.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 좌우 선택 버튼 */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => handleChange("prev")}
            className="bg-white/70 px-4 py-2 rounded-md hover:bg-white"
          >
            ← 이전
          </button>
          <button
            onClick={() => handleChange("next")}
            className="bg-white/70 px-4 py-2 rounded-md hover:bg-white"
          >
            다음 →
          </button>
        </div>

        {/* 상담 시작 버튼 */}
        <Link
          href={`/chat?characterName=${encodeURIComponent(
            currentChar.name
          )}&characterImage=${encodeURIComponent(currentChar.image)}`}
          passHref
        >
          <motion.button
            className="mt-10 mb-8 px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl text-xl shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentChar.name}와(과) 상담 시작
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
