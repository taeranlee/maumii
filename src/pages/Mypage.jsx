import Button from "../components/Button";
import Input from "../components/Input";
import Layout from "../components/Layout";
import Title from "../components/Title";

export default function Mypage() {
  return (
    <Layout>
      <div className="place-items-center">
          <Title variant="default" className="mt-10" >마이페이지</Title>
          <div className="space-y-4 p-5">
              <div className="w-24 h-24 shadow-[0_0px_8px_rgba(169,96,176,0.4)]" style={{borderRadius:'10px'}}></div>
              <h2 className="text-center font-bold" style={{letterSpacing: '5px'}}>김지독</h2>
          </div>
          <div>
            <div className="h-7 bg-gray-500 px-20" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <a className="bg-cloud-partner">프로필 정보 변경</a>
              <span className="bg-cloud-mine">{'>'}</span>
            </div>
          </div>
      </div>
    </Layout>
  );
}