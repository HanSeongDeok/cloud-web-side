import { useState, useEffect } from "react";
import type {
  NewWhitelistGroup,
  UpdateWhitelistGroup,
  WhitelistGroup,
} from "@/types/whitelist";

interface TeamEditModalProps {
  editingItem: WhitelistGroup | null;
  isOpen: boolean;
  onClose: () => void;
  onEditTeam: (item: WhitelistGroup | null) => void;
  onCreateTeam: (newItem: NewWhitelistGroup) => Promise<void>;
  onUpdateTeam: (
    teamId: number,
    updatedItem: UpdateWhitelistGroup
  ) => Promise<void>;
}

const TeamEditModal = ({
  editingItem = null,
  isOpen,
  onClose,
  onEditTeam,
  onCreateTeam,
  onUpdateTeam,
}: TeamEditModalProps) => {
  // 폼 입력 상태
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    whitelisted: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // editingItem이 있으면 폼에 표시, 없으면 빈 폼
      if (editingItem) {
        setFormData({
          code: editingItem.code || "",
          name: editingItem.name || "",
          whitelisted: editingItem.whitelisted || false,
        });
      } else {
        setFormData({ code: "", name: "", whitelisted: false });
      }
    }
  }, [isOpen, editingItem]);

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);
    try {
      if (editingItem) {
        // 편집 모드: UpdateWhitelistGroup 타입으로 전달
        await onUpdateTeam(editingItem.id, {
          ...editingItem,
          code: formData.code?.trim() || "",
          name: formData.name?.trim() || "",
          whitelisted: formData.whitelisted,
        });
      } else {
        // 새 아이템 추가 모드: NewWhitelistGroup 타입으로 전달
        await onCreateTeam({
          code: formData.code?.trim() || "",
          name: formData.name?.trim() || "",
          whitelisted: formData.whitelisted,
        });
      }

      // 성공 시 폼 초기화 및 모달 닫기
      setFormData({ code: "", name: "", whitelisted: false });
      onEditTeam(null);
      onClose();
    } catch (error) {
      console.error("팀 처리 실패:", error);
      // 에러는 부모 컴포넌트에서 처리됨 (AlertModal)
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ code: "", name: "", whitelisted: false });
    onEditTeam(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl border border-gray-100">
        {/* 헤더 */}
        <div className="text-center py-6 px-6 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-800">
            {editingItem ? "팀 편집" : "팀 추가"}
          </h2>
        </div>

        {/* 폼 내용 */}
        <div className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                팀 코드*
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => {
                  // 영어, 숫자, 일반적인 특수문자 허용 (한글만 차단)
                  const value = e.target.value.replace(
                    /[ㄱ-ㅎ가-힣ㅏ-ㅣ]/g,
                    ""
                  );
                  setFormData((prev) => ({ ...prev, code: value }));
                }}
                onKeyDown={(e) => {
                  // 한글 입력 방지 (IME 조합 중인 경우)
                  if (e.nativeEvent.isComposing) {
                    e.preventDefault();
                  }
                }}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                placeholder="팀 코드를 입력하세요"
                required
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                한글을 제외한 모든 문자 입력 가능합니다
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                팀 이름 {!editingItem && "(optional)"}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className={`w-full px-4 py-3 border-0 rounded-lg focus:outline-none transition-all ${
                  !!editingItem || loading
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white"
                }`}
                placeholder={editingItem ? "" : "팀 이름을 입력하세요"}
                disabled={!!editingItem || loading}
                readOnly={!!editingItem}
              />
              {editingItem && (
                <p className="mt-1 text-xs text-gray-400">
                  팀 이름은 생성 시에만 설정 가능합니다
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.whitelisted}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      whitelisted: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-blue-500 bg-gray-50 border-gray-300 rounded focus:ring-blue-400 focus:ring-2"
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-gray-600">
                  화이트리스트 팀 여부
                </span>
              </label>
            </div>
          </form>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-3 p-6 pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.code?.trim()}
            className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "처리 중..." : "완료"}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all font-medium text-sm disabled:opacity-50"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamEditModal;
