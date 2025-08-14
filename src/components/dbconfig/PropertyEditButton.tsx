// 이 버튼은 DbPropertyTable 컴포넌트에서 사용되며, 데이터베이스 속성 테이블의 한 컬럼으로 들어가서 매 행마다 있으며
// 각 행의 속성을 수정하는 기능을 제공합니다 (편집 모달 창 open).
// src/ui/button.tsx 의 Button 컴포넌트를 사용합니다.

import { Button } from "../ui/button";
import type { DbProperty } from "@/types/property";

interface PropertyEditButtonProps {
  property: DbProperty;
  /** 편집 모달 열기 콜백 함수 */
  onEdit: (property: DbProperty) => void;
}

/**
 * 속성 편집 버튼 컴포넌트
 * AG-Grid 테이블의 각 행에서 사용되는 편집 버튼
 */
export const PropertyEditButton = ({
  property,
  onEdit,
}: PropertyEditButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    // 이벤트 버블링 방지 (행 클릭 이벤트와 분리)
    e.stopPropagation();

    onEdit(property);
  };

  // 버튼 스타일 (항상 활성화 상태)
  const buttonStyles =
    "w-12 h-6 px-2.5 bg-zinc-300 rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] inline-flex justify-center items-center gap-2.5 border-none hover:bg-zinc-400 transition-colors";

  const textStyles =
    "text-black-400 text-xs font-medium font-['Roboto'] leading-tight tracking-tight";

  const tooltipText = `${property.name} 속성 편집`;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={buttonStyles}
      title={tooltipText}
    >
      <span className={textStyles}>편집</span>
    </Button>
  );
};
