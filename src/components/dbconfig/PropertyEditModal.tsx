import type { DbProperty, NewDbProperty } from "@/types/property";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";

interface PropertyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: NewDbProperty) => void;
  property?: DbProperty | null; // 편집모드일때 DbProperty, 생성모드일 때는 null
  title?: string;
}

const PropertyEditModal = ({
  isOpen,
  onClose,
  onSave,
  property = null,
  title = property ? "속성 편집" : "속성 추가",
}: PropertyEditModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    dataType: "TEXT" as "TEXT" | "NUMBER" | "DATE" | "BOOLEAN",
    useLut: false as false | true,
    description: "",
  });

  // BUILT_IN 타입 여부 확인
  const isBuiltIn = property?.propertyType === "BUILT_IN";
  // USER_DEFINED 타입 여부 확인
  const isUserDefined = property?.propertyType === "USER_DEFINED";

  useEffect(() => {
    if (property) {
      // 편집 모드일 때 기존 데이터 로드
      setFormData({
        name: property.name,
        dataType: property.dataType,
        useLut: property.useLut,
        description: property.description,
      });
    } else {
      // 새로 만들기 모드일 때 초기화
      setFormData({
        name: "",
        dataType: "TEXT",
        useLut: false,
        description: "",
      });
    }
  }, [property, isOpen]);

  const handleInputChange = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="close"
          >
            <X size={24} />
          </button>
        </div>

        {/* 폼 내용 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              속성 이름*:
              {isBuiltIn && (
                <span className="text-xs text-gray-500 ml-2">
                  (시스템 속성은 이름만 수정 가능)
                </span>
              )}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="속성명을 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              타입:
              {isBuiltIn && (
                <span className="text-xs text-red-500 ml-2">
                  (시스템 속성은 수정 불가)
                </span>
              )}
            </label>
            <select
              title="type"
              value={formData.dataType}
              onChange={(e) =>
                handleInputChange(
                  "dataType",
                  e.target.value as "TEXT" | "NUMBER" | "DATE" | "BOOLEAN"
                )
              }
              disabled={isBuiltIn}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isBuiltIn ? "bg-gray-100 cursor-not-allowed" : "bg-white"
              }`}
            >
              <option value="TEXT">TEXT</option>
              <option value="NUMBER">NUMBER</option>
              <option value="DATE">DATE</option>
              <option value="BOOLEAN">BOOLEAN</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              드랍다운 사용 여부:
              {isBuiltIn && (
                <span className="text-xs text-red-500 ml-2">
                  (시스템 속성은 수정 불가)
                </span>
              )}
              {isUserDefined && (
                <span className="text-xs text-red-500 ml-2">
                  (사용자 정의 속성은 드랍다운 설정 수정 불가)
                </span>
              )}
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="useLut"
                  value={1}
                  checked={formData.useLut === true}
                  onChange={(e) =>
                    handleInputChange("useLut", e.target.value === "1")
                  }
                  disabled={isBuiltIn || isUserDefined}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span
                  className={`ml-2 text-sm ${
                    isBuiltIn || isUserDefined
                      ? "text-gray-400"
                      : "text-gray-700"
                  }`}
                >
                  사용 (참조 표 이용)
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="useLut"
                  value={0}
                  checked={formData.useLut === false}
                  onChange={(e) =>
                    handleInputChange("useLut", e.target.value === "1")
                  }
                  disabled={isBuiltIn || isUserDefined}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span
                  className={`ml-2 text-sm ${
                    isBuiltIn || isUserDefined
                      ? "text-gray-400"
                      : "text-gray-700"
                  }`}
                >
                  사용 안함 (자율 양식)
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
              {isBuiltIn && (
                <span className="text-xs text-red-500 ml-2">
                  (시스템 속성은 수정 불가)
                </span>
              )}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={isBuiltIn}
              rows={4}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                isBuiltIn ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              placeholder="description here..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              적용
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium"
            >
              취소
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyEditModal;
