import { useEffect, useState } from "react";
import Title from "../components/Title";
import Input from "../components/Input";
import Button from "../components/Button";
import Collapse from "../components/Collapse";
import ConfirmModal from "../components/ConfirmModal";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { FaCirclePlus } from "react-icons/fa6";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Protector() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState(""); // 인증코드
    const [list, setList] = useState([]); // 등록된 이메일 리스트
    const [showCodeInput, setShowCodeInput] = useState(false); // 추가 폼
    const [open, setOpen] = useState(false); // 모달 열린 상태
    const [targetProtector, setTargetProtector] = useState(null); // 삭제할 보호자 정보
    const [loading, setLoading] = useState(false);
    const [addLoading, setAddLoading] = useState(false);

    const { user } = useAuth();

    // 처음 렌더링 시 DB에서 기존 데이터 불러오기
    useEffect(() => {
        const fetchProtectors = async () => {
            if (!user?.uId) return;

            try {
                setLoading(true);
                // GET /api/users/{uId}/protectors - 컨트롤러와 일치
                const response = await api.get(`/api/users/${user.uId}/protectors`);
                console.log("보호자 목록:", response.data);
                setList(response.data || []);
            } catch (error) {
                console.error("보호자 목록 조회 실패:", error);
                if (error?.response?.status !== 404) {
                    alert("보호자 목록을 불러오는데 실패했습니다.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProtectors();
    }, [user]);

    // 이메일 형식 검증
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const canSubmit = email.trim() && code.trim();

    // 보호자 추가
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user?.uId) {
            alert("사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
            return;
        }

        if (!canSubmit) {
            alert("이메일과 인증번호를 모두 입력해주세요.");
            return;
        }

        if (!isValidEmail(email.trim())) {
            alert("올바른 이메일 형식이 아닙니다.");
            return;
        }

        try {
            setAddLoading(true);
            
            // POST /api/users/{uId}/protectors - 컨트롤러와 일치
            const response = await api.post(`/api/users/${user.uId}/protectors`, null, {
                params: { pEmail: email.trim() }
            });
            
            console.log("보호자 추가 성공:", response.data);
            
            // 화면 업데이트
            setList((prev) => [...prev, response.data]);
            
            // 폼 초기화
            setEmail("");
            setCode("");
            setShowCodeInput(false);
            
            alert("보호자가 성공적으로 등록되었습니다.");
            
        } catch (error) {
            console.error("보호자 추가 실패:", error);
            
            let errorMessage = "보호자 등록에 실패했습니다.";
            
            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.response?.status === 400) {
                errorMessage = "잘못된 이메일이거나 이미 등록된 보호자입니다.";
            } else if (error?.response?.status === 404) {
                errorMessage = "해당 이메일의 사용자를 찾을 수 없습니다.";
            }
            
            alert(errorMessage);
        } finally {
            setAddLoading(false);
        }
    };

    // 보호자 삭제
    const handleDelete = async () => {
        if (!targetProtector || !user?.uId) return;

        try {
            // DELETE /api/users/{uId}/protectors/{pId} - 컨트롤러와 일치
            await api.delete(`/api/users/${user.uId}/protectors/${targetProtector.pId}`);
            
            // 로컬 state에서도 삭제
            setList((prev) => prev.filter((item) => item.pId !== targetProtector.pId));
            
            // 모달 닫기
            setOpen(false);
            setTargetProtector(null);
            
            alert("보호자가 성공적으로 삭제되었습니다.");
            
        } catch (error) {
            console.error("보호자 삭제 실패:", error);
            
            let errorMessage = "보호자 삭제에 실패했습니다.";
            
            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.response?.status === 404) {
                errorMessage = "삭제할 보호자를 찾을 수 없습니다.";
            }
            
            alert(errorMessage);
        }
    };

    // 로그인하지 않은 사용자 처리
    if (!user) {
        return (
            <div className="mx-auto w-full max-w-[330px]">
                <Title variant="default" className="my-10">
                    보호자 관리
                </Title>
                <div className="text-center mt-20">
                    <p className="text-gray-500 mb-4">로그인이 필요합니다.</p>
                    <Link to="/login">
                        <Button>로그인하러 가기</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-[330px]">
            <Title 
                variant="default" 
                className="my-10" 
                icon={
                    <Link to="/mypage">
                        <FaArrowLeft className="text-lg"/>
                    </Link>
                }
            >
                보호자 관리
            </Title>
            
            <div className="px-6 space-y-3 mb-4">
                <span className="font-bold text-gray-500">등록된 이메일</span>
                
                {loading ? (
                    <div className="text-center py-4">
                        <span className="text-gray-500">로딩 중...</span>
                    </div>
                ) : list.length === 0 ? (
                    <div className="text-center py-4">
                        <span className="text-gray-500">등록된 보호자가 없습니다.</span>
                    </div>
                ) : (
                    list.map((protector) => (
                        <div 
                            key={protector.pId} 
                            className="bg-gray-100 flex justify-between items-center px-2 py-2 shadow-[0_2px_4px_rgba(0,0,0,0.25)]" 
                            style={{borderRadius:'10px'}}
                        >
                            <span className="pl-2 font-bold text-gray-700">
                                {protector.pEmail}
                            </span>
                            <button 
                                onClick={() => { 
                                    setTargetProtector(protector); 
                                    setOpen(true); 
                                }}
                            >
                                <span className="bg-white text-sm px-2 py-1" style={{borderRadius:'10px'}}>
                                    삭제
                                </span>
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="px-6 my-10 cursor-pointer">
                <div 
                    className="grid place-items-center border py-1" 
                    style={{borderRadius:'5px'}} 
                    onClick={() => setShowCodeInput(true)}
                >
                    <FaCirclePlus className="text-primary"/>
                </div>
            </div>

            <ConfirmModal
                isOpen={open}
                title="보호자 이메일을 삭제하시겠습니까?"
                description="보호자 해제 메일이 발송됩니다."
                onConfirm={handleDelete}
                onCancel={() => {
                    setOpen(false);
                    setTargetProtector(null);
                }}
            />

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
                            <Button variant="outline" type="button">
                                인증하기
                            </Button>
                        </div>

                        {/* 인증번호 입력창 */}
                        <div className="flex items-end gap-2">
                            <Input
                                className="flex-1"
                                label="인증번호"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="6자리"
                            />
                            <Button variant="outline" type="button">
                                확인
                            </Button>
                        </div>

                        <div className="pt-5">
                            <Button full type="submit" disabled={!canSubmit || addLoading}>
                                {addLoading ? "등록 중..." : "저장하기"}
                            </Button>
                        </div>
                    </div>
                </form>
            </Collapse>
        </div>
    );
}