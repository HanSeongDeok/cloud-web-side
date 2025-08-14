import React from "react";

const RecoveryPage: React.FC = () => (
  <>
    <main className="min-h-screen p-8">
       <h2 className="text-2xl font-bold mb-4">복구</h2>
       <p className="text-gray-600">파일 복구 기능을 제공하는 페이지입니다.</p>
       <div className="mt-6">
         <div className="bg-gray-100 p-6 rounded-lg">
           <h3 className="text-lg font-semibold mb-2">복구 기능</h3>
           <p className="text-sm text-gray-500">삭제된 파일을 복구하는 기능이 여기에 구현됩니다.</p>
         </div>
       </div>
    </main>
  </>
);

export default RecoveryPage;
