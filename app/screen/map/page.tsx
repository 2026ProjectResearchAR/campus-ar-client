"use client";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";


export default function MapPage() {
    
    {/* それぞれの選択肢の状態 */}
    const [selectedOption, setSelectedOption] = useState<string | null>("すべて");
    const categories = ["すべて", "研究室", "自習室", "トイレ", "カフェ", "その他"];

    const handleOptionClick = (option: string) => {
        if (selectedOption === option) {
            setSelectedOption(null);
        } else {
            setSelectedOption(option);
        }
    }

    return (
        // ph-24 でタブバートコンテンツが被らないように下に隙間を作る
        <div className="relative w-full max-w-[430px] mx-auto min-h-screen font-sans pb-24">
            <div className="w-full h-25 bg-[#FFF8F6]">
                {/* 検索バー */}
                <div className="flex items-center gap-2 px-3 py-2 mx-6 bg-white rounded-full shadow-lg">
                    <FiSearch />
                    <input type="" placeholder="検索" className="w-full focus:outline-none"></input>
                </div>
                {/* フィルターボタンエリア */}
                 <div className="my-4 px-3 flex justify-between gap-4 overflow-x-auto flex-nowrap">
                    {categories.map((option) => (
                        <button 
                            className={`px-4 rounded-full shadow-lg border shrink-0 ${
                                selectedOption === option 
                                    ? "bg-blue-500 text-white border-blue-500" 
                                    : "bg-white text-black border-gray-100 hover:bg-gray-200"
                            } transition-colors`}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
           

            {/* メインマップエリア */}
            <main className="p-4">
                <div className="w-full h96 bg-gray-200 rouded-2xl flex itemes-center justifi-center text-gray-400 text-sm">
                    [ ここに地図とピンが入ります]
                </div>
            </main>
        </div>
    )
}