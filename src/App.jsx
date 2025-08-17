import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navigation from "./components/Navigation";
import './App.css'
import { useEffect } from "react";
export default function App() {
  return (
    /* 데스크톱에서만 중앙 프레임 + 회색 배경 */
    <div className="h-full md:grid md:place-items-center md:bg-slate-200 ">

      {/* ✅ 모바일: 고정 전체 화면 / 데스크톱: 프레임(390px) */}
      <div
        className="
          fixed inset-0                 /* 모바일: 화면 꽉 채움(바깥 안 보임) */
          w-full h-[100svh] bg-white
          flex flex-col overflow-hidden

          md:static                     /* 데스크톱 전용 프리뷰 크기 */
          md:h-[780px] md:max-w-[390px]
          md:rounded-2xl md:shadow-2xl md:border md:border-slate-300
        "
      >
        {/* Header (고정) */}
        {/* <header className="h-14 shrink-0 flex items-center justify-between px-4 border-b bg-white">
          <h1 className="text-lg font-semibold">My WebApp</h1>
          <button className="text-sm px-3 py-1 rounded-xl border border-blue-500 text-blue-600">
            로그인
          </button>
        </header> */}

        {/* Main (여기만 스크롤) */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4">
          <p className="text-center text-slate-600 mb-4">여기 메인 콘텐츠. (임시 텍스트)</p>
          <div className="h-40 rounded-2xl bg-white shadow flex items-center justify-center">카드/배너</div>
          <div className="h-80 rounded-2xl bg-white shadow flex items-center justify-center mt-4">컨텐츠1</div>
          <div className="h-80 rounded-2xl bg-white shadow flex items-center justify-center mt-4">컨텐츠2</div>
        </main>

        <Navigation />
      </div>
    </div>
  );
}