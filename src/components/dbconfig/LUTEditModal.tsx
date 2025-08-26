import { useState, useEffect } from "react";
import { X, Plus, Minus, GripVertical } from "lucide-react";
import type { NewLutItem } from "@/types/lut";
import type { LutItem } from "@/types/lut";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  item: LutItem;
  editingItem: LutItem | null;
  onEditItemClick: (item: LutItem) => void;
  onDeleteItem: (itemId: number) => void;
}

function SortableItem({
  item,
  editingItem,
  onEditItemClick,
  onDeleteItem,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onEditItemClick(item)}
      className={`flex items-center py-2 px-4 hover:bg-gray-50 cursor-pointer transition-colors ${
        editingItem?.id === item.id
          ? "bg-blue-50 border-l-4 border-blue-500"
          : ""
      } ${isDragging ? "opacity-50 bg-gray-100" : ""}`}
    >
      {/* 드래그 핸들 */}
      <div
        {...attributes}
        {...listeners}
        className={`mr-3 cursor-move p-1 rounded hover:bg-gray-200 transition-colors ${
          isDragging ? "bg-gray-300" : "text-gray-400"
        }`}
        onClick={(e) => e.stopPropagation()} // 드래그 시작 시 클릭 이벤트 방지
      >
        <GripVertical size={20} />
      </div>

      {/* 상태 표시 (읽기 전용) */}
      <div
        className={`px-3 py-1 rounded-full text-sm font-medium mr-4 min-w-[60px] ${
          item.isActive ? "bg-blue-600 text-white" : "bg-red-600 text-white"
        }`}
      >
        {item.isActive ? "사용중" : "미사용"}
      </div>

      {/* 아이템 내용 */}
      <div className="flex-1">
        <div className="font-medium text-gray-900">{item.lutValue}</div>
        {item.description && (
          <div className="text-sm text-gray-500 mt-1">{item.description}</div>
        )}
      </div>

      {/* 편집 표시 & 삭제 버튼 */}
      <div className="ml-4 flex items-center gap-2">
        {editingItem?.id === item.id && (
          <div className="text-blue-600 text-sm font-medium">편집 중</div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation(); // 행 클릭 이벤트 방지
            const confirmDelete = window.confirm(
              `"${item.lutValue}" 아이템을 삭제하시겠습니까?`
            );
            if (confirmDelete) {
              onDeleteItem(item.id);
            }
          }}
          className="text-red-600 hover:text-red-800 transition-colors p-1"
          title="삭제"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

interface LutEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateItem: (newItem: NewLutItem) => Promise<void>;
  onEditItem: (item: LutItem | null) => void;
  onDeleteItem: (itemId: number) => Promise<void>;
  title?: string;
  initialItems?: LutItem[];
  editingItem?: LutItem | null;
  onUpdateItem: (item: LutItem) => Promise<void>;
  onUpdateOrder: (items: LutItem[]) => Promise<void>;
}

const LutEditModal = ({
  initialItems = [],
  editingItem = null,
  isOpen,
  onClose,
  onEditItem,
  onCreateItem,
  onDeleteItem,
  onUpdateItem,
  onUpdateOrder,
  title,
}: LutEditModalProps) => {
  // 폼 입력 상태 (부모에서 이미 items를 관리하므로 중복 제거)
  const [formData, setFormData] = useState({ value: "", description: "" });
  // 드래그 앤 드롭을 위한 로컬 아이템 순서 상태
  const [localItems, setLocalItems] = useState<LutItem[]>([]);

  // 센서 설정 (마우스, 터치, 키보드 지원)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // initialItems가 변경될 때 localItems 동기화 (sortOrder 기준으로 정렬)
  // 최초로 부모에게 받아올때 initialItems 를 토대로 정렬시켜서 localItems에 저장
  useEffect(() => {
    const sortedItems = [...initialItems].sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
    setLocalItems(sortedItems);
  }, [initialItems]);

  useEffect(() => {
    if (isOpen) {
      // editingItem이 있으면 폼에 표시, 없으면 빈 폼
      if (editingItem) {
        setFormData({
          value: editingItem.lutValue,
          description: editingItem.description ?? "",
        });
      } else {
        setFormData({ value: "", description: "" });
      }
    }
  }, [isOpen, editingItem]);

  const handleAddOrUpdateItem = async () => {
    try {
      if (editingItem) {
        const updatedItem = {
          ...editingItem,
          lutValue: formData.value.trim(),
          description: formData.description.trim(),
        };
        await onUpdateItem(updatedItem);

        onEditItem(updatedItem);
        alert("아이템이 수정되었습니다."); // 임시
      } else {
        // 새 아이템 추가 모드
        await onCreateItem({
          lutValue: formData.value.trim(),
          description: formData.description.trim(),
        });
      }

      // 폼 초기화 및 편집 모드 해제
      setFormData({ value: "", description: "" });
      onEditItem(null);
    } catch (error) {
      console.error("아이템 처리 실패:", error);
    }
  };

  const handleEditItemClick = (item: LutItem) => {
    // 편집할 아이템 설정
    onEditItem(item);
    // 폼에 해당 아이템 정보 표시
    setFormData({
      value: item.lutValue,
      description: item.description ?? "",
    });
  };

  const handleNewItemClick = () => {
    // 새 아이템 모드로 전환
    onEditItem(null);
    setFormData({ value: "", description: "" });
  };

  // 드래그 앤 드롭 완료 핸들러 (dnd-kit)
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setLocalItems((items) => {
        const oldIndex = items.findIndex(
          (item) => item.id.toString() === active.id
        );
        const newIndex = items.findIndex(
          (item) => item.id.toString() === over?.id
        );

        const newItems = arrayMove(items, oldIndex, newIndex);

        // sortOrder 재설정 (1부터 시작)
        return newItems.map((item, index) => ({
          ...item,
          sortOrder: index + 1,
        }));
      });
    }
  }

  const handleSave = async () => {
    // 순서가 변경되었는지 확인 (sortOrder 기준)
    const orderChanged = localItems.some((item) => {
      const originalItem = initialItems.find((orig) => orig.id === item.id);
      return originalItem && originalItem.sortOrder !== item.sortOrder;
    });

    if (orderChanged) {
      try {
        await onUpdateOrder(localItems);
      } catch (error) {
        console.error("순서 저장 실패:", error);
        return; // 에러 시 모달을 닫지 않음
      }
    }

    // 편집 모드 해제하고 모달 닫기
    onEditItem(null);
    onClose();
  };

  const handleCancel = () => {
    onEditItem(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            참조표 : {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="close"
          >
            <X size={24} />
          </button>
        </div>

        {/* 내용 영역 */}
        <div className="flex-1 overflow-y-auto">
          {/* 아이템 추가 섹션 */}
          <div className="p-6 bg-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingItem ? "아이템 수정" : "아이템 추가"}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddOrUpdateItem();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  값*:
                </label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, value: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="EV6"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명:
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="설명을 입력하세요"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  {editingItem ? "수정" : "저장"}
                </button>
              </div>
            </form>
          </div>

          {/* 아이템 리스트 섹션 */}
          <div className="p-6 flex flex-col h-80">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                아이템 리스트
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (editingItem) {
                      const confirmDelete = window.confirm(
                        `"${editingItem.lutValue}" 아이템을 삭제하시겠습니까?`
                      );
                      if (confirmDelete) {
                        onDeleteItem(editingItem.id);
                      }
                    } else {
                      alert("삭제할 아이템을 선택해주세요.");
                    }
                  }}
                  className="w-10 h-10 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                  title="선택된 아이템 삭제"
                >
                  <Minus size={20} />
                </button>
                <button
                  onClick={handleNewItemClick}
                  className="w-10 h-10 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                  title="새 아이템"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* 아이템 목록 - 스크롤 가능 */}
            <div className="border border-gray-300 rounded-lg overflow-hidden flex-1">
              {localItems.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  아이템이 없습니다. 위에서 새 아이템을 추가해보세요.
                </div>
              ) : (
                <div className="h-full overflow-y-auto">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={localItems.map((item) => item.id.toString())}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="divide-y divide-gray-200">
                        {localItems.map((item) => (
                          <SortableItem
                            key={item.id}
                            item={item}
                            editingItem={editingItem}
                            onEditItemClick={handleEditItemClick}
                            onDeleteItem={onDeleteItem}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-3 p-6 border-t bg-white">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            적용
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
export default LutEditModal;
