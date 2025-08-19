import { FaBook } from "react-icons/fa";
import { FiHelpCircle } from "react-icons/fi";

export default function Record() {
    return(
        <div className="bg-text-200 h-full">
            <div className="flex justify-between">
                <div className="m-8">
                    <FaBook className="text-white h-5 w-5"/>
                </div>
                <div className="m-8">
                    <FiHelpCircle className="text-white h-6 w-6"/>
                </div>
            </div>

            {/* 상대방 버튼*/}
            <div className="m-auto w-20 h-20 rounded-full bg-white border-4 border-cloud-partner flex items-center justify-center">
                <span className="w-12 h-12">
                    <img src="src/assets/images/구르미.svg"></img>
                </span>
            </div>

            {/* main 여기서 여러가지 비동기 동작 */}
            <div className="h-[50%]">
                
            </div>

            {/* 내 버튼*/}
            <div className="m-auto w-20 h-20 rounded-full bg-white border-4 border-cloud-mine flex items-center justify-center">
                <span className="w-12 h-12">
                    <img src="src/assets/images/구르미.svg"></img>
                </span>
            </div>

        </div>
    );
}