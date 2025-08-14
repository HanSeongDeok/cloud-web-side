import React from "react";

const WhitelistRequestsTab: React.FC = () => (
  <div>
    <h4 className="text-lg font-semibold mb-4">권한 요청 목록</h4>
    <p className="text-gray-600 mb-6">사용자들의 권한 요청을 검토하고 승인/거부하는 탭입니다.</p>
    
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h5 className="font-medium mb-2">대기중인 요청</h5>
        <p className="text-sm text-gray-500">권한 요청 승인/거부 기능이 여기에 구현됩니다.</p>
        <div className="mt-3 flex gap-2">
          <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
            승인
          </button>
          <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
            거부
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default WhitelistRequestsTab;
