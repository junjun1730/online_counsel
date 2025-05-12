"use client";

import { useState } from "react";
import Link from "next/link";

type ChatPageHeaderProps = {
  characterName: string;
  onShowHistory: () => void;
  onResetChat: () => void;
};

export default function ChatPageHeader({
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

  const menuItems = (
    <>
      <button
        onClick={handleShowHistory}
        className="block w-full text-nowrap text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:text-white md:hover:text-yellow-300 md:px-3 md:py-2 rounded-md"
      >
        대화 목록
      </button>
      <Link
        href="/"
        className="block w-full text-nowrap px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:text-white md:hover:text-yellow-300 md:px-3 md:py-2 rounded-md"
      >
        캐릭터 선택
      </Link>
      <button
        onClick={handleResetChat}
        className="block w-full text-nowrap text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:text-white md:hover:text-yellow-300 md:px-3 md:py-2 rounded-md"
      >
        대화 초기화
      </button>
    </>
  );

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-end items-center">
        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-2 items-center">{menuItems}</nav>
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
            aria-label="메뉴 열기"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16m-7 6h7"
                }
              ></path>
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-md">
          {menuItems}
        </div>
      )}
    </header>
  );
}
