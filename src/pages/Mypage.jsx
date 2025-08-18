import Button from "../components/Button";
import Input from "../components/Input";
import Layout from "../components/Layout";
import Title from "../components/Title";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { FaArrowRightToBracket } from "react-icons/fa6";

export default function Mypage() {
  return (
    <Layout>
      <div>
          <Title variant="default" className="mt-10" >마이페이지</Title>
          <div className="place-items-center text-center space-y-4 p-5">
              <div className="w-24 h-24 shadow-[0_0px_8px_rgba(169,96,176,0.4)]" style={{borderRadius:'10px'}}></div>
              <h2 className="text-lg font-bold" style={{letterSpacing: '5px', display: 'inline-block'}}>김이름</h2>
          </div>
          <div className="mt-6 space-y-5">
            <Link to="/" className="w-full h-7 px-20 flex justify-between items-center">
              <a className="font-bold text-gray-500">프로필 정보 변경</a>
                <IoIosArrowForward className="text-gray-500" />
            </Link>
            <Link to="/" className="w-full h-7 px-20 flex justify-between items-center">
              <a className="font-bold text-gray-500">나의 보호자 관리</a>
                <IoIosArrowForward className="text-gray-500" />
            </Link>
            <Link to="/" className="w-full h-7 px-20 flex justify-between items-center">
              <a className="font-bold text-gray-500">나의 대화 기록</a>
                <IoIosArrowForward className="text-gray-500" />
            </Link>
            <Link to="/" className="w-full h-7 px-20 flex justify-between items-center">
              <a className="font-bold text-gray-500">테마 변경</a>
                <IoIosArrowForward className="text-gray-500" />
            </Link>
            <Link to="/" className="w-full h-7 px-20 flex justify-between items-center">
              <a className="font-bold text-gray-500">오디오 설정</a>
              <IoIosArrowForward className="text-gray-500" />
            </Link>
          </div>
          <div className="mt-8">
            <Link to="/" className="text-center flex justify-center items-center">
              <FaArrowRightToBracket className="mr-2 text-sm text-gray-400"/>
              <a className="text-sm text-gray-400">로그아웃</a>
            </Link>
          </div>
      </div>
    </Layout>
  );
}