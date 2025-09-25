
import { type ColumnArray, type LutRules, type LutOption } from "@/stores/useColumnsStore";

/**
 * mapColumns 데이터를 multiSelectModel 형태로 변환하는 핸들러
 * @param mapColumns - 컬럼 설정 데이터 배열
 * @returns Record<string, MultiSelectOption[]> 형태의 LUT 옵션 객체
 */
export const createLutOptionsFromMapColumns = (
    mapColumns: ColumnArray[]
): Record<string, LutOption[]> => {
    const result = mapColumns
        .filter(col => col.useLut)
        .reduce((acc, col) => {
            acc[col.columnName] = col.luts;
            return acc;
        }, {} as Record<string, LutOption[]>);
    
    return result;
};

export const getMatchedLutOptions = (lutRules: LutRules[], lutOptions: Record<string, LutOption[]>, columnName: string, id: number): LutOption[] => {
    const lutRule = lutRules.find(rule => rule.sourceLutId === id);
    if (!lutRule || !lutRule.targetLutIds) {
        return lutOptions[columnName] || [];
    }
    
    const matchedLutOptions = (lutOptions[columnName] || []).filter(option => 
        lutRule.targetLutIds.includes(option.id)
    );

    if (matchedLutOptions.length === 0 && columnName === "testResult") {
        if (id === 700) {
            return (lutOptions[columnName] || []).filter(option => option.id === 600 || option.id === 601);
        } else if (id === 701) {
            return (lutOptions[columnName] || []).filter(option => option.id === 602 || option.id === 603);
        } else {
            return lutOptions[columnName] || [];
        }
    }
    return matchedLutOptions;
};
