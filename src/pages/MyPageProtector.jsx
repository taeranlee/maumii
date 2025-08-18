import { useEffect, useState } from "react";
import axios from "axios";
import Title from "../components/Title";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import Collapse from "../components/Collapse"
import { FaArrowLeft } from "react-icons/fa6";
import { FaCirclePlus } from "react-icons/fa6";

export default function MyPageProtector() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [list, setList] = useState([]);
    const [showCodeInput, setShowCodeInput] = useState(false);

    // 처음 렌더링 시 DB에서 기존 데이터 불러오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/mypage/protector");
                setList(res.data);
            } catch(error) {
                console.log("API 에러: ", error);
            }
        };
        fetchData();
    }, []);

    // 버튼 클릭 시 DB에 저장 + 화면 비동기 업데이트
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!canSubmit){
            alert("빈 곳을 채워주세요.");
            return;
        }
        const res = await axios.post("/mypage/protector", { email });
        setList((prev) => [...prev, res.data]); // 화면 비동기 업데이트
    }

    return (
        <div className="mx-auto w-full max-w-[330px]">
            <Title variant="default" className="my-10" icon={<Link to="/mypage"><FaArrowLeft className="text-lg"/></Link>}>보호자 관리</Title>
            <div className="px-6 space-y-3 mb-4">
                <span className="font-bold text-gray-500">등록된 이메일</span>
                {/* DB 에서 보호자 목록 불러올 때
                {list.map((u, i) => (
                    <div className="bg-gray-100 flex justify-between items-center px-2 py-2 shadow-[0_2px_4px_rgba(0,0,0,0.25)]" style={{borderRadius:'10px'}}>
                        <span className="pl-2 font-bold text-gray-700">kosamsa3@gmail.com</span>
                        <Link to="/">
                            <span className="bg-white text-sm px-2 py-1" style={{borderRadius:'10px'}}>삭제</span>
                        </Link>
                    </div>
                ))}  */}
                <div className="bg-gray-100 flex justify-between items-center px-2 py-2 shadow-[0_2px_4px_rgba(0,0,0,0.25)]" style={{borderRadius:'10px'}}>
                    <span className="pl-2 font-bold text-gray-700">kosamsa3@gmail.com</span>
                    <Link to="/">
                        <span className="bg-white text-sm px-2 py-1" style={{borderRadius:'10px'}}>삭제</span>
                    </Link>
                </div>
            </div>

            <div className="px-6 my-10 cursor-pointer">
                <div className="place-items-center border py-1" style={{borderRadius:'5px'}} onClick={() => setShowCodeInput(true)}>
                    <FaCirclePlus className="text-primary"/>
                </div>
            </div>

            <Collapse show={showCodeInput} duration={350}>
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto bg-white">
                    <div className="mx-auto w-full max-w-[330px] px-6 pb-24 space-y-3">
                        {/* 이메일 + 인증하기 */}
                        <div className="flex items-end gap-2">
                            <Input
                                className="flex-1"
                                label="이메일"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="전체 이메일 입력"
                            />
                            <Button variant="outline">
                                인증하기
                            </Button>
                        </div>

                        {/* 인증번호 입력창 (조건부 렌더링) */}
                        <div className="flex items-end gap-2">
                            <Input
                                className="flex-1"
                                label="인증번호"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="6자리"
                            />
                            <Button variant="outline">
                                확인
                            </Button>
                        </div>
                    </div>
                </form>
            </Collapse>

            <div className="px-6 sticky bottom-12 pt-5 bg-white">
                <Button full type="submit">
                    저장하기
                </Button>
            </div>
        </div>
    );
}