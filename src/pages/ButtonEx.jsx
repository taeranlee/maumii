import Button from "../components/Button";
import Input from "../components/Input";
import Layout from "../components/Layout";


export default function ButtonEx() {
  return (
    <Layout>
    <div className="space-y-4 p-6">
      {/* 기본 보라 버튼 */}
    
    <Button>보라 버튼</Button>

      <Input></Input>
      <div className="w-[200px]">
      <Input
        label="비밀번호"
        type="password"
        placeholder="******"
        onChange={(e) => setPw(e.target.value)}
      />
      
    </div>
      

      {/* 아웃라인 버튼 */}
      <Button variant="outline">하얀 보더 버튼</Button>

      {/* 꽉 찬 보라 버튼 */}
      <div className="w-[200px]">
      <Button full>가득 찬 버튼</Button>
      </div>

      {/* 작은 아웃라인 버튼 */}
      <Button variant="outline" size="sm">작은 버튼</Button>

      {/* 큰 보라 버튼 (비활성화) */}
      <Button disabled>비활성화</Button>
    </div>
    </Layout>
  );
}