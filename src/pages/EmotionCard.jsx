import { useEffect, useState } from "react";
import Title from "../components/Title";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import EMOTIONS from "../data/Emotion.js";

export default function EmotionCard() {
    const [theme, setTheme] = useState("cloud");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // 세션에서 theme 불러오는 방법
        const savedTheme = sessionStorage.getItem("theme");
        if (savedTheme) setTheme(savedTheme);
    }, []);

    const prev = () => setIndex((index - 1 + EMOTIONS.length) % EMOTIONS.length);
    const next = () => setIndex((index + 1) % EMOTIONS.length);

    const emotion = EMOTIONS[index];

    return (
        <div>
            <div>
                <Title variant="default" className="sticky mt-20 text-white"
                     icon={<Link to="/record"><FaArrowLeft className="text-lg"/></Link>}>
                </Title>
            </div>
            <div className="fixed inset-0 flex justify-center mb-14 bg-black bg-opacity-40 z-50">
                <button onClick={prev} className="text-4xl text-white">
                    <IoIosArrowBack />
                </button>
                <div className="bg-white rounded-xl shadow-lg w-72 min-h-[500px] flex items-center">
                    <div className="grid place-items-center py-1">
                        <img
                            src={emotion.images[theme]}
                            alt={emotion.name}
                            className="w-32 h-32 mb-4"
                        />
                        <h2 className="text-2xl font-bold">{emotion.name}</h2>
                        <div className="mt-4 space-y-1 text-gray-600">
                            {emotion.description.map((line, idx) => (
                            <p key={idx}>{line}</p>
                            ))}
                        </div>
                    </div>
                </div>
                <button onClick={next} className="text-4xl text-white">
                    <IoIosArrowForward />
                </button>
            </div>
        </div>
    );
};