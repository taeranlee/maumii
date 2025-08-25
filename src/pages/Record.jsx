import { FaBook } from "react-icons/fa";
import { FiHelpCircle } from "react-icons/fi";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HelpScreen from "./HelpScreen";
import EmotionCard from "./EmotionCard";

export default function Record() {
    const [isRecording, setIsRecording] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showEmotion, setShowEmotion] = useState(false);

    return (
        <div className="bg-text-200 h-full">
            <div className="flex justify-between">
                <div className="m-8">
                    <FaBook 
                    onClick={() => setShowEmotion(true)}
                    className="cursor-pointer text-white h-5 w-5" 
                    />
                </div>
                <div className="m-8">
                    <FiHelpCircle
                        onClick={() => setShowHelp(true)}
                        className="cursor-pointer text-white h-6 w-6"
                    />
                </div>
            </div>

            {/* 상대방 버튼*/}
            <div className="cursor-pointer m-auto w-20 h-20 rounded-full bg-white border-4 border-cloud-partner flex items-center justify-center">
                <span className="w-12 h-12">
                    <img src="src/assets/images/구르미.svg"></img>
                </span>
            </div>

            {/* main 여기서 여러가지 비동기 동작 */}
            <div className="h-[40%] grid place-items-center">
                <div className="flex flex-col items-center">
                    <img src="src/assets/images/구르미.svg" alt="" />
                    <div className="text-white mt-2 font-semibold">새로운 녹음</div>
                </div>
            </div>

            {/* 내 버튼*/}
            <div className="cursor-pointer m-auto w-20 h-20 rounded-full bg-white border-4 border-cloud-mine flex items-center justify-center">
                <span className="w-12 h-12">
                    <img src="src/assets/images/구르미.svg"></img>
                </span>
            </div>
             {/* 도움말 오버레이 (fade) */}
            <AnimatePresence>
                {showHelp && (
                <motion.div
                    className="absolute inset-0 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <HelpScreen onClose={() => setShowHelp(false)} />
                </motion.div>
                )}
            </AnimatePresence>
            
            {/* 감정 카드 오버레이 */}
            <AnimatePresence>
                {showEmotion && (
                <motion.div
                    className="absolute inset-0 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <EmotionCard onClose={() => setShowEmotion(false)} />
                </motion.div>
                )}
            </AnimatePresence>
            
        </div>
    );
}