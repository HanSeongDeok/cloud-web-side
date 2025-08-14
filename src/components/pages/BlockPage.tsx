import React from "react";

const BlockPage: React.FC = () => (
  <>
    <main className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">시스템 차단</h1>
        <p className="text-xl text-gray-700 mb-6">접근이 차단되었습니다.</p>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-lg font-semibold mb-2">차단 사유</h2>
          <p className="text-gray-600 mb-4">관리자에 의해 시스템 접근이 제한되었습니다.</p>
          <p className="text-sm text-gray-500">문의사항이 있으시면 관리자에게 연락해주세요.</p>
        </div>
      </div>
    </main>
  </>
);

export default BlockPage;
