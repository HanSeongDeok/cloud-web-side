import React from "react";

const ManagersPage: React.FC = () => (
  <div>
    <h4 className="text-lg font-semibold mb-4">관리자 목록</h4>
    <p className="text-gray-600 mb-6">시스템 관리자 권한을 관리하는 탭입니다.</p>
    
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h5 className="font-medium mb-2">현재 관리자</h5>
        <p className="text-sm text-gray-500">관리자 권한 부여/해제 기능이 여기에 구현됩니다.</p>
        <div className="mt-3">
          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
            관리자 추가
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ManagersPage;
