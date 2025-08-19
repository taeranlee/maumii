import Title from "../components/Title";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { FaArrowRightToBracket } from "react-icons/fa6";

export default function Mypage() {
  return (
    <div className="mx-auto w-full max-w-[330px]">
        <Title variant="default" className="mt-10">마이페이지</Title>
        <div className="place-items-center text-center space-y-4 p-5">
            <div className="w-24 h-24 shadow-[0_0px_8px_rgba(169,96,176,0.4)]" style={{borderRadius:'10px'}}></div>
            <h2 className="text-lg font-bold" style={{letterSpacing: '5px', display: 'inline-block'}}>김이름</h2>
        </div>
        <div className="mt-6 space-y-5">
          <Link to="/mypage/edit" className="w-full h-7 px-14 flex justify-between items-center">
            <span className="font-bold text-gray-500">프로필 정보 변경</span>
            <IoIosArrowForward className="text-gray-500" />
          </Link>
          <Link to="/mypage/protector" className="w-full h-7 px-14 flex justify-between items-center">
            <span className="font-bold text-gray-500">나의 보호자 관리</span>
            <IoIosArrowForward className="text-gray-500" />
          </Link>
          <Link to="/" className="w-full h-7 px-14 flex justify-between items-center">
            <span className="font-bold text-gray-500">나의 대화 기록</span>
            <IoIosArrowForward className="text-gray-500" />
          </Link>
          <Link to="/" className="w-full h-7 px-14 flex justify-between items-center">
            <span className="font-bold text-gray-500">테마 변경</span>
            <IoIosArrowForward className="text-gray-500" />
          </Link>
          <Link to="/" className="w-full h-7 px-14 flex justify-between items-center">
            <span className="font-bold text-gray-500">오디오 설정</span>
            <IoIosArrowForward className="text-gray-500" />
          </Link>
        </div>
        <div className="mt-8">
          <Link to="/" className="text-center flex justify-center items-center">
            <FaArrowRightToBracket className="mr-2 text-sm text-gray-400"/>
            <span className="text-sm text-gray-400">로그아웃</span>
          </Link>
        </div>
    </div>
  );
}