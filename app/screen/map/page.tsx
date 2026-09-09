"use client";
import { useState } from "react";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";
import { BsFillBadgeWcFill } from "react-icons/bs";
import { IoFlaskOutline } from "react-icons/io5";
import { IoBookOutline } from "react-icons/io5";

 const spotData = [
        { id: 1, name: "7号館", category: "研究室", mark: <IoFlaskOutline />, top: "50%", left: "40%" },
        { id: 2, name: "図書館", category: "自習室", mark: <IoBookOutline />, top: "70%", left: "60%" },
        { id: 3, name: "メインWC", category: "トイレ", mark: <BsFillBadgeWcFill />, top: "20%", left: "50%" },
    ];


export default function MapPage() {
    
    {/* それぞれの選択肢の状態 */}
    const [selectedOption, setSelectedOption] = useState<string | null>("すべて");
    const categories = ["すべて", "研究室", "自習室", "トイレ", "カフェ", "その他"];

    // 選択されたカテゴリに応じてピンをフィルタリング
    const filteredSpots = spotData.filter((spot) => {
        if (!selectedOption || selectedOption === "すべて") return true;
        return spot.category === selectedOption;
    })

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
                    <input type="text" placeholder="検索" className="w-full focus:outline-none"></input>
                </div>
                {/* フィルターボタンエリア */}
                 <div className="my-4 px-3 flex justify-between gap-4 overflow-x-auto flex-nowrap">
                    {categories.map((option) => (
                        <button 
                            key={option}
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
            <main className="p-4 bg-[#FFF8F6]">
                <div className="w-full h-96 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400 text-sm relative">
                    {/* マップ部分のエリア */}
                    <Image 
                    src="/seta_b_l_2026.jpg" alt="マップ" 
                    width={800} height={600}
                    className="w-full h-auto object-cover"
                    priority 
                    />
                    {/*画像の上に重ねるピン*/}
                    {filteredSpots.map((spot) => (
                        <div 
                            key={spot.id} 
                            style={{ top: spot.top, left: spot.left }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group"
                            onClick={() => alert(`${spot.name} (${spot.category})`)}
                        >
                            {/*ラベル表示 */}
                            <div className="flex items-center gap-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded mt-0.5 whitespace-nowrap" >
                                <div className="text-sm">{spot.mark}</div>
                                {spot.name}
                            </div>
                            <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-red-500"></div>
                        </div>
                    ))}
                   

                </div>
            </main>
        </div>
    )
}