"use client";

import { useState } from "react";
import Link from "next/link";

type ChatPageHeaderProps = {
  characterName: string; // 캐릭터 이름 표시용 (선택적)
  onShowHistory: () => void;
  onResetChat: () => void;
};

export default function ChatPageHeader({
  characterName, // prop 추가
  onShowHistory,
  onResetChat,
}: ChatPageHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleResetChat = () => {
    onResetChat();
    setIsMobileMenuOpen(false); // 모바일 메뉴 닫기
  };

  const handleShowHistory = () => {
    onShowHistory();
    setIsMobileMenuOpen(false); // 모바일 메뉴 닫기
  };

  // 메뉴 아이템 스타일 및 내용 수정
  const menuItems = (
    <>
      <button
        onClick={handleShowHistory}
        className="block w-full text-nowrap text-left px-3 py-2 text-sm hover:bg-blue-100 md:hover:bg-transparent md:text-black md:hover:text-pink-500 md:px-2 md:py-1 rounded font-bold transition-colors"
        aria-label="대화 기록 보기"
      >
        📜 기록
      </button>
      <Link
        href="/"
        className="block w-full text-nowrap px-3 py-2 text-sm hover:bg-blue-100 md:hover:bg-transparent md:text-black md:hover:text-pink-500 md:px-2 md:py-1 rounded font-bold transition-colors"
        aria-label="캐릭터 선택 화면으로 이동"
      >
        🏠 선택
      </Link>
      <button
        onClick={handleResetChat}
        className="block w-full text-nowrap text-left px-3 py-2 text-sm hover:bg-blue-100 md:hover:bg-transparent md:text-black md:hover:text-pink-500 md:px-2 md:py-1 rounded font-bold transition-colors"
        aria-label="대화 내용 초기화"
      >
        ✨ 초기화
      </button>
    </>
  );

  return (
    <header className="bg-gradient-to-r from-cyan-300 to-blue-400 text-black shadow-md border-b-4 border-black p-2 font-pixel">
      <div className="container mx-auto flex justify-end items-center">
        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-1 items-center">{menuItems}</nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-black focus:outline-none p-1 border-2 border-black rounded bg-white/50 hover:bg-white"
            aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMobileMenuOpen}
          >
            {/* 픽셀 스타일 아이콘 (SVG 또는 이미지 사용 가능) */}
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              {isMobileMenuOpen ? (
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/90 shadow-lg rounded-b border-x-2 border-b-2 border-black mt-1">
          <div className="pt-2 pb-3 space-y-1">{menuItems}</div>
        </div>
      )}
    </header>
  );
}
