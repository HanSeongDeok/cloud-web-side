// 이 버튼은 DbPropertyTable 컴포넌트에서 사용되며, 데이터베이스 속성 테이블의 한 컬럼으로 들어가서 매 행마다 있으며
// 각 행의 속성을 수정하는 기능을 제공합니다 (편집 모달 창 open).
// src/ui/button.tsx 의 Button 컴포넌트를 사용합니다.

import { Button } from "../ui/button";
import type { DbProperty } from "@/types/property";

interface LUTButtonProps {
  property: DbProperty;
  /** 참조표 모달 열기 콜백 함수 */
  onOpenLutModal: (propertyId: number) => boolean;
}

/**
 * 속성 편집 버튼 컴포넌트
 * AG-Grid 테이블의 각 행에서 사용되는 편집 버튼
 */
export const LUTButton = ({ property, onOpenLutModal }: LUTButtonProps) => {
  const isLut = property.use_lut === 0;

  const handleClick = (e: React.MouseEvent) => {
    // 이벤트 버블링 방지 (행 클릭 이벤트와 분리)
    e.stopPropagation();

    // use_lut = 0일 경우 참조표 모달 열 수 없음
    if (isLut) {
      return;
    }
    onOpenLutModal(property.id);
  };

  // 디자인은 그대로 유지하되 클릭 이벤트만 제어
  const buttonStyles =
    "w-12 h-6 px-2.5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute bg-yellow-400 rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] inline-flex justify-center items-center gap-2.5 border-none hover:bg-yellow-500 transition-colors";

  const textStyles =
    "justify-start text-black text-xs font-medium font-['Roboto'] leading-tight tracking-tight";

  const tooltipText = isLut
    ? `${property.name} - 참조표를 사용하지 않는 속성입니다`
    : `${property.name} 참조표 관리`;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={buttonStyles}
      title={tooltipText}
    >
      <span className={textStyles}>참조</span>
    </Button>
  );
};
