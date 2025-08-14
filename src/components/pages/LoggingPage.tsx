import React from "react";

const LoggingPage: React.FC = () => {
  const handleClick = () => {
    // /logs/app 경로로 브라우저 이동 → Ingress에서 가로채어 auth 로직 실행
    window.location.href = "/logs";
  };

  return (
    <main className="min-h-screen p-8">
      <h2 className="text-2xl font-bold mb-4">로그 관리</h2>
      <p className="text-gray-600 mb-6">시스템 로그를 확인하는 페이지입니다.</p>
      <button
        onClick={handleClick}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
      >
        상세 로그 보기
      </button>
    </main>
  );
};

export default LoggingPage;
