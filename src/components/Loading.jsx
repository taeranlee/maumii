export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-32">
      <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
// import LoadingSpinner from "../components/Loading"; 해서 사용