export default function Title({ children, variant = "default", className = "" }) {
  const base = "font-bold text-center mb-6 " + className;

  const styles = {
    auth: "m-20 text-4xl text-primary " + base,   // 로그인/회원가입용
    default: "text-2xl text-black " + base,      // 일반 페이지용
  };

  return <div className={styles[variant]}>{children}</div>;
}