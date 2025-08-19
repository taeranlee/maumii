import Title from "../components/Title";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";

export default function MypageEdit() {
  return (
    <div className="mx-auto w-full max-w-[330px]">
        <Title variant="default" className="mt-10" icon={<Link to="/mypage"><FaArrowLeft className="text-lg"/></Link>}>프로필 변경</Title>
        <div className="place-items-center text-center space-y-4 p-5">
            <div className="w-24 h-24 shadow-[0_0px_8px_rgba(169,96,176,0.4)]" style={{borderRadius:'10px'}}></div>
            <h2 className="text-lg font-bold" style={{letterSpacing: '5px', display: 'inline-block'}}>김이름</h2>
        </div>
        <div className="mt-6 space-y-5">
          <Link to="/" className="w-full h-7 px-14 flex justify-between items-center">
            <span className="font-bold text-gray-500">전화번호 변경하기</span>
            <IoIosArrowForward className="text-gray-500" />
          </Link>
          <Link to="/" className="w-full h-7 px-14 flex justify-between items-center">
            <span className="font-bold text-gray-500">비밀번호 변경하기</span>
            <IoIosArrowForward className="text-gray-500" />
          </Link>
        </div>
    </div>
  );
}